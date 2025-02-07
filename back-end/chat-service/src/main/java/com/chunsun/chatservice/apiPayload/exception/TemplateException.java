package com.chunsun.chatservice.apiPayload.exception;

import com.chunsun.chatservice.apiPayload.error.ErrorCode;

public class TemplateException extends BusinessException {
	public TemplateException(ErrorCode errorCode) {
		super(errorCode);
	}
}
