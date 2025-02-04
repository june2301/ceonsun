package com.chunsun.memberservice.presentation;

import java.lang.reflect.Type;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.chunsun.memberservice.application.dto.LikeDto;
import com.chunsun.memberservice.application.service.CategoryService;
import com.chunsun.memberservice.application.service.LikeService;
import com.chunsun.memberservice.domain.Category;

@RestController
public class CommonController {

	private CategoryService categoryService;
	private LikeService likeService;

	public CommonController(CategoryService categoryService, LikeService likeService) {
		this.categoryService = categoryService;
		this.likeService = likeService;
	}

	@GetMapping("/category")
	public List<Category> getCategory() {
		List<Category> categories = categoryService.getList();
		return categories;
	}

	@PostMapping("/like")
	public ResponseEntity<LikeDto.GetLikeResponse> like(@CookieValue(name = "userId", required = false) String userId, @RequestBody LikeDto.GetLikeRequest request) {
		Long liker = Long.parseLong(userId);
		// liker에 likerId, likee에 likeeId 가 있다면 해제
		// 없다면 좋아요
		boolean isLike = likeService.getLike(liker, request);
		String message = isLike? (liker + "가 찜했습니다.") : (liker + "가 찜을 해제했습니다.");

		return ResponseEntity.ok(new LikeDto.GetLikeResponse(isLike, message));
	}

}
