package com.chunsun.memberservice.application.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.chunsun.memberservice.application.dto.CategoryDto;
import com.chunsun.memberservice.common.error.GlobalErrorCodes;
import com.chunsun.memberservice.common.exception.BusinessException;
import com.chunsun.memberservice.domain.Category;
import com.chunsun.memberservice.domain.CategoryRepository;
import com.chunsun.memberservice.domain.Member;
import com.chunsun.memberservice.domain.MemberCategory;
import com.chunsun.memberservice.domain.MemberCategoryRepository;

import jakarta.transaction.Transactional;

@Service
public class CategoryServiceImpl implements CategoryService {

	private final MemberCategoryRepository memberCategoryRepository;
	private CategoryRepository categoryRepository;

	public CategoryServiceImpl(CategoryRepository categoryRepository, MemberCategoryRepository memberCategoryRepository) {
		this.categoryRepository = categoryRepository;
		this.memberCategoryRepository = memberCategoryRepository;
	}

	// 카테고리 목록 불러오기
	@Override
	public List<Category> getList() {

		List<Category> categories = (List<Category>)categoryRepository.findAll();

		return categories;
	}

	// 유저가 선택한 카테고리 불러오기
	@Override
	public List<Category> getUserCategories(Long memberId) {

		return categoryRepository.findCategoriesByMemberId(memberId);
	}

	// 카테고리 생성 및 업데이트
	@Override
	@Transactional
	public void createCategory(Long memberId, CategoryDto.CategoryRequest request) {

		for (Long categoryId : request.categoryIds()) {
			Category category = categoryRepository.findById(categoryId).orElseThrow(()
				-> new BusinessException(GlobalErrorCodes.CATEGORY_NOT_FOUND));

			MemberCategory memberCategory = new MemberCategory(new Member(memberId), category);
			memberCategoryRepository.save(memberCategory);
		}
	}

	// 카테고리 삭제
	@Override
	@Transactional
	public void deleteCategory(Long memberId) {

		memberCategoryRepository.deleteByMemberId(memberId);
	}
}
