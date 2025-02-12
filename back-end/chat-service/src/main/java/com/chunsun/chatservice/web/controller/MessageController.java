package com.chunsun.chatservice.web.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import com.chunsun.chatservice.kafka.ChatMessageProducer;
import com.chunsun.chatservice.web.dto.MessageDto;
import com.chunsun.chatservice.service.MessageService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequiredArgsConstructor
public class MessageController {
	private final MessageService messageService;

	@MessageMapping("/chat.sendMessage") // "/app/chat.sendMessage"로 메시지 받음
	public void sendMessage(@Payload MessageDto messageDto) {
		log.info("Received message: {}", messageDto);
		messageService.sendMessage(messageDto);
	}
}
