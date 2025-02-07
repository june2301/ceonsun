package com.chunsun.authservice.domain.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.chunsun.authservice.domain.entity.Member;

public interface MemberRepository extends JpaRepository<Member, Long> {
	Optional<Member> findByKakaoId(String kakaoId);
}
