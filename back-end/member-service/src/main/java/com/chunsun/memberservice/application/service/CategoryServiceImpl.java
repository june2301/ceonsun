package com.chunsun.memberservice.application.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.chunsun.memberservice.domain.Category;
import com.chunsun.memberservice.domain.CategoryRepository;

@Service
public class CategoryServiceImpl implements CategoryService {

	private CategoryRepository categoryRepository;

	public CategoryServiceImpl(CategoryRepository categoryRepository) {
		this.categoryRepository = categoryRepository;
	}

	@Override
	public List<Category> getList() {
		List<Category> categories = (List<Category>)categoryRepository.findAll();
		return categories;
	}
}
