package com.chunsun.memberservice.application.dto;

import com.chunsun.memberservice.domain.Gender;

public record StudentDto() {
	public record CreateCardRequest(
		boolean isExposed,
		String description) {
	}

	public record CreateCardResponse(
		String message) {
	}

	public record UpdateCardRequest(
		boolean isExposed,
		String description) {
	}

	public record UpdateCardResponse(
		String message) {
	}

	public record GetCardResponse(
		boolean isExposed,
		String description) {
	}

	public record GetDetailResponse(
		String name,
		String nickname,
		Gender gender,
		int age,
		String description) {
	}

}
