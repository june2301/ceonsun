package com.chunsun.memberservice.common.exception;

import com.chunsun.memberservice.common.error.ErrorCode;

import lombok.Getter;

@Getter
public class BadRequestException extends RuntimeException {
    private final ErrorCode errorCode;

    public BadRequestException(ErrorCode errorCode){this.errorCode = errorCode;}
}