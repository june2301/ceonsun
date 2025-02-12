package com.chunsun.rankservice.application.service;

import java.util.Set;

import org.springframework.data.redis.core.ZSetOperations;

public interface RankingService {

	void incrementTeacherViewCount(Long teacherId);

	void incrementTeacherClassCount(Long teacherId);

	void mergeRealTimeData();

	void updateDatabaseRankingPoints();

	void syncRedisRankingPoints();

	Set<ZSetOperations.TypedTuple<String>> getTopRankedTeachers(int count);
}
