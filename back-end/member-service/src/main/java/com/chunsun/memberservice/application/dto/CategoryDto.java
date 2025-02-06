package com.chunsun.memberservice.application.dto;

import java.util.List;

public record CategoryDto() {

	public record CategoryRequest(
		Long id,
		List<Long> categoryIds
	){
	}

	public record GetCategoryRequest(
		Long id
	) {
	}

	public record CategoryResponse(
		String message,
		List<Long> categoryIds
	){
	}

}
