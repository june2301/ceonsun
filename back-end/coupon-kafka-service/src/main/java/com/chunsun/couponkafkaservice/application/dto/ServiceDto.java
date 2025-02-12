package com.chunsun.couponkafkaservice.application.dto;

import java.time.LocalDateTime;
import java.util.List;

public record ServiceDto() {

	public record CreateCouponServiceRequest(
		String name,
		Integer discountRate,
		Integer validDays,
		Integer totalQuantity
	) {
	}

	public record CreateCouponServiceResponse(
		Long couponId,
		String name,
		Integer discountRate,
		Integer validDays,
		Integer totalQuantity,
		Integer remainingQuantity,
		LocalDateTime expiryDate
	) {
	}

	public record SearchCouponsServiceResponse(
		List<SearchCouponServiceResponse> coupons
	) {
	}

	public record SearchCouponServiceResponse(
		Long couponId,
		String name,
		Integer discountRate,
		String status,
		LocalDateTime expiryDate
	) {
	}
}
