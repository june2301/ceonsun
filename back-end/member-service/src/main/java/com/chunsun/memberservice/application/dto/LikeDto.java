package com.chunsun.memberservice.application.dto;

public record LikeDto() {

	public record GetLikeRequest(
		Long likerId,
		Long likeeId
	){
	}

	public record GetLikeResponse(
		Boolean isLike,
		String message
	){
	}
}
