package com.chunsun.chatconsumer.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.listener.ContainerProperties;

import com.chunsun.chatconsumer.web.dto.MessageDto;

@Configuration
public class ChatConsumerConfig {

	@Bean
	public ConcurrentKafkaListenerContainerFactory<String, MessageDto> kafkaListenerContainerFactory(
		ConsumerFactory<String, MessageDto> consumerFactory) {

		ConcurrentKafkaListenerContainerFactory<String, MessageDto> factory =
			new ConcurrentKafkaListenerContainerFactory<>();

		factory.setConsumerFactory(consumerFactory);
		factory.setBatchListener(true); // Batch 모드 활성화
		factory.getContainerProperties().setAckMode(ContainerProperties.AckMode.MANUAL); // 수동 커밋
		factory.getContainerProperties().setPollTimeout(5000); // 3초마다 폴링
		// factory.setConcurrency(1);  // ✅ 단일 컨슈머로 테스트
		return factory;
	}
}
