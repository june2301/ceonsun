package com.chunsun.chatservice.socket;

import java.security.Principal;
import java.util.Map;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class UserHandshakeHandler extends DefaultHandshakeHandler {
	// WebSocketHandshakeInterceptor에서 저장한 userId를 Principal로 변환
	@Override
	protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler,
		Map<String, Object> attributes) {
		log.info("=== determineUser ===");
		log.info("userId: {}", attributes.get("userId"));
		String userId = (String)attributes.get("userId");
		return userId != null ? new StompPrincipal(userId) : null;
	}
}