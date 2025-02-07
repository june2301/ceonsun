package com.chunsun.authservice.application.service;

import com.chunsun.authservice.application.dto.AuthDto;

public interface AuthService {
	AuthDto.AuthResponse login(AuthDto.KakaoUserInfoDto userInfoDto);

	void validateToken(String token);

	AuthDto.AuthLoginTokenResponseDto refreshAccessToken(String refreshToken);

	AuthDto.AuthLoginTokenResponseDto replaceAllToken(String accessToken, String refreshToken);

	void deleteRefreshToken(String refreshToken);
}
