package com.chunsun.memberservice.application.service;

import java.util.List;

import com.chunsun.memberservice.application.dto.CategoryDto;
import com.chunsun.memberservice.domain.Category;

public interface CategoryService {

	List<Category> getList();

	List<Category> getUserCategories(Long id);

	void createCategory(CategoryDto.CategoryRequest request);

	void deleteCategory(Long id);
}
