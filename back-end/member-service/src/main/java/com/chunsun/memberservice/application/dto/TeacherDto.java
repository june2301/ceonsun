package com.chunsun.memberservice.application.dto;

import com.chunsun.memberservice.domain.Bank;
import com.chunsun.memberservice.domain.Gender;

public record TeacherDto() {
	public record CreateCardRequest(
		String description,
		String classContents,
		String careerDescription,
		String careerProgress,
		boolean isWanted,
		Bank bank,
		String account,
		int price) {
	}

	public record CreateCardResponse(
		String message) {
	}

	public record UpdateCardRequest(
		String description,
		String classContents,
		String careerDescription,
		String careerProgress,
		boolean isWanted,
		Bank bank,
		String account,
		int price) {
	}

	public record UpdateCardResponse(
		String message) {
	}

	public record GetCardResponse(
		String description,
		String careerDescription,
		String careerProgress,
		String classContents,
		boolean isWanted,
		Bank bank,
		String account,
		int price,
		int totalClassCount,
		int totalClassHours) {
	}

	public record GetDetailResponse(
		String name,
		String nickname,
		Gender gender,
		int age,
		String description,
		String careerDescription,
		String careerProgress,
		String classContents,
		int price,
		int totalClassCount,
		int totalClassHours) {
	}
}
