package com.chunsun.authservice.common.error;

import org.springframework.http.HttpStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum AuthErrorCodes implements ErrorCode {
	INVALID_KAKAO_AUTHORIZATION_CODE(HttpStatus.BAD_REQUEST, "AUTH4001", "카카오 인증에 실패하였습니다."),
	INVALID_AUTHORIZATION_TOKEN(HttpStatus.UNAUTHORIZED, "AUTH4002", "유효하지 않은 토큰 정보입니다."),
	INVALID_AUTHORIZATION_REFRESH_TOKEN(HttpStatus.UNAUTHORIZED, "AUTH4003", "유효하지 않은 토큰 정보입니다."),
	NOT_EXIST_AUTHORIZATION_REFRESH_TOKEN(HttpStatus.UNAUTHORIZED, "AUTH4004", "리프레시 토큰이 존재하지 않습니다."),
	KAKAO_INFO_DATA_SEARCH_FAIL(HttpStatus.BAD_REQUEST, "AUTH4005", "카카오 유저 정보를 가져오는데 실패했습니다"),
	FORBIDDEN_ACCESS(HttpStatus.FORBIDDEN, "AUTH4006", "접근 권한이 없습니다"),
	MEMBER_JSON_SERIALIZE_FAIL(HttpStatus.UNPROCESSABLE_ENTITY, "AUTH4007", "직렬화 혹은 역직렬화에 실패하였습니다"),
	NOT_EXIST_MEMBER(HttpStatus.NOT_FOUND, "AUTH4008", "해당 유저 정보가 없습니다"),
	ALREADY_DELETED_MEMBER(HttpStatus.BAD_REQUEST, "AUTH4009", "이미 삭제된 유저입니다."),
	;

	private final HttpStatus httpStatus;
	private final String code;
	private final String message;
}
