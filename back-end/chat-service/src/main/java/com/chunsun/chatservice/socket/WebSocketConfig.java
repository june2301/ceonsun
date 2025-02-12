package com.chunsun.chatservice.socket;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

	private final WebSocketHandshakeInterceptor webSocketHandshakeInterceptor;
	private final UserHandshakeHandler userHandshakeHandler;

	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		registry.addEndpoint("/ws") // 클라이언트가 연결할 WebSocket 엔드포인트
			.addInterceptors(webSocketHandshakeInterceptor)
			.setHandshakeHandler(userHandshakeHandler)
			.setAllowedOriginPatterns("*") // CORS 허용
			.withSockJS(); // SockJS 지원 (브라우저 호환성)
	}

	@Override
	public void configureMessageBroker(MessageBrokerRegistry registry) {
		registry.enableSimpleBroker("/queue"); // 1:1 채팅에서는 "/queue" 사용
		registry.setApplicationDestinationPrefixes("/app"); // 메시지 송신 경로
	}
}
