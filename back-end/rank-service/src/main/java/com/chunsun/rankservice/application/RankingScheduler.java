package com.chunsun.rankservice.application;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.chunsun.rankservice.application.service.RankingService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class RankingScheduler {

	private final RankingService rankingService;

	@Scheduled(cron = "0 0 0/3 * * *") // 3시간 단위 실행
	public void mergeRealTimeViewsAndClass() {

		rankingService.mergeRealTimeData();
		System.out.println("조회수, 수업횟수 Redis에 반영");
		rankingService.getTopRankedTeachers(3);
		System.out.println("상위 3명 조회");
	}

	@Scheduled(cron = "0 10 3 * * *") // 24시간 단위 실행
	public void mergeRedisAndDB() {

		rankingService.updateDatabaseRankingPoints();
		System.out.println("Redis -> DB 저장 완료");
		rankingService.syncRedisRankingPoints();
		System.out.println("DB -> Redis 적용 완료");
	}
}
