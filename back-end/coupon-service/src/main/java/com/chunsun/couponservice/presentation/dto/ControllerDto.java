package com.chunsun.couponservice.presentation.dto;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.Range;

import jakarta.validation.constraints.NotNull;

public record ControllerDto() {
	public record CreateCouponControllerRequest(
		@Length(min = 1, max = 100)
		@NotNull(message = "쿠폰 이름을 입력해주세요.")
		String name,

		@Range(min = 0, max = 20)
		@NotNull(message = "할인율을 입력해주세요.")
		Integer discountRate,

		@Range(min = 7, max = 31)
		@NotNull(message = "쿠폰 유효기간(일)을 입력해주세요.")
		Integer validDays,

		@Range(min = 1, max = 50000)
		@NotNull(message = "쿠폰 수량을 입력해주세요.")
		Integer totalQuantity
	) {
	}

	public record CreateCouponControllerResponse(
		Long couponId,
		String name,
		Integer discountRate,
		Integer validDays,
		Integer totalQuantity,
		Integer remainingQuantity,
		LocalDateTime expiryDate
	) {
	}

	public record issueCouponControllerRequest(
		@NotNull(message = "쿠폰 Id를 입력해주세요.")
		Long couponId,

		@NotNull(message = "쿠폰 유효기간(일)을 입력해주세요.")
		Integer validDays
	) {
	}

	public record SearchCouponsControllerResponse(
		List<SearchCouponControllerResponse> coupons
	) {
	}

	public record SearchCouponControllerResponse(
		Long couponId,
		String name,
		Integer discountRate,
		Integer validDays,
		Integer remainingQuantity,
		LocalDateTime expiryDate
	) {
	}
}
