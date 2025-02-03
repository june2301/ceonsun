package com.chunsun.memberservice.common.exception.handler;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.chunsun.memberservice.common.error.ErrorCode;
import com.chunsun.memberservice.common.error.ErrorResponseDto;
import com.chunsun.memberservice.common.error.GlobalErrorCodes;
import com.chunsun.memberservice.common.exception.BadRequestException;
import com.chunsun.memberservice.common.exception.BusinessException;
import com.chunsun.memberservice.common.exception.ForbiddenException;
import com.chunsun.memberservice.common.exception.UnauthorizedException;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(BusinessException.class)
    protected ResponseEntity<ErrorResponseDto> handleBusinessException(BusinessException e) {
        log.error("BusinessException", e);
        ErrorCode errorMessage = e.getErrorCode();
        return ErrorResponseDto.of(errorMessage);
    }

    @ExceptionHandler(Exception.class)
    protected ResponseEntity<ErrorResponseDto> handleException(Exception e) {
        log.error("Exception", e);
        return ErrorResponseDto.of(GlobalErrorCodes.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponseDto> handleUnauthorizedException(UnauthorizedException e) {
        return ErrorResponseDto.of(GlobalErrorCodes.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ErrorResponseDto> handleBadRequestException(BadRequestException e) {
        return ErrorResponseDto.of(GlobalErrorCodes.INVALID_JSON_DATA);
    }

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<ErrorResponseDto> handleForbiddenException(ForbiddenException e) {
        return ErrorResponseDto.of(GlobalErrorCodes.INVALID_JSON_DATA);
    }

}
