package com.chunsun.chatservice.web.dto;

import lombok.Builder;

public record NewChatRoomDto() {
	public record RequestDto(
		Long studentId,
		Long teacherId
	) {
	}

	@Builder
	public record ResponseDto() {
	}
}
