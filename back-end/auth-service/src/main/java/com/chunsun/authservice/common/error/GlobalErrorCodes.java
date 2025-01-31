package com.chunsun.authservice.common.error;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum GlobalErrorCodes implements ErrorCode  {
    INTERNAL_SERVER_ERROR(HttpStatus.BAD_REQUEST, "COMMON4001" , "내부 서버 오류"),

    NOT_FOUND_URL(HttpStatus.NOT_FOUND, "COMMON4002", "존재하지 않는 url"),

    INVALID_JSON_DATA(HttpStatus.BAD_REQUEST, "COMMON4003", "잘못된 형식의 JSON data"),

    INVALID_HEADER_DATA(HttpStatus.BAD_REQUEST, "COMMON4004", "잘못된 형식의 Header data"),
    ;

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;
}
