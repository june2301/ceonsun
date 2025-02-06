package com.chunsun.memberservice.presentation;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.chunsun.memberservice.application.dto.CategoryDto;
import com.chunsun.memberservice.application.dto.LikeDto;
import com.chunsun.memberservice.application.service.CategoryService;
import com.chunsun.memberservice.application.service.LikeService;
import com.chunsun.memberservice.domain.Category;

@RestController
public class CommonController {

	private final CategoryService categoryService;
	private final LikeService likeService;

	public CommonController(CategoryService categoryService, LikeService likeService) {
		this.categoryService = categoryService;
		this.likeService = likeService;
	}
	/*
	* 회원 카테고리 입력
	* 회원 카테고리 수정
	* 회원 카테고리 조회
	* 카테고리 목록조회
	* 찜하기
	* */

	@PostMapping("/category")
	public ResponseEntity<CategoryDto.CategoryResponse> createCategory(
		@RequestBody CategoryDto.CategoryRequest request) {


		categoryService.createCategory(request);

		return ResponseEntity.ok().body(new CategoryDto.CategoryResponse("카테고리 입력/업데이트 완료", request.categoryIds()));
	}

	@PutMapping("/category")
	public ResponseEntity<CategoryDto.CategoryResponse> updateCategory(
		@RequestBody CategoryDto.CategoryRequest request) {

		// 기존 카테고리 정보 삭제
		categoryService.deleteCategory(request.id());

		createCategory(request);

		return ResponseEntity.ok().body(new CategoryDto.CategoryResponse("카테고리 업데이트 완료", request.categoryIds()));
	}

	@GetMapping("/category")
	public List<Category> getUserCategories(
		@RequestBody CategoryDto.GetCategoryRequest request) {

		return categoryService.getUserCategories(request.id());
	}

	@GetMapping("/categories")
	public List<Category> getCategory() {

		return categoryService.getList();
	}

	@PostMapping("/like")
	public ResponseEntity<LikeDto.GetLikeResponse> like(
		@RequestBody LikeDto.GetLikeRequest request) {

		// 이미 찜했다면 삭제, 안했다면 찜
		Boolean isLike = likeService.getLike(request);

		String message = isLike? (request.likerId() + "가 찜했습니다.") : (request.likerId() + "가 찜을 해제했습니다.");

		return ResponseEntity.ok(new LikeDto.GetLikeResponse(isLike, message));
	}
}
