package com.chunsun.memberservice.domain;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "teachers")
@Getter
@NoArgsConstructor
public class Teacher {

	@MapsId
	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "id")
	private Member member;

	@Id
	private Long id;

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

	@Version
	private Long Version;

	@CreatedDate
	private LocalDateTime createdAt;

	@LastModifiedDate
	private LocalDateTime updatedAt;

	private LocalDateTime deletedAt;

	public Teacher(Member member, String description, String careerDescription, String classContents, String classProgress, boolean isWanted, Bank bank, String account, int price) {
		this.member = member;
		this.id = member.getId();
		this.description = description;
		this.classContents = classContents;
		this.careerDescription = careerDescription;
		this.classProgress = classProgress;
		this.isWanted = isWanted;
		this.bank = bank;
		this.account = account;
		this.price = price;
		createdAt = LocalDateTime.now();
	}

	public void updateCard(String description, String classContents, String careerDescription, String classProgress, boolean isWanted, Bank bank, String account, int price) {
		this.description = description;
		this.classContents = classContents;
		this.careerDescription = careerDescription;
		this.classProgress = classProgress;
		this.isWanted = isWanted;
		this.bank = bank;
		this.account = account;
		this.price = price;
		updatedAt = LocalDateTime.now();
	}

}
