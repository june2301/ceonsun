package com.chunsun.memberservice.application.service;


import org.springframework.stereotype.Service;

import com.chunsun.memberservice.application.dto.LikeDto;
import com.chunsun.memberservice.domain.Like;
import com.chunsun.memberservice.domain.LikeRepository;

import jakarta.transaction.Transactional;

@Service
public class LikeServiceImpl implements LikeService {

	private LikeRepository likeRepository;

	public LikeServiceImpl(LikeRepository likeRepository) {
		this.likeRepository = likeRepository;
	}

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
