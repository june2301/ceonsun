package com.chunsun.couponkafkaservice.application.dto;

public record BulkInsertCouponDto(
	Long couponId,
	Long memberId,
	Integer validDays
) {
}
