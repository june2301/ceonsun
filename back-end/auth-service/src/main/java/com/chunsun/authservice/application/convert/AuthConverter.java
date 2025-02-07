package com.chunsun.authservice.application.convert;

import com.chunsun.authservice.application.dto.AuthDto;
import com.chunsun.authservice.application.dto.MemberDto;
import com.chunsun.authservice.domain.entity.Member;
import com.chunsun.authservice.domain.entity.Role;

public class AuthConverter {
	public static MemberDto of(Member member) {
		return new MemberDto(member.getId(), member.getNickname(), member.getRole());
	}

	public static AuthDto.AuthLoginTokenResponseDto toAuthLoginTokenResponse(String token, String refreshToken,
		Role role) {
		return AuthDto.AuthLoginTokenResponseDto.builder()
			.token(token)
			.refreshToken(refreshToken)
			.role(role)
			.build();
	}

	public static AuthDto.AuthGuestResponseDto toAuthResponseDtoForNewUser(AuthDto.KakaoUserInfoDto userInfoDto) {
		return AuthDto.AuthGuestResponseDto.builder()
			.role(Role.GUEST)
			.kakaoId(userInfoDto.getId())
			.nickname(userInfoDto.getNickname())
			.email(userInfoDto.getEmail())
			.build();
	}
}
