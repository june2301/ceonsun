package com.chunsun.authservice.common.exception;

import com.chunsun.authservice.common.error.ErrorCode;

public class AuthException extends BusinessException {
	public AuthException(ErrorCode errorCode) {
		super(errorCode);
	}
}
