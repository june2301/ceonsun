package com.chunsun.authservice.config.database;

import java.time.Duration;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.data.redis.RedisProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Configuration
@EnableCaching
@EnableConfigurationProperties(RedisProperties.class)
public class RedisConfig {
	private final RedisProperties redisProperties;

	@Bean
	public RedisConnectionFactory redisConnectionFactory() {
		return new LettuceConnectionFactory(redisProperties.getHost(), redisProperties.getPort());
	}

	@Bean
	public RedisTemplate<String, Object> redisTemplate() {
		RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
		redisTemplate.setConnectionFactory(redisConnectionFactory());
		redisTemplate.setKeySerializer(new StringRedisSerializer());
		redisTemplate.setValueSerializer(new StringRedisSerializer());
		return redisTemplate;
	}

	@Bean
	@ConditionalOnMissingBean(name = "defaultCacheManager")
	public CacheManager defaultCacheManager() {
		var stringSerializationPair = RedisSerializationContext
			.SerializationPair.fromSerializer(new StringRedisSerializer());
		var objectSerializationPair = RedisSerializationContext
			.SerializationPair.fromSerializer(new GenericJackson2JsonRedisSerializer());

		var redisCacheConfiguration = RedisCacheConfiguration.defaultCacheConfig()
			.serializeKeysWith(stringSerializationPair)
			.serializeValuesWith(objectSerializationPair)
			.entryTtl(CachingDuration.DAY.duration);

		return RedisCacheManager.RedisCacheManagerBuilder
			.fromConnectionFactory(redisConnectionFactory())
			.cacheDefaults(redisCacheConfiguration).build();
	}

	@Getter
	@RequiredArgsConstructor
	enum CachingDuration {
		DAY(Duration.ofDays(1L)),
		HOUR(Duration.ofHours(1L)),
		MINUTE(Duration.ofMinutes(5L)),
		;

		private final Duration duration;
	}
}