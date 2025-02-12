package com.chunsun.couponkafkaservice.application.dto;

public record IssueCouponRecord(
	Long couponId,
	Long memberId,
	Integer validDays
) {
}