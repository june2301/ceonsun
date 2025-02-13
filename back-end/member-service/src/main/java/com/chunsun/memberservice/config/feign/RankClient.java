package com.chunsun.memberservice.config.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@FeignClient(name = "rank-service")
public interface RankClient {

	@PostMapping("/ranking/{teacherId}/view")
	String incrementTeacherViewCount(@PathVariable("teacherId") Long teacherId);
}
