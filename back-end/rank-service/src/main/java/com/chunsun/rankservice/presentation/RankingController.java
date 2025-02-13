package com.chunsun.rankservice.presentation;

import java.util.Set;

import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chunsun.rankservice.application.service.RankingService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/ranking")
public class RankingController {

	private final RankingService rankingService;

	@PostMapping("/{teacherId}/view")
	public String incrementTeacherViewCount(@PathVariable Long teacherId) {

		rankingService.incrementTeacherViewCount(teacherId);

		return "조회수 증가";
	}

	@PostMapping("/{teacherId}/class")
	public String incrementTeacherClassCount(@PathVariable Long teacherId) {

		rankingService.incrementTeacherClassCount(teacherId);

		return "수업횟수 증가";
	}

	@PostMapping("/merge") // 3시간 단위
	public String mergeRealTimeData() {

		rankingService.mergeRealTimeData();

		return "조회수, 수업횟수 DB 저장, 가중치 적용 후 Redis 반영완료";
	}

	@PostMapping("/update") // 24시간 단위
	public String updateDatabaseRankingPoints() {

		rankingService.updateDatabaseRankingPoints();

		return "DB 랭킹 포인트 업데이트";
	}

	@PostMapping("/sync") //24시간 단위
	public String syncRedisRankingPoints() {

		rankingService.syncRedisRankingPoints();

		return "Redis 랭킹 포인트 업데이트";
	}

	@GetMapping("/top/{count}")
	public Set<ZSetOperations.TypedTuple<String>> getTopRankedTeachers(@PathVariable int count) {

		return rankingService.getTopRankedTeachers(count);
	}
}
