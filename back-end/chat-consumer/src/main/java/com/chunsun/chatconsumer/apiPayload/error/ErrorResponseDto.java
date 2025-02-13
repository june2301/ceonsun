package com.chunsun.chatconsumer.apiPayload.error;

import java.time.LocalDateTime;

import org.springframework.http.ResponseEntity;

import lombok.Data;

@Data
public class ErrorResponseDto {
	private final LocalDateTime serverDateTime;
	private String code;
	private String message;

	public ErrorResponseDto(ErrorCode errorCode) {
		this.code = errorCode.getCode();
		this.message = errorCode.getMessage();
		this.serverDateTime = LocalDateTime.now();
	}

	public static ResponseEntity<ErrorResponseDto> of(ErrorCode errorCode) {

		return ResponseEntity
			.status(errorCode.getHttpStatus())
			.body(new ErrorResponseDto(errorCode));
	}
}
