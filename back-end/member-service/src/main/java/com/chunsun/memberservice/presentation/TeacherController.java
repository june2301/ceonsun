package com.chunsun.memberservice.presentation;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chunsun.memberservice.application.dto.TeacherDto;
import com.chunsun.memberservice.application.service.TeacherService;

@RestController
@RequestMapping("/teachers")
public class TeacherController {

	private TeacherService teacherService;

	public TeacherController(TeacherService teacherService) {
		this.teacherService = teacherService;
	}

	@PostMapping
	public ResponseEntity<TeacherDto.CreateCardResponse> addCard(@CookieValue(name = "userId", required = false) String userId, @RequestBody TeacherDto.CreateCardRequest request) {
		Long id = Long.parseLong(userId);

		TeacherDto.CreateCardResponse response = teacherService.createCard(id, request);
		return ResponseEntity.ok(response);
	}

	@PutMapping
	public ResponseEntity<TeacherDto.UpdateCardResponse> updateCard(@CookieValue(name = "userId", required = false) String userId, @RequestBody TeacherDto.UpdateCardRequest request) {
		Long id = Long.parseLong(userId);

		TeacherDto.UpdateCardResponse response = teacherService.updateCard(id, request);
		return ResponseEntity.ok(response);
	}

	@GetMapping
	public ResponseEntity<TeacherDto.GetCardResponse> getCard(@CookieValue(name = "userId", required = false) String userId) {
		Long id = Long.parseLong(userId);

		TeacherDto.GetCardResponse response = teacherService.getCard(id);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/{teacherId}")
	public ResponseEntity<TeacherDto.GetDetailResponse> getDetail(@CookieValue(name = "userId", required = false) String userId) {
		Long id = Long.parseLong(userId);

		TeacherDto.GetDetailResponse response = teacherService.getDetail(id);
		return ResponseEntity.ok(response);
	}


}
