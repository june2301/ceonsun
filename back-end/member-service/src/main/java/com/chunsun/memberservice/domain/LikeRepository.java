package com.chunsun.memberservice.domain;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LikeRepository extends JpaRepository<Like, Long> {
	Boolean existsByLikerIdAndLikeeId(Long likerId, Long likeeId);

	void deleteByLikerIdAndLikeeId(Long likerId, Long likeeId);
}
