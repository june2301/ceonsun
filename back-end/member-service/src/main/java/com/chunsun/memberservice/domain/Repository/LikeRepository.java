package com.chunsun.memberservice.domain.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.chunsun.memberservice.domain.Entity.Like;

public interface LikeRepository extends JpaRepository<Like, Long> {
	Boolean existsByLikerIdAndLikeeId(Long likerId, Long likeeId);

	void deleteByLikerIdAndLikeeId(Long likerId, Long likeeId);
}
