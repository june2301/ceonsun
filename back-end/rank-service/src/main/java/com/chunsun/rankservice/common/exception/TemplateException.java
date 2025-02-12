package com.chunsun.rankservice.common.exception;

import com.chunsun.rankservice.common.error.ErrorCode;

public class TemplateException extends BusinessException {
    public TemplateException(ErrorCode errorCode) {
        super(errorCode);
    }
}
