package com.chunsun.couponservice.application.convert;

import static com.chunsun.couponservice.application.dto.ServiceDto.*;
import static com.chunsun.couponservice.application.dto.FeignDto.*;
import static com.chunsun.couponservice.presentation.dto.ControllerDto.*;

import java.time.LocalDateTime;

import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.Range;

import com.chunsun.couponservice.application.dto.IssueCouponRecord;

import jakarta.validation.constraints.NotNull;

public class DtoConverter {

	public static SearchCouponControllerResponse toSearchCouponControllerResponse(CouponInfoValue infoValue,
		int remainingQuantity) {
		return new SearchCouponControllerResponse(infoValue.couponId(), infoValue.name(), infoValue.discountRate(),
			infoValue.validDays(), remainingQuantity, LocalDateTime.parse(infoValue.expiryDate()));
	}

	public static CouponInfoValue toCouponInfoValue(CouponCreateRedis coupon) {
		return new CouponInfoValue(coupon.couponId(), coupon.name(), coupon.discountRate(), coupon.validDays(),
			coupon.totalQuantity(), coupon.expiryDate().toString());
	}

	public static CouponCreateRedis toCouponCreateRedis(CreateCouponServiceResponse response) {
		return new CouponCreateRedis(
			response.couponId(),
			response.name(),
			response.discountRate(),
			response.validDays(),
			response.totalQuantity(),
			response.remainingQuantity(),
			response.expiryDate()
		);
	}

	public static CouponIssueRedis toCouponIssueRedis(IssueCouponServiceRequest request) {
		return new CouponIssueRedis(request.couponId(), request.memberId());
	}

	public static IssueCouponRecord toIssueCouponRecord(IssueCouponServiceRequest request) {
		return new IssueCouponRecord(request.couponId(), request.memberId(), request.validDays());
	}

	public static CreateCouponFeignRequest toCreateCouponFeignRequest(CreateCouponServiceRequest request) {
		return new CreateCouponFeignRequest(request.name(), request.discountRate(), request.validDays(),
			request.totalQuantity());
	}

	public static CreateCouponControllerResponse toCreateCouponControllerResponse(
		CreateCouponServiceResponse response) {
		return new CreateCouponControllerResponse(response.couponId(), response.name(), response.discountRate(),
			response.validDays(), response.totalQuantity(), response.remainingQuantity(), response.expiryDate());
	}

	public static CreateCouponServiceRequest toCreateCouponServiceRequest(CreateCouponControllerRequest request) {
		return new CreateCouponServiceRequest(request.name(), request.discountRate(), request.validDays(),
			request.totalQuantity());
	}

	public static IssueCouponServiceRequest toIssueCouponServiceRequest(Long memberId,
		issueCouponControllerRequest request) {
		return new IssueCouponServiceRequest(request.couponId(), memberId, request.validDays());
	}

	public static CreateCouponServiceResponse toCreateCouponServiceResponse(CreateCouponFeignResponse response) {
		return new CreateCouponServiceResponse(response.couponId(), response.name(), response.discountRate(),
			response.validDays(), response.totalQuantity(), response.remainingQuantity(), response.expiryDate());
	}
}
