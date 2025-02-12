package com.chunsun.couponkafkaservice.application.service;

import static com.chunsun.couponkafkaservice.application.dto.ServiceDto.*;

public interface CouponService {

	CreateCouponServiceResponse createCoupon(CreateCouponServiceRequest request);

	void deleteCoupon(Long couponId);

	SearchCouponsServiceResponse searchCoupons(Long memberId);
}
