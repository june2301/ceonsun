package com.chunsun.memberservice.application.dto;

import java.time.LocalDateTime;

import com.chunsun.memberservice.domain.Bank;
import com.chunsun.memberservice.domain.Gender;

public record TeacherDto() {
	public record CreateCardRequest(
		String description,
		String classContents,
		String careerDescription,
		String careerProgress,
		Boolean isWanted,
		Bank bank,
		String account,
		Integer price) {
	}

	public record CreateCardResponse(
		String message) {
	}

	public record UpdateCardRequest(
		String description,
		String classContents,
		String careerDescription,
		String careerProgress,
		Boolean isWanted,
		Bank bank,
		String account,
		Integer price) {
	}

	public record UpdateCardResponse(
		String message) {
	}

	public record GetCardResponse(
		String description,
		String careerDescription,
		String careerProgress,
		String classContents,
		Boolean isWanted,
		Bank bank,
		String account,
		Integer price,
		Integer totalClassCount,
		Integer totalClassHours) {
	}

	public record GetDetailResponse(
		String name,
		String nickname,
		Gender gender,
		Integer age,
		String description,
		String careerDescription,
		String careerProgress,
		String classContents,
		Integer price,
		Integer totalClassCount,
		Integer totalClassHours) {
	}

	public record ClassFinishRequest(
		Integer time
	) {
	}

	public record ClassFinishResponse(
		Integer totalClassCount,
		Integer totalClassHours
	){
	}
}
