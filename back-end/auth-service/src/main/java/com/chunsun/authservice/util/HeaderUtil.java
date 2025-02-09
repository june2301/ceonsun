package com.chunsun.authservice.util;

import com.chunsun.authservice.common.error.GlobalErrorCodes;
import com.chunsun.authservice.common.exception.BusinessException;

public class HeaderUtil {
	private static final String BEARER_PREFIX = "Bearer ";

	public static String extractToken(String authorizationHeader) {
		if (authorizationHeader == null || authorizationHeader.isBlank()) {
			throw new BusinessException(GlobalErrorCodes.INVALID_HEADER_DATA);
		}

		if (authorizationHeader.startsWith(BEARER_PREFIX)) {
			return authorizationHeader.substring(BEARER_PREFIX.length());
		}

		return authorizationHeader;
	}
}
