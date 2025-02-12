package com.chunsun.rankservice.application.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chunsun.rankservice.application.calculator.ScoreCalculator;
import com.chunsun.rankservice.application.calculator.ScoreFactors;
import com.chunsun.rankservice.domain.entity.RankingData;
import com.chunsun.rankservice.domain.repository.RankingRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RankingServiceImpl implements RankingService {

	private final RankingRepository rankingRepository;
	private final ZSetOperations<String, String> zSet;
	private final ScoreCalculator scoreCalculator;

	private static final String VIEW_KEY = "teacher:view"; // 조회수
	private static final String CLASS_KEY = "teacher:class"; // 수업 횟수
	private static final String SCORE_KEY = "teacher:score";   // 총 점수
	private final RedisTemplate<String, String> redisTemplate;

	// 조회수 증가
	@Override
	@Transactional
	public void incrementTeacherViewCount(Long teacherId) {
		zSet.incrementScore(VIEW_KEY, String.valueOf(teacherId), 1);
	}

	// 수업 횟수 증가
	@Override
	@Transactional
	public void incrementTeacherClassCount(Long teacherId) {
		zSet.incrementScore(CLASS_KEY, String.valueOf(teacherId), 1);
	}

	// 실시간 조회수, 수업 횟수 -> Redis 총점수 반영
	@Override
	@Transactional
	public void mergeRealTimeData() {
		// Redis에서 실시간 조회수와 수업 횟수를 가져와 로컬 변수에 저장
		Set<ZSetOperations.TypedTuple<String>> viewScores = zSet.reverseRangeWithScores(VIEW_KEY, 0, -1);
		Set<ZSetOperations.TypedTuple<String>> classScores = zSet.reverseRangeWithScores(CLASS_KEY, 0, -1);

		// 파이프라인으로 총점 업데이트 및 Redis 데이터 삭제
		redisTemplate.executePipelined((RedisCallback<Object>) connection -> {
			for (ZSetOperations.TypedTuple<String> viewData : viewScores) {
				String teacherId = viewData.getValue();
				double viewScore = (viewData.getScore() != null) ? viewData.getScore() : 0;

				// 해당 선생의 수업 횟수 데이터 찾기
				double classScore = classScores.stream()
					.filter(classData -> classData.getValue().equals(teacherId))
					.mapToDouble(classData -> classData.getScore() != null ? classData.getScore() : 0)
					.findFirst()
					.orElse(0);

				// ScoreFactors 값 설정
				ScoreFactors factors = new ScoreFactors();
				factors.setViewScore(viewScore);
				factors.setClassScore(classScore);

				// 가중치 적용 추가 점수 계산
				double weightedScore = scoreCalculator.calculateScore(factors);

				// 기존 총점수 가져오기
				Double currentScore = zSet.score(SCORE_KEY, teacherId);
				double previousScore = (currentScore != null) ? currentScore : 0;

				// 총점수 업데이트
				connection.zAdd(SCORE_KEY.getBytes(), previousScore + weightedScore, teacherId.getBytes());

				// 조회수 및 수업 횟수 데이터 삭제
				connection.zRem(VIEW_KEY.getBytes(), teacherId.getBytes());
				connection.zRem(CLASS_KEY.getBytes(), teacherId.getBytes());
			}
			return null;
		});


		List<RankingData> rankingDataList = new ArrayList<>();

		// viewScores를 기반으로 DB 업데이트 수행
		for (ZSetOperations.TypedTuple<String> viewData : viewScores) {
			String teacherId = viewData.getValue();
			double viewScore = (viewData.getScore() != null) ? viewData.getScore() : 0;

			// classScores에서도 해당 teacherId의 수업 횟수를 찾음
			double classScore = classScores.stream()
				.filter(classData -> classData.getValue().equals(teacherId))
				.mapToDouble(classData -> classData.getScore() != null ? classData.getScore() : 0)
				.findFirst()
				.orElse(0);

			// 기존 RankingData 조회 또는 새 객체 생성
			RankingData rankingData = rankingRepository.findById(Long.parseLong(teacherId))
				.orElseGet(() -> new RankingData(Long.parseLong(teacherId), 0, 0, 0L));

			rankingData.setTotalViews(rankingData.getTotalViews() + (int) viewScore);
			rankingData.setTotalLessons(rankingData.getTotalLessons() + (int) classScore);
			rankingDataList.add(rankingData);
		}

		// Batch Insert 또는 Batch Update 수행
		rankingRepository.saveAll(rankingDataList);
	}


	// Redis에 있는 총점수를 db에 반영 24시간 단위
	@Override
	@Transactional
	public void updateDatabaseRankingPoints() {
		Set<ZSetOperations.TypedTuple<String>> allTeachers = zSet.reverseRangeWithScores(SCORE_KEY, 0, -1);

		List<RankingData> rankingDataList = new ArrayList<>();

		redisTemplate.executePipelined((RedisCallback<Object>) connection -> {
			for (ZSetOperations.TypedTuple<String> teacher : allTeachers) {
				String teacherId = teacher.getValue();
				double totalPoints = (teacher.getScore() != null) ? teacher.getScore() : 0;

				RankingData teacherScore = rankingRepository.findById(Long.parseLong(teacherId))
					.orElseGet(() -> {
						RankingData newTeacher = new RankingData();
						newTeacher.setTeacherId(Long.parseLong(teacherId));
						newTeacher.setTotalScore(0L);
						return newTeacher;
					});

				long previousScore = (teacherScore.getTotalScore() != null) ? teacherScore.getTotalScore() : 0L;

				long newTotalScore = Math.round(totalPoints - (previousScore * 0.5));

				teacherScore.setTotalScore(newTotalScore);
				rankingDataList.add(teacherScore);

				// Redis 초기화
				connection.zRem(SCORE_KEY.getBytes(), teacherId.getBytes());
			}

			return null;
		});

		// Batch Insert 또는 Batch Update
		rankingRepository.saveAll(rankingDataList);
	}

	// DB에 있는 총점수를 redis에 반영
	@Override
	@Transactional
	public void syncRedisRankingPoints() {
		List<RankingData> allTeachers = rankingRepository.findAll();

		redisTemplate.executePipelined((RedisCallback<Object>) connection -> {
			for (RankingData teacher : allTeachers) {
				String teacherId = String.valueOf(teacher.getTeacherId());
				double totalPoints = (double) teacher.getTotalScore();

				//  저장
				connection.zAdd(SCORE_KEY.getBytes(), totalPoints, teacherId.getBytes());
			}
			return null;
		});
	}

	// 상위 n명 조회
	@Override
	public Set<ZSetOperations.TypedTuple<String>> getTopRankedTeachers(int count) {
		Set<ZSetOperations.TypedTuple<String>> result = zSet.reverseRangeWithScores(SCORE_KEY, 0, count - 1);
		//Redis에 데이터가 없으면 빈 set 반환
		return (result != null) ? result : Set.of();
	}
}