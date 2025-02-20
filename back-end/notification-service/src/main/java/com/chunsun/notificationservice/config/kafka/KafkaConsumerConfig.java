package com.chunsun.notificationservice.config.kafka;

import java.util.HashMap;
import java.util.Map;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import org.springframework.util.backoff.FixedBackOff;

import com.chunsun.notificationservice.application.dto.NotificationDto;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@EnableKafka
public class KafkaConsumerConfig {

	@Bean
	public DefaultErrorHandler kafkaErrorHandler() {
		DefaultErrorHandler errorHandler = new DefaultErrorHandler(
			(record, exception) -> {
				log.error("Kafka 역직렬화 오류 발생! 건너뜀 - 메시지: {}", record, exception);
			},
			new FixedBackOff(1000L, 2)
		);

		return errorHandler;
	}
}

