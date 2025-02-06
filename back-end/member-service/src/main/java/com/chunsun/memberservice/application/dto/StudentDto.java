package com.chunsun.memberservice.application.dto;

import java.util.List;

import com.chunsun.memberservice.domain.Entity.Category;
import com.chunsun.memberservice.domain.Enum.Gender;

public record StudentDto() {
	public record CardRequest(
		Long id,
		Boolean isExposed,
		String description) {
	}

	public record CardResponse(
		String message) {
	}

	public record GetCardRequest(
		Long id
	) {
	}

	public record GetCardResponse(
		Boolean isExposed,
		String description,
		List<Category> categories) {
	}

	public record GetDetailResponse(
		String name,
		String nickname,
		Gender gender,
		Integer age,
		String description,
		List<Category> categories) {
	}

}
