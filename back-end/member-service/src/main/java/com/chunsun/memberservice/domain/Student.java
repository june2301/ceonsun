package com.chunsun.memberservice.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "students")
@Getter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@PrimaryKeyJoinColumn(name = "id")
public class Student extends Member {

	private boolean isExposed;

	private String description;

	@CreatedDate
	private LocalDateTime createdAt;

	@LastModifiedDate
	private LocalDateTime updatedAt;

	private LocalDateTime deletedAt;

	public Student(Long id, boolean isExposed, String description) {
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
