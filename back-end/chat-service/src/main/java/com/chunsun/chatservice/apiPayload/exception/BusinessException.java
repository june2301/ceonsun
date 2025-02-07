package com.chunsun.chatservice.apiPayload.exception;


import com.chunsun.chatservice.apiPayload.error.ErrorCode;

import lombok.Getter;

@Getter
public class BusinessException extends RuntimeException {
	private final ErrorCode errorCode;

	public BusinessException(ErrorCode errorCode) {
		this.errorCode = errorCode;
	}
}
