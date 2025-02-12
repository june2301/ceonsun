package com.chunsun.chatconsumer.web.dto;

import lombok.Builder;

@Builder
public record MessageDto(
	String roomId,
	String senderId,
	String message,
	String sentAt
) {
}
