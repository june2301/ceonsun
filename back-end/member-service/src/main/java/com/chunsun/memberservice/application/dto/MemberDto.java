package com.chunsun.memberservice.application.dto;

import java.time.LocalDate;

import com.chunsun.memberservice.domain.Gender;
import com.chunsun.memberservice.domain.Role;

public record MemberDto() {

	public record KaKaoRequest(
		String kakaoId,
		String email) {
	}

	public record KaKaoResponse(){

	}

	public record SignUpRequest(
		String name,
		String nickname,
		LocalDate birthdate,
		Gender gender) {
	}

	public record SignUpResponse(
		String message,
		String token) {
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
