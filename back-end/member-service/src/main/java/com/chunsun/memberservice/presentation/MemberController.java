package com.chunsun.memberservice.presentation;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.chunsun.memberservice.application.dto.MemberDto;
import com.chunsun.memberservice.application.service.MemberService;

@RestController
@RequestMapping("/members")
public class MemberController {

	private final MemberService memberService;

	public MemberController(MemberService memberService) {
		this.memberService = memberService;
	}

	/*
	* 회원가입
	* 회원정보 수정
	* 회원정보 조회(본인 상세정보)
	* 회원 탈퇴
	* 닉네임 중복 체크
	* 학생 또는 선생 검색
	* */

	@PostMapping
	public ResponseEntity<MemberDto.SignUpResponse> createInfo(
		@RequestBody MemberDto.SignUpRequest request) {

		MemberDto.SignUpResponse response = memberService.signUp(request);

		return ResponseEntity.ok(response);
	}

	@PutMapping
	public ResponseEntity<MemberDto.UpdateInfoResponse> updateInfo(
		@RequestBody MemberDto.UpdateInfoRequest request) {

		MemberDto.UpdateInfoResponse updateInfo = memberService.updateMemberInfo(request);

		return ResponseEntity.ok(updateInfo);
	}

	@GetMapping
	public ResponseEntity<MemberDto.GetInfoResponse> getInfo(
		@RequestBody MemberDto.GetInfoRequest request) {

		MemberDto.GetInfoResponse getInfo = memberService.getMemberInfo(request.id());

		return ResponseEntity.ok(getInfo);
	}

	@DeleteMapping
	public ResponseEntity<Void> withdraw(
		@RequestBody MemberDto.GetInfoRequest request) {

		memberService.deleteMember(request.id());

		return ResponseEntity.ok().build();
	}

	@GetMapping("/nickname")
	public ResponseEntity<Void> nicknameCheck(
		@RequestParam String nickname) {

		memberService.checkNicknameAvailability(nickname);

		return ResponseEntity.ok().build();
	}

	@GetMapping("/search") // 개인정보 공개 여부 추가
	public ResponseEntity<Page<MemberDto.MemberListItem>> searchMembers(
		@RequestBody MemberDto.GetInfoRequest request,
		@RequestParam(required = false) String category,
		@RequestParam(required = false) String gender,
		@RequestParam(required = false) String age,
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size) {

		Page<MemberDto.MemberListItem> result = memberService.getFilterMembers(category, gender, age, page, size, request.id());

		return ResponseEntity.ok(result);
	}
}
