package com.chunsun.authservice.application.dto;

import java.util.Map;

import com.chunsun.authservice.domain.entity.Role;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

public record AuthDto() {
	public interface AuthResponse {
		Role getRole();
	}

	@Getter
	@AllArgsConstructor
	public static class KakaoTokenResponseDto {
		@JsonProperty("access_token")
		private String accessToken;

		@JsonProperty("token_type")
		private String tokenType;

		@JsonProperty("scope")
		private String scope;
	}

	@Getter
	@AllArgsConstructor
	@Builder
	public static class KakaoUserInfoDto {
		private String id;
		private String nickname;
		private String email;

		@JsonProperty("kakao_account")
		public void unpackKakaoAccount(Map<String, Object> kakaoAccount) {
			if (kakaoAccount != null) {
				this.email = (String)kakaoAccount.get("email");
				Map<String, Object> profile = (Map<String, Object>)kakaoAccount.get("profile");

				if (profile != null) {
					this.nickname = (String)profile.get("nickname");
				}
			}
		}
	}

	@Getter
	@AllArgsConstructor
	@Builder
	public static class AuthLoginTokenResponseDto implements AuthResponse {
		private String token;
		private String refreshToken;
		private Role role;
	}

	@Getter
	@AllArgsConstructor
	@Builder
	public static class AuthGuestResponseDto implements AuthResponse {
		private Role role;
		private String kakaoId;
		private String nickname;
		private String email;
	}
}