package com.chunsun.memberservice.application.dto;

import java.time.LocalDate;

import com.chunsun.memberservice.domain.Gender;

public record MemberDto() {

	public record SignUpRequest(
		String kakaoId,
		String email) {
	}

	public record SignUpResponse(
		String message,
		String token) {
	}

	public record InsertInfoRequest(
		String name,
		String nickname,
		LocalDate birthdate,
		Gender gender) {
	}

	public record InsertInfoResponse() {
	}

	public record UpdateInfoRequest(
		String nickname,
		String profileImage
	) {
	}

	public record UpdateInfoResponse() {
	}

	public record GetInfoRequest() {
	}

	public record GetInfoResponse(
		String name,
		String nickname,
		String email,
		LocalDate birthdate,
		Gender gender,
		String profileImage
	) {
	}
}
