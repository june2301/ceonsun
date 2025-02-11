package com.chunsun.authservice.config.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class KakaoConfig {

	@Value("${spring.security.oauth2.client.registration.kakao.client-id}")
	private String clientId;

	public String getClientId() {
		return clientId;
	}
}
