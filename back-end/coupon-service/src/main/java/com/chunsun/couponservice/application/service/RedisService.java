package com.chunsun.couponservice.application.service;

import static com.chunsun.couponservice.application.dto.ServiceDto.*;
import static com.chunsun.couponservice.presentation.dto.ControllerDto.*;

public interface RedisService {
	void saveCouponInfo(final CouponCreateRedis couponCreateRedis);

	void issueCoupon(final CouponIssueRedis couponIssueRedis);

	SearchCouponsControllerResponse searchCoupons();
}
