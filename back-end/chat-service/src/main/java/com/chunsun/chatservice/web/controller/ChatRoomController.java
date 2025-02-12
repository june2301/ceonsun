package com.chunsun.chatservice.web.controller;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.chunsun.chatservice.kafka.ChatMessageProducer;
import com.chunsun.chatservice.web.dto.MessageDto;
import com.chunsun.chatservice.web.dto.NewChatRoomDto;
import com.chunsun.chatservice.service.ChatRoomService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
public class ChatRoomController {

	private final ChatRoomService chatRoomService;

	private final ChatMessageProducer chatMessageProducer;

	@GetMapping("/chat")
	public String chat() {
		String now = LocalDateTime.now(ZoneOffset.UTC) // 현재 UTC 시간
			.format(DateTimeFormatter.ISO_INSTANT);
		chatMessageProducer.send(MessageDto.builder()
			.roomId("1")
			.senderId("1")
			.message("Hello, world!")
			.sentAt(now)
			.build());
		return "chat";
	}

	@GetMapping("/")
	public String testController() {
		return "chat-service";
	}

	/**
	 * 괴외 문의하기 클릭시
	 * 1. 채팅방 존재 유무 확인
	 * 2-1 채팅방이 존재하면 초기 문의 메시지 전송
	 * 2-2 채팅방이 존재하지 않으면 채팅방 생성 + 초기 문의 메시지 전송
	 */
	@PostMapping("/chat-rooms")
	public ResponseEntity<String> newChatRoom(@RequestBody NewChatRoomDto.RequestDto requestDto) {
		chatRoomService.requestClass(requestDto);
		return ResponseEntity.ok().body("문의 메시지 전송 완료");
	}

	/**
	 * 내 채팅방 목록 조회
	 */
}
