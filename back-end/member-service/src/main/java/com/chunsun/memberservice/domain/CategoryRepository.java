package com.chunsun.memberservice.domain;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import feign.Param;

public interface CategoryRepository extends CrudRepository<Category, Long> {
	Optional<Category> findByNameIgnoreCase(String name);

	@Query("SELECT c FROM Category c JOIN c.memberCategories mc WHERE mc.member.id = :memberId")
	List<Category> findCategoriesByMemberId(@Param("memberId") Long memberId);
}
