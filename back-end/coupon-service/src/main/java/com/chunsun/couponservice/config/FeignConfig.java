package com.chunsun.couponservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import feign.Logger;

@Configuration
public class FeignConfig {

	@Bean
	public Logger.Level feginLoggerLevel() {
		return Logger.Level.FULL;
	}
}
