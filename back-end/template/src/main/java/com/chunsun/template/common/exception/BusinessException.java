package com.chunsun.template.common.exception;

import com.chunsun.template.common.error.ErrorCode;
import lombok.Getter;

@Getter
public class BusinessException extends RuntimeException {
    private final ErrorCode errorCode;

    public BusinessException(ErrorCode errorCode){
        this.errorCode = errorCode;
    }
}
