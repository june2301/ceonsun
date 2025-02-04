package com.chunsun.memberservice.application.dto;

public record LikeDto() {

	public record GetLikeRequest(
		Long likeeId
	){

	}

	public record GetLikeResponse(
		boolean isLike,
		String message
	){
	}
}
