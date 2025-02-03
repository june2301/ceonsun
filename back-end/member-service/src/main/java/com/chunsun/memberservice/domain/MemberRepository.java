package com.chunsun.memberservice.domain;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {

	boolean existsByKakaoId(String kakaoId);

	boolean existsByEmail(String email);

	boolean existsByNickname(String nickname);

	Member findByKakaoId(String kakaoId);
}
