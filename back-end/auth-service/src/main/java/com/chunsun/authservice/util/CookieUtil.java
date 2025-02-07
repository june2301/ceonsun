package com.chunsun.authservice.util;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

public class CookieUtil {
	private final static int DEFAULT_AGE = 2592000;

	public static void addCookie(HttpServletResponse response, String name, String value, int maxAge) {
		Cookie cookie = new Cookie(name, value);
		cookie.setPath("/");
		cookie.setHttpOnly(true);
		cookie.setHttpOnly(false);
		// cookie.setSecure(false); // 이후 운영에서는 변경 https
		cookie.setMaxAge(maxAge);
		response.addCookie(cookie);
	}

	public static void addCookie(HttpServletResponse response, String name, String value) {
		addCookie(response, name, value, DEFAULT_AGE);
	}

	public static void deleteRefreshToken(HttpServletResponse response) {
		Cookie cookie = new Cookie("refreshToken", null);
		cookie.setMaxAge(0);
		cookie.setPath("/");
		cookie.setHttpOnly(true);
		// cookie.setSecure(false); // 이후 운영에서는 변경 https

		response.addCookie(cookie);
	}
}
