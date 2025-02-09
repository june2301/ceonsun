package com.chunsun.memberservice.domain.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.chunsun.memberservice.domain.Entity.Category;

import feign.Param;

public interface CategoryRepository extends CrudRepository<Category, Long> {
	Optional<Category> findByNameIgnoreCase(String name);

	List<Category> findByIdIn(List<Long> categoryIds);

}
