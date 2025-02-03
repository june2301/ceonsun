package com.chunsun.couponservice.controller;

import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RefreshScope
@RequestMapping("/")
@RestController
public class TestController {

	private final Environment environment;

	@GetMapping
	public String test() {
		System.out.println("==" + environment.getProperty("token.expiration_time"));
		return environment.getProperty("token.expiration_time");
		// return "coupon-service Test";
	}
}
