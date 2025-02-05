package com.chunsun.memberservice.application.dto;

import java.util.List;

import com.chunsun.memberservice.domain.Category;
import com.chunsun.memberservice.domain.Gender;

public record StudentDto() {
	public record CreateCardRequest(
		Boolean isExposed,
		String description) {
	}

	public record CreateCardResponse(
		String message) {
	}

	public record UpdateCardRequest(
		Boolean isExposed,
		String description) {
	}

	public record UpdateCardResponse(
		String message) {
	}

	public record GetCardResponse(
		Boolean isExposed,
		String description) {
	}

	public record GetDetailResponse(
		String name,
		String nickname,
		Gender gender,
		Integer age,
		String description) {
	}

}
