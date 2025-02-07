package com.chunsun.memberservice.application.dto;

public record LikeDto() {

	public record LikeRequest(
		Long likerId,
		Long likeeId
	){
	}

	public record LikeResponse(
		Boolean isLike,
		String message
	){
	}
}
