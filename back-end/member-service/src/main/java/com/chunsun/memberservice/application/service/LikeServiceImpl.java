package com.chunsun.memberservice.application.service;


import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chunsun.memberservice.application.dto.LikeDto;
import com.chunsun.memberservice.domain.Entity.Like;
import com.chunsun.memberservice.domain.Repository.LikeRepository;

@Service
@Transactional(readOnly = true)
public class LikeServiceImpl implements LikeService {

	private final LikeRepository likeRepository;

	public LikeServiceImpl(LikeRepository likeRepository) {
		this.likeRepository = likeRepository;
	}

	// 찜하기 요청, 취소
	@Override
	@Transactional
	public Boolean getLike(LikeDto.GetLikeRequest request) {

		Long liker = request.likerId();
		Long likee = request.likeeId();

		Boolean isLike = likeRepository.existsByLikerIdAndLikeeId(liker,likee);

		if(isLike) {
			likeRepository.deleteByLikerIdAndLikeeId(liker, likee);

			return false;
		} else {
			Like like =Like.builder().
				likerId(liker).
				likeeId(likee).
				build();
			likeRepository.save(like);

			return true;
		}
	}
}
