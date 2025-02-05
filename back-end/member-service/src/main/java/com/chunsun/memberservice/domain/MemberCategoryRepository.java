package com.chunsun.memberservice.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import jakarta.transaction.Transactional;

public interface MemberCategoryRepository extends JpaRepository<MemberCategory, Long> {

	@Transactional
	void deleteByMemberId(Long memberId);
}
