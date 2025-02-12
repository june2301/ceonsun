package com.chunsun.couponservice.application.service;

import static com.chunsun.couponservice.application.dto.ServiceDto.*;

public interface CouponService {
	CreateCouponServiceResponse createCoupon(final CreateCouponServiceRequest request);

	void issueCoupon(final IssueCouponServiceRequest request);
}
