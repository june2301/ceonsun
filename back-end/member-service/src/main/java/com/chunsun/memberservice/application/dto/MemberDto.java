package com.chunsun.memberservice.application.dto;

public record MemberDto() {

	public record SignUpRequest(String kakaoId, String email) {

	}

	public record SignUpResponse(String token) {

	}
}
