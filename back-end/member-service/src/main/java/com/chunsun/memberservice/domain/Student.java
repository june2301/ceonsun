package com.chunsun.memberservice.domain;

import java.time.LocalDateTime;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "students")
@Getter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@PrimaryKeyJoinColumn(name = "id")
public class Student extends Member{

	private boolean isExposed;

	private String description;

	// createdAt 과 updatedAt은 부모로 부터 상속 받기 때문에 필요 없음.
	private LocalDateTime deletedAt;

}
