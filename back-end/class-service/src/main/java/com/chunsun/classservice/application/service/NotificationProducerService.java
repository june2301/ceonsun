package com.chunsun.classservice.application.service;

import static com.chunsun.classservice.application.dto.NotificationDto.*;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationProducerService {
	private final KafkaTemplate<String, RequestDto> kafkaTemplate;

	public void sendNotification(RequestDto requestDto) {
		log.info(requestDto.getSendUserId());
		log.info(requestDto.getTargetUserId());

		kafkaTemplate.send("alarm", requestDto);
	}
}