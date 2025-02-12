package com.chunsun.authservice.application.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.chunsun.authservice.application.convert.AuthConverter;
import com.chunsun.authservice.application.dto.AuthDto;
import com.chunsun.authservice.application.dto.MemberDto;
import com.chunsun.authservice.common.error.AuthErrorCodes;
import com.chunsun.authservice.common.exception.BusinessException;
import com.chunsun.authservice.domain.entity.Member;
import com.chunsun.authservice.domain.repository.MemberRepository;
import com.chunsun.authservice.infrastructure.security.JwtTokenProvider;
import com.chunsun.authservice.infrastructure.security.RefreshTokenStore;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
	private final JwtTokenProvider jwtTokenProvider;
	private final MemberRepository memberRepository;
	private final RefreshTokenStore refreshTokenStore;

	@Override
	public AuthDto.AuthResponse login(AuthDto.KakaoUserInfoDto userInfoDto) {
		Optional<Member> searchMember = memberRepository.findByKakaoId(userInfoDto.getId());

		if (searchMember.isPresent()) {
			if (searchMember.get().getDeletedAt() != null) {
				throw new BusinessException(AuthErrorCodes.ALREADY_DELETED_MEMBER);
			}

			MemberDto memberDto = AuthConverter.of(searchMember.get());
			String accessToken = jwtTokenProvider.createToken(memberDto);
			String refreshToken = jwtTokenProvider.createRefreshToken();

			refreshTokenStore.saveToken(refreshToken, memberDto);

			return AuthConverter.toAuthLoginTokenResponse(accessToken, refreshToken, memberDto.role());
		}

		return AuthConverter.toAuthResponseDtoForNewUser(userInfoDto);
	}

	@Override
	public void validateToken(String token) {
		jwtTokenProvider.validateToken(token);
	}

	public AuthDto.AuthLoginTokenResponseDto refreshAccessToken(String refreshToken) {
		log.info("refresh token: {}", refreshToken);
		MemberDto member = refreshTokenStore.getMemberByToken(refreshToken)
			.orElseThrow(() -> new BusinessException(AuthErrorCodes.INVALID_AUTHORIZATION_REFRESH_TOKEN));

		String newAccessToken = jwtTokenProvider.createToken(member);
		String newRefreshToken = jwtTokenProvider.createRefreshToken();

		refreshTokenStore.removeToken(refreshToken);
		refreshTokenStore.saveToken(newRefreshToken, member);

		return AuthConverter.toAuthLoginTokenResponse(newAccessToken, newRefreshToken, member.role());
	}

	@Override
	public AuthDto.AuthLoginTokenResponseDto changeRoleAndRefreshToken(String refreshToken) {
		log.info("refresh token: {}", refreshToken);
		Long userId = refreshTokenStore.getMemberByToken(refreshToken)
			.orElseThrow(() -> new BusinessException(AuthErrorCodes.NOT_EXIST_AUTHORIZATION_REFRESH_TOKEN))
			.id();

		Member member = memberRepository.findById(userId)
			.orElseThrow(() -> new BusinessException(AuthErrorCodes.NOT_EXIST_MEMBER));
		MemberDto memberDto = AuthConverter.of(member);

		String newAccessToken = jwtTokenProvider.createToken(memberDto);
		String newRefreshToken = jwtTokenProvider.createRefreshToken();

		refreshTokenStore.removeToken(refreshToken);
		refreshTokenStore.saveToken(newRefreshToken, memberDto);

		return AuthConverter.toAuthLoginTokenResponse(newAccessToken, newRefreshToken, memberDto.role());
	}

	@Override
	public void deleteRefreshToken(String refreshToken) {
		refreshTokenStore.removeToken(refreshToken);
	}
}
