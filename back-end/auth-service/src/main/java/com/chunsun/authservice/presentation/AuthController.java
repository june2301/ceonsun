package com.chunsun.authservice.presentation;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.chunsun.authservice.application.dto.AuthDto;
import com.chunsun.authservice.application.service.AuthService;
import com.chunsun.authservice.application.service.KakaoAuthService;
import com.chunsun.authservice.common.error.AuthErrorCodes;
import com.chunsun.authservice.common.exception.BusinessException;
import com.chunsun.authservice.util.CookieUtil;
import com.chunsun.authservice.util.HeaderUtil;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping
public class AuthController {
	private final KakaoAuthService kakaoAuthService;
	private final AuthService authService;

	/**
	 * 카카오 인가 코드를 받아 엑세스 토큰 생성 및 유저 로그인
	 *
	 * @param authHeader  카카오에서 전달받은 인가 코드
	 * @return AuthDto.AuthResponseDto 로그인 성공 시 accessToken, 실패 시 유저 정보 포함한 DTO 반환
	 */
	@PostMapping("/login")
	public Mono<ResponseEntity<?>> login(
		@RequestHeader("X-Chunsun-Kakao-Auth-Code") String authHeader,
		HttpServletResponse response) {
		var kakaoAuthCode = HeaderUtil.extractToken(authHeader);

		log.info("accessCode : {}", kakaoAuthCode );

		return kakaoAuthService.getKakaoToken(kakaoAuthCode)
			.flatMap(tokenResponse -> {
				try {
					var accessToken = tokenResponse.getAccessToken();

					return kakaoAuthService.getKakaoUserInfo(accessToken)
						.flatMap(userInfo -> {

							var authResponse = authService.login(userInfo);

							if (authResponse instanceof AuthDto.AuthGuestResponseDto) {
								return Mono.just(ResponseEntity.accepted().body(authResponse));
							}

							var loginResponse = (AuthDto.AuthLoginTokenResponseDto)authResponse;
							CookieUtil.addCookie(response, "refreshToken", loginResponse.getRefreshToken());

							return Mono.just(createAuthResponse(loginResponse.getToken()));
						});
				} catch (Exception e) {
					return Mono.error(new BusinessException(AuthErrorCodes.INVALID_KAKAO_AUTHORIZATION_CODE));
				}
			})
			.onErrorResume(e -> {
					throw new BusinessException(AuthErrorCodes.INVALID_KAKAO_AUTHORIZATION_CODE);
				}
			);
	}

	/**
	 * 천선 엑세스 토큰 검증
	 *
	 * @param authHeader  천선 엑세스 토큰
	 */
	@PostMapping("/validate")
	public ResponseEntity<Void> validateToken(
		@RequestHeader("X-Chunsun-Authorization") String authHeader) {
		var token = HeaderUtil.extractToken(authHeader);

		authService.validateToken(token);

		return ResponseEntity.noContent().build();
	}

	/**
	 * 천선 리프레시 토큰 삭제
	 *
	 * @param refreshToken  천선 리프레시 토큰
	 */
	@GetMapping("/logout")
	public ResponseEntity<Void> deleteRefreshToken(
		@CookieValue(value = "refreshToken", required = false) String refreshToken,
		HttpServletResponse response) {

		authService.deleteRefreshToken(refreshToken);
		CookieUtil.deleteRefreshToken(response);

		return ResponseEntity.noContent().build();
	}

	/**
	 * 천선 사용자 정보 변경으로 인한 엑세스 토큰 재발급
	 *
	 * @param authHeader  천선 엑세스 토큰
	 */
	@PostMapping("/refreshAll")
	public ResponseEntity<Void> refreshAllToken(
		@RequestHeader("X-Chunsun-Authorization") String authHeader,
		@CookieValue(value = "refreshToken", required = false) String refreshToken,
		HttpServletResponse response) {
		var accessToken = HeaderUtil.extractToken(authHeader);

		var authResponse = authService.replaceAllToken(accessToken, refreshToken);
		CookieUtil.addCookie(response, "refreshToken", authResponse.getRefreshToken());

		return createAuthResponse(authResponse.getToken());
	}

	/**
	 * 천선 리프레시 토큰 발급
	 *
	 * @param refreshToken  천선 리프레시 코드 ( 쿠키 )
	 * @return accessToken 새로 생성된 천선 엑세스 코드 ( 헤더 )
	 * @return refreshToken 새로 생성된 천선 리프레시 코드 ( 쿠키 )
	 */
	@PostMapping("/refresh")
	public ResponseEntity<Void> refreshToken(
		@CookieValue(value = "refreshToken", required = false) String refreshToken,
		HttpServletResponse response
	) {
		if (refreshToken == null) {
			throw new BusinessException(AuthErrorCodes.NOT_EXIST_AUTHORIZATION_REFRESH_TOKEN);
		}

		var authResponse = authService.refreshAccessToken(refreshToken);
		CookieUtil.addCookie(response, "refreshToken", authResponse.getRefreshToken());

		return createAuthResponse(authResponse.getToken());
	}

	/**
	 * 천선 인가 코드 테스트
	 *
	 * @param code  천선 엑세스 코드
	 */
	@GetMapping("/login")
	public Mono<ResponseEntity<?>> kakaoLoginCallback(@RequestParam("code") String code) {
		return Mono.just(ResponseEntity.ok(code));
	}

	private ResponseEntity<Void> createAuthResponse(String authToken) {
		return ResponseEntity.noContent()
			.header("X-Chunsun-Authorization", "Bearer " + authToken)
			.build();
	}
}