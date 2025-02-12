package com.chunsun.rankservice.domain.entity;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "teacher_stats")
@Getter
@Setter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class RankingData {

	@Id
	@Column(name = "teacher_id")
	private Long teacherId; // 선생 ID (Primary Key)

	@Column(name = "lessons", nullable = false)
	private int totalLessons = 0; // 과거 과외 횟수

	@Column(name = "views", nullable = false)
	private int totalViews = 0; // 과거 조회수

	@Column(name = "total_score", nullable = false)
	private Long totalScore = 0L; // 최종 랭킹 점수

	public RankingData(Long teacherId, int totalLessons, int totalViews, Long totalScore) {
		this.teacherId = teacherId;
		this.totalLessons = totalLessons;
		this.totalViews = totalViews;
		this.totalScore = totalScore;
	}
}