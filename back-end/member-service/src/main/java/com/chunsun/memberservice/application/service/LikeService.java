package com.chunsun.memberservice.application.service;

import com.chunsun.memberservice.application.dto.LikeDto;

public interface LikeService {

	Boolean getLike(Long likerId, LikeDto.GetLikeRequest request);

}
