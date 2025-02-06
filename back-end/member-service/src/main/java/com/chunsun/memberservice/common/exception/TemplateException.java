package com.chunsun.memberservice.common.exception;

import com.chunsun.memberservice.common.error.ErrorCode;

public class TemplateException extends BusinessException {
    public TemplateException(ErrorCode errorCode) {
        super(errorCode);
    }
}
