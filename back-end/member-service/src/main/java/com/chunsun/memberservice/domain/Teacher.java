package com.chunsun.memberservice.domain;

import java.time.LocalDateTime;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "teachers")
@Getter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@PrimaryKeyJoinColumn(name = "id")
public class Teacher extends Member{

	private String description;

	private String careerDescription;

	private String classContents;

	private String classProgress;

	private int totalClassCount;

	private int totalClassHours;

	private boolean isWanted;

	// 은행 추가 필요
	@Enumerated(EnumType.STRING)
	private Bank bank;

	private String account;

	private int price;

	// createdAt 과 updatedAt은 부모로 부터 상속 받기 때문에 필요 없음.
	private LocalDateTime deletedAt;

}
