package com.chunsun.authservice.config.security.handler;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import com.chunsun.authservice.common.error.AuthErrorCodes;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

	private final ObjectMapper objectMapper = new ObjectMapper();

	@Override
	public void handle(HttpServletRequest request, HttpServletResponse response,
		AccessDeniedException accessDeniedException)
		throws IOException, ServletException {

		AuthErrorCodes errorCode = AuthErrorCodes.FORBIDDEN_ACCESS;

		response.setStatus(errorCode.getHttpStatus().value());
		response.setContentType("application/json; charset=UTF-8");

		Map<String, String> errorResponse = new HashMap<>();
		errorResponse.put("code", errorCode.getCode());
		errorResponse.put("message", errorCode.getMessage());
		errorResponse.put("serverDateTime", String.valueOf(LocalDateTime.now()));

		response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
		response.getWriter().flush();
	}
}
