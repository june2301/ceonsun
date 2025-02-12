package com.chunsun.chatconsumer.kafka;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Service;

import com.chunsun.chatconsumer.domain.ChatMessage;
import com.chunsun.chatconsumer.repository.ChatMessageRepository;
import com.chunsun.chatconsumer.web.dto.MessageDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class ChatMessageConsumer {

	private final ChatMessageRepository chatMessageRepository;

	// @KafkaListener(topics = "chat", groupId = "chat-consumer")
	// public void consume(ConsumerRecord<String, MessageDto> record) {
	// 	MessageDto message = record.value();
	// 	log.info("Consumed message: {}", message);
	//
	// 	// MessageDto를 ChatMessage로 변환
	// 	ChatMessage chatMessage = ChatMessage.builder()
	// 		.roomId(message.roomId())
	// 		.senderId(message.senderId())
	// 		.message(message.message())
	// 		.sentAt(LocalDateTime.parse(message.sentAt(), DateTimeFormatter.ISO_DATE_TIME))
	// 		.isRead(false)
	// 		.build();
	//
	// 	// MongoDB에 채팅 메시지 저장
	// 	chatMessageRepository.save(chatMessage);
	// 	log.info("Saved chat message in mongoDB: {}", chatMessage.toString());
	// }

	// @KafkaListener(
	// 	topics = "chat",
	// 	groupId = "chat-consumer",
	// 	containerFactory = "kafkaListenerContainerFactory"
	// )
	// public void consume(List<ConsumerRecord<String, MessageDto>> records, Acknowledgment acknowledgment) {
	// 	log.info("Consumed {} messages", records.size());
	//
	// 	List<ChatMessage> messages = new ArrayList<>();
	// 	try {
	// 		for (ConsumerRecord<String, MessageDto> record : records) {
	// 			MessageDto message = record.value();
	// 			ChatMessage chatMessage = ChatMessage.builder()
	// 				.roomId(message.roomId())
	// 				.senderId(message.senderId())
	// 				.message(message.message())
	// 				.sentAt(LocalDateTime.parse(message.sentAt(), DateTimeFormatter.ISO_DATE_TIME))
	// 				.isRead(false)
	// 				.build();
	// 			messages.add(chatMessage);
	// 		}
	//
	// 		// MongoDB에 한 번에 저장
	// 		chatMessageRepository.saveAll(messages);
	//
	// 		log.info("Saved {} chat messages in MongoDB", messages.size());
	// 		acknowledgment.acknowledge();
	// 	} catch (Exception e) {
	// 		log.error("Error processing batch messages: {}", e.getMessage(), e);
	// 	}
	// }
	@KafkaListener(
		topics = "chat",
		groupId = "chat-consumer",
		containerFactory = "kafkaListenerContainerFactory"
	)
	public void consume(List<MessageDto> messages, Acknowledgment acknowledgment) {
		log.info("Consumed {} messages", messages.size());

		List<ChatMessage> chatMessages = messages.stream()
			.map(message -> ChatMessage.builder()
				.roomId(message.roomId())
				.senderId(message.senderId())
				.message(message.message())
				.sentAt(LocalDateTime.parse(message.sentAt(), DateTimeFormatter.ISO_DATE_TIME))
				.isRead(false)
				.build())
			.collect(Collectors.toList());

		try {
			chatMessageRepository.saveAll(chatMessages);
			log.info("Saved {} chat messages in MongoDB", chatMessages.size());
			acknowledgment.acknowledge();
		} catch (Exception e) {
			log.error("Error processing batch messages: {}", e.getMessage(), e);
		}
	}

}
