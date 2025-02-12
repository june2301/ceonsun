package com.chunsun.chatservice.kafka;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.chunsun.chatservice.web.dto.MessageDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class ChatMessageProducer {
	private final KafkaTemplate<String, MessageDto> kafkaTemplate;

	public void send(MessageDto data) {
		log.info("Producing message: {}", data);
		kafkaTemplate.send("chat",data.roomId(), data);
	}

}
