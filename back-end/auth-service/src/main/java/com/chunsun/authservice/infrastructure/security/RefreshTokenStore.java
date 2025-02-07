package com.chunsun.authservice.infrastructure.security;

import java.util.Optional;
import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.RedisConnectionFailureException;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import com.chunsun.authservice.application.dto.MemberDto;
import com.chunsun.authservice.common.error.AuthErrorCodes;
import com.chunsun.authservice.common.error.GlobalErrorCodes;
import com.chunsun.authservice.common.exception.BusinessException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class RefreshTokenStore {
	private static final String REDIS_PREFIX = "chunsun_refresh";
	private static final Logger log = LoggerFactory.getLogger(RefreshTokenStore.class);

	private final StringRedisTemplate redisTemplate;
	private final ObjectMapper objectMapper;

	@Value("${token.refresh_expiration_time}")
	private Long refreshExpirationTime;

	public void saveToken(String refreshToken, MemberDto memberDto) {
		try {
			String memberJson = objectMapper.writeValueAsString(memberDto);
			redisTemplate.opsForValue()
				.set(REDIS_PREFIX + refreshToken, memberJson, refreshExpirationTime, TimeUnit.MILLISECONDS);
		} catch (JsonProcessingException e) {
			throw new BusinessException(AuthErrorCodes.MEMBER_JSON_SERIALIZE_FAIL);
		} catch (RedisConnectionFailureException e) {
			log.info("Redis connect Error");
			throw new BusinessException(GlobalErrorCodes.INTERNAL_SERVER_ERROR);
		}
	}

	public Optional<MemberDto> getMemberByToken(String refreshToken) {
		try {
			String memberJson = redisTemplate.opsForValue().get(REDIS_PREFIX + refreshToken);
			if (memberJson == null) {
				return Optional.empty();
			}

			return Optional.of(objectMapper.readValue(memberJson, MemberDto.class));
		} catch (Exception e) {
			throw new BusinessException(AuthErrorCodes.MEMBER_JSON_SERIALIZE_FAIL);
		}
	}

	public void removeToken(String refreshToken) {
		redisTemplate.delete(REDIS_PREFIX + refreshToken);
		System.out.println(redisTemplate.opsForValue().get(REDIS_PREFIX + refreshToken));
	}
}
