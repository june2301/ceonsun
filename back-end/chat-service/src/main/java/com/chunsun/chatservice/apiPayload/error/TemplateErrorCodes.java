package com.chunsun.chatservice.apiPayload.error;

import lombok.AllArgsConstructor;
import lombok.Getter;

import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum TemplateErrorCodes implements ErrorCode {
	NOT_FOUND_FILE_TYPE(HttpStatus.NOT_FOUND, "TEMPLATE4001", "파일 타입을 찾을 수 없습니다."),
	;
	private final HttpStatus httpStatus;
	private final String code;
	private final String message;
}
