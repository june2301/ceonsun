package com.chunsun.couponservice.application.dto;

import java.time.LocalDateTime;

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

	public record IssueCouponServiceRequest(
		Long couponId,
		Long memberId,
		Integer validDays
	) {
	}

	public record CouponCreateRedis(
		Long couponId,
		String name,
		Integer discountRate,
		Integer validDays,
		Integer totalQuantity,
		Integer remainingQuantity,
		LocalDateTime expiryDate
	) {
	}

	public record CouponIssueRedis(
		Long couponId,
		Long memberId
	) {
	}

	public record CouponInfoValue(
		Long couponId,
		String name,
		Integer discountRate,
		Integer validDays,
		Integer totalQuantity,
		String expiryDate
	) {
	}
}
