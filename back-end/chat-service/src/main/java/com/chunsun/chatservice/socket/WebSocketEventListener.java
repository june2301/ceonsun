package com.chunsun.chatservice.socket;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventListener {

	@EventListener
	public void handleWebSocketConnectListener(SessionConnectEvent event) {
		StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
		String sessionId = headerAccessor.getSessionId();
		String userId = (String) headerAccessor.getSessionAttributes().get("userId");

		// 현재 token에 username이 들어가 있음
		log.info("userName: {}, sessionId: {}", userId, sessionId);

		//TODO: JWT 검증 후 userId 추출
		// String userId = null;
		// if (token != null && token.startsWith("Bearer ")) {
		// 	userId = JwtUtil.getUserIdFromToken(token.substring(7));
		// }

		// 이미 존재해도 무시 해야 하지 않을까?
		//TODO: Redis에 sessionId → userId 저장
		// if (userId != null) {
		// 	redisTemplate.opsForValue().set("websocket:session:" + sessionId, userId);
		// 	log.info("User {} connected with session {}", userId, sessionId);
		// } else {
		// 	log.warn("WebSocket 연결 시 유효한 JWT가 없음!");
		// }
	}

	@EventListener
	public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
		StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
		String sessionId = headerAccessor.getSessionId();

		// TODO: ✅ Redis에서 sessionId로 userId 조회
		// String userId = redisTemplate.opsForValue().get("websocket:session:" + sessionId);
		// if (userId != null) {
		// 	redisTemplate.delete("websocket:session:" + sessionId);
		// 	log.info("User {} disconnected with session {}", userId, sessionId);
		// } else {
		// 	log.warn("WebSocket 종료 시 userId 정보를 찾을 수 없음 (세션 ID: {})", sessionId);
		// }
	}
}
