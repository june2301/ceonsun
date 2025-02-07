package com.chunsun.chatservice.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chunsun.chatservice.kafka.ChatMessageProducer;
import com.chunsun.chatservice.web.dto.MessageDto;
import com.chunsun.chatservice.domain.ChatMessage;
import com.chunsun.chatservice.repository.ChatMessageRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class MessageServiceImpl implements MessageService {

	private final SimpMessagingTemplate messagingTemplate;
	private final ChatMessageRepository chatMessageRepository;
	private final ChatMessageProducer chatMessageProducer;

	@Transactional
	@Override
	public void sendMessage(MessageDto messageDto) {
		//TODO: (ver.1) MongoDB에 채팅 메시지 저장, (ver.2) Kafka에 채팅 메시지 전송 -> 채팅 메시지 저장 서비스 추가

		// kafka에 채팅 메시지 전송
		chatMessageProducer.send(messageDto);

		// MessageDto를 ChatMessage로 변환
		ChatMessage chatMessage = ChatMessage.builder()
			.roomId(messageDto.roomId())
			.senderId(messageDto.senderId())
			.message(messageDto.message())
			.sentAt(LocalDateTime.parse(messageDto.sentAt(), DateTimeFormatter.ISO_DATE_TIME))
			.isRead(false)
			.build();

		// MongoDB에 채팅 메시지 저장
		chatMessageRepository.save(chatMessage);

		// "/queue/chat/{roomId}" 형태로 메시지 전송
		String destination = "/queue/chat/" + messageDto.roomId();
		messagingTemplate.convertAndSend(destination, messageDto);
	}
}
