package com.chunsun.couponservice.application.dto;

public record IssueCouponRecord(
	Long couponId,
	Long memberId,
	Integer validDays
) {
}
