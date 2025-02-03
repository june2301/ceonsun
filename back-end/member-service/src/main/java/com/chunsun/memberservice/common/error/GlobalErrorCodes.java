package com.chunsun.memberservice.common.error;

import org.springframework.http.HttpStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum GlobalErrorCodes implements ErrorCode  {


    INTERNAL_SERVER_ERROR(HttpStatus.BAD_REQUEST, "COMMON4001" , "내부 서버 오류"),

    NOT_FOUND_URL(HttpStatus.NOT_FOUND, "COMMON4002", "존재하지 않는 url"),

    INVALID_JSON_DATA(HttpStatus.BAD_REQUEST, "COMMON4003", "잘못된 형식의 JSON data"),

    INVALID_HEADER_DATA(HttpStatus.BAD_REQUEST, "COMMON4004", "잘못된 형식의 Header data"),

    INVALID_USER_ID(HttpStatus.BAD_REQUEST, "COMMON4005", "잘못된 userId 형식"),

    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "COMMON4011", "로그인이 필요합니다."),

    ;

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;
}
