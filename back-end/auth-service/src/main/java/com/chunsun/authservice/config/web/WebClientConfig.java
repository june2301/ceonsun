package com.chunsun.authservice.config.web;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;

import com.chunsun.authservice.util.WebClientUtil;

@Configuration
public class WebClientConfig {

	@Bean
	public WebClient webClient() {
		return WebClient.builder()
			.defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_FORM_URLENCODED_VALUE)
			.build();
	}

	@Bean
	public WebClientUtil kakaoWebClientUtil() {
		return new WebClientUtil("https://kauth.kakao.com");
	}
}
