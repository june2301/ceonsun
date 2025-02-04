package com.chunsun.memberservice.domain;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import jakarta.persistence.Entity;
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
@Table(name = "students")
@Getter
@NoArgsConstructor
public class Student {

	@Id
	private Long id;

	@MapsId
	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "id")
	private Member member;


	private boolean isExposed;

	private String description;

	@CreatedDate
	private LocalDateTime createdAt;

	@LastModifiedDate
	private LocalDateTime updatedAt;

	private LocalDateTime deletedAt;

	@Version
	private Long Version;

	public Student(Member member, boolean isExposed, String description) {
		this.member = member;
		this.id = member.getId();
		this.isExposed = isExposed;
		this.description = description;
		createdAt = LocalDateTime.now();
	}

	public void updateCard(boolean isExposed, String description) {
		this.isExposed = isExposed;
		this.description = description;
		updatedAt = LocalDateTime.now();
	}


}
