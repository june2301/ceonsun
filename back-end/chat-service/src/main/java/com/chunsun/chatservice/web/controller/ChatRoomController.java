package com.chunsun.chatservice.web.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.chunsun.chatservice.web.dto.NewChatRoomDto;
import com.chunsun.chatservice.service.ChatRoomService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
public class ChatRoomController {

	private final ChatRoomService chatRoomService;

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
