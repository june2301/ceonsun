package com.chunsun.memberservice.presentation;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

	private final TeacherService teacherService;

	public TeacherController(TeacherService teacherService) {
		this.teacherService = teacherService;
	}

	/*
	* 선생 카드 생성
	* 선생 카드 수정
	* 선생 카드 조회(본인 카드)
	* 선생 카드 조회(남 카드)
	* 선생 수업 횟수/시간 업데이트
	* 선생 수업 횟수/시간 조회
	* */

	@PostMapping
	public ResponseEntity<TeacherDto.CreateCardResponse> addCard(
		@RequestBody TeacherDto.CreateCardRequest request) {

		TeacherDto.CreateCardResponse response = teacherService.createCard(request);
		return ResponseEntity.ok(response);
	}

	@PutMapping
	public ResponseEntity<TeacherDto.UpdateCardResponse> updateCard(
		@RequestBody TeacherDto.UpdateCardRequest request) {

		TeacherDto.UpdateCardResponse response = teacherService.updateCard(request);
		return ResponseEntity.ok(response);
	}

	@GetMapping
	public ResponseEntity<TeacherDto.GetCardResponse> getCard(
		@RequestBody TeacherDto.GetCardRequest request) {

		TeacherDto.GetCardResponse response = teacherService.getCard(request.id());
		return ResponseEntity.ok(response);
	}

	@GetMapping("/{teacherId}")
	public ResponseEntity<TeacherDto.GetDetailResponse> getDetail(
		@PathVariable Long teacherId) {

		TeacherDto.GetDetailResponse response = teacherService.getDetail(teacherId);
		return ResponseEntity.ok(response);
	}

	@PutMapping("/class")
	public ResponseEntity<TeacherDto.ClassFinishResponse> classCountUpdate(
		@RequestBody TeacherDto.ClassFinishRequest request){

		TeacherDto.ClassFinishResponse response = teacherService.updateClass(request);

		return ResponseEntity.ok(response);
	}

	@GetMapping("/class")
	public ResponseEntity<TeacherDto.ClassFinishResponse> getClassCount(
		@RequestBody TeacherDto.GetClassRequest request) {

		TeacherDto.ClassFinishResponse response = teacherService.getClass(request.id());

		return ResponseEntity.ok(response);
	}
}
