package com.chunsun.chatconsumer.apiPayload.exception;

import com.chunsun.chatconsumer.apiPayload.error.ErrorCode;

public class TemplateException extends BusinessException {
	public TemplateException(ErrorCode errorCode) {
		super(errorCode);
	}
}
