package com.chunsun.couponkafkaservice.domain;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberCouponRepository extends JpaRepository<MemberCoupon, Long> {
	List<MemberCoupon> findByMemberIdAndStatus(Long memberId, CouponStatus status);
}
