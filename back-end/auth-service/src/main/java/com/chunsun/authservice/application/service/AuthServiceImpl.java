package com.chunsun.authservice.application.service;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
	private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);
	private final JwtTokenProvider jwtTokenProvider;
	private final MemberRepository memberRepository;
	private final RefreshTokenStore refreshTokenStore;

	@Override
	public AuthDto.AuthResponse login(AuthDto.KakaoUserInfoDto userInfoDto) {
		Optional<Member> searchMember = memberRepository.findByKakaoId(userInfoDto.getId());

		if (searchMember.isPresent()) {
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
		MemberDto member = refreshTokenStore.getMemberByToken(refreshToken)
			.orElseThrow(() -> new BusinessException(AuthErrorCodes.INVALID_AUTHORIZATION_REFRESH_TOKEN));

		String newAccessToken = jwtTokenProvider.createToken(member);
		String newRefreshToken = jwtTokenProvider.createRefreshToken();

		refreshTokenStore.removeToken(refreshToken);
		refreshTokenStore.saveToken(newRefreshToken, member);

		return AuthConverter.toAuthLoginTokenResponse(newAccessToken, newRefreshToken, member.role());
	}

	@Override
	public AuthDto.AuthLoginTokenResponseDto replaceAllToken(String accessToken, String refreshToken) {
		long userId = Long.parseLong(jwtTokenProvider.getClaims(accessToken));

		Member member = memberRepository.findById(userId)
			.orElseThrow(() -> new BusinessException(AuthErrorCodes.NOT_EXIST_MEMBER));
		MemberDto memberDto = AuthConverter.of(member);

		String newAccessToken = jwtTokenProvider.createToken(memberDto);
		String newRefreshToken = jwtTokenProvider.createRefreshToken();

		refreshTokenStore.removeToken(refreshToken);
		refreshTokenStore.saveToken(newRefreshToken, memberDto);

		return AuthConverter.toAuthLoginTokenResponse(newAccessToken, newRefreshToken, member.getRole());
	}

	@Override
	public void deleteRefreshToken(String refreshToken) {
		refreshTokenStore.removeToken(refreshToken);
	}
}
