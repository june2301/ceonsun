package com.chunsun.couponservice.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/coupon-service")
public class TestController {
	@GetMapping
	public String test() {
		return "coupon-service";
	}
}
