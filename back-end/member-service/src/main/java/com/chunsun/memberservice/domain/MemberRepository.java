package com.chunsun.memberservice.domain;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface MemberRepository extends JpaRepository<Member, Long>, JpaSpecificationExecutor<Member> {

	boolean existsByKakaoId(String kakaoId);

	boolean existsByEmail(String email);

	boolean existsByNickname(String nickname);

	Member findByKakaoId(String kakaoId);

	Page<Member> findAll(Specification<Member> spec, Pageable pageable);
}
