package com.chunsun.memberservice.common.exception;

import com.chunsun.memberservice.common.error.ErrorCode;

import lombok.Getter;

@Getter
public class ForbiddenException extends RuntimeException {
    private final ErrorCode errorCode;

    public ForbiddenException(ErrorCode errorCode) {this.errorCode = errorCode;}

}
