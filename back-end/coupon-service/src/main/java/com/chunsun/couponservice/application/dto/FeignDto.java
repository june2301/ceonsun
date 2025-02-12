package com.chunsun.couponservice.application.dto;

import java.time.LocalDateTime;

public record FeignDto() {

	public record CreateCouponFeignRequest(
		String name,
		Integer discountRate,
		Integer validDays,
		Integer totalQuantity
	) {
	}

	public record CreateCouponFeignResponse(
		Long couponId,
		String name,
		Integer discountRate,
		Integer validDays,
		Integer totalQuantity,
		Integer remainingQuantity,
		LocalDateTime expiryDate
	) {
	}
}
