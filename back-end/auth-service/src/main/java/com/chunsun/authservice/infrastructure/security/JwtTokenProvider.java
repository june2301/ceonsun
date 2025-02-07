package com.chunsun.authservice.infrastructure.security;

import java.util.Base64;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.chunsun.authservice.application.dto.MemberDto;
import com.chunsun.authservice.common.error.AuthErrorCodes;
import com.chunsun.authservice.common.exception.BusinessException;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtTokenProvider {
	@Value("${token.secret}")
	private String secretKey;

	@Value("${token.access_expiration_time}")
	private Long tokenExpiry;

	@Value("${token.refresh_expiration_time}")
	private Long refreshTokenExpiry;

	private final SnowflakeIdGenerator idGenerator;

	@PostConstruct
	public void init() {
		secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
	}

	public String createToken(MemberDto memberDto) {
		return Jwts.builder()
			.setSubject(String.valueOf(memberDto.id()))
			.claim("nickname", memberDto.nickname())
			.claim("role", memberDto.role())
			.setIssuedAt(new Date())
			.setExpiration(new Date(System.currentTimeMillis() + tokenExpiry))
			.signWith(SignatureAlgorithm.HS256, secretKey)
			.compact();
	}

	public String createRefreshToken() {
		return Jwts.builder()
			.setSubject(String.valueOf(idGenerator.nextId()))
			.setIssuedAt(new Date())
			.setExpiration(new Date(System.currentTimeMillis() + refreshTokenExpiry))
			.signWith(SignatureAlgorithm.HS256, secretKey)
			.compact();
	}

	public void validateToken(String token) {
		try {
			Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token);
		} catch (JwtException e) {
			throw new BusinessException(AuthErrorCodes.INVALID_AUTHORIZATION_TOKEN);
		}
	}

	public String getClaims(String token) {
		try {
			return Jwts.parserBuilder()
				.setSigningKey(secretKey)
				.build()
				.parseClaimsJws(token)
				.getBody()
				.getSubject();
		} catch (JwtException e) {
			log.error("아 왜 실패함;;: {} : ", e.getLocalizedMessage());
			throw new BusinessException(AuthErrorCodes.INVALID_AUTHORIZATION_TOKEN);
		}
	}
}
