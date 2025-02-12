package com.chunsun.chatservice.service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chunsun.chatservice.kafka.ChatMessageProducer;
import com.chunsun.chatservice.web.dto.MessageDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class MessageServiceImpl implements MessageService {

	private final SimpMessagingTemplate messagingTemplate;
	private final ChatMessageProducer chatMessageProducer;

	@Transactional
	@Override
	public void sendMessage(MessageDto messageDto) {

		// kafka에 채팅 메시지 전송
		chatMessageProducer.send(messageDto);
		log.info("Sent message to Kafka: {}", messageDto);

		// "/queue/chat/{roomId}" 형태로 메시지 전송
		String destination = "/queue/chat/" + messageDto.roomId();
		messagingTemplate.convertAndSend(destination, messageDto);
	}
}
