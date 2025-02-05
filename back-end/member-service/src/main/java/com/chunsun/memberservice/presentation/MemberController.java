package com.chunsun.memberservice.presentation;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
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

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/members")
public class MemberController {

	private final MemberService memberService;

	public MemberController(MemberService memberService) {
		this.memberService = memberService;
	}

	/*
	* 회원 중복 체크 & 쿠키에 카카오 아이디
	* 회원 탈퇴(소프트 딜리트) => 멤버 & (학생 또는 선생) 빼고 나머지는 하드 딜리팅
	* 닉네임 중복 체크
	* 상세정보 생성
	* 상세정보 수정
	* 상세정보 조회(본인 상세정보)
	* */

	@PostMapping
	public ResponseEntity<Void> signUp(HttpServletResponse response, @RequestBody MemberDto.KaKaoRequest request) {

		// 쿠키에 카카오 아이디, 이메일 저장
		Cookie kakaoIdCookie = new Cookie("kakaoId", request.kakaoId());
		kakaoIdCookie.setPath("/");
		kakaoIdCookie.setMaxAge(60 * 10);

		Cookie emailCookie = new Cookie("email", request.email());
		emailCookie.setPath("/");
		emailCookie.setMaxAge(60 * 10);

		response.addCookie(kakaoIdCookie);
		response.addCookie(emailCookie);

		return ResponseEntity.ok().build();
	}

	@DeleteMapping
	public ResponseEntity<Void> withdraw(@CookieValue(value = "userId", required = false) String userId) {

		Long id = Long.parseLong(userId);
		memberService.deleteMember(id);

		return ResponseEntity.ok().build();
	}

	@GetMapping
	public ResponseEntity<Void> nicknameCheck(@RequestParam String nickname) {

		memberService.checkNicknameAvailability(nickname);

		return ResponseEntity.ok().build();
	}

	@PostMapping("/info")
	public ResponseEntity<MemberDto.SignUpResponse> createInfo(
		@CookieValue(value = "kakaoId", required = false) String kakaoId,
		@CookieValue(value = "email", required = false) String email,
		@RequestBody MemberDto.SignUpRequest request) {

		MemberDto.SignUpResponse response = memberService.signUp(kakaoId, email, request);

		return ResponseEntity.ok(response);
	}

	@PutMapping("/info")
	public ResponseEntity<MemberDto.UpdateInfoResponse> updateInfo(
		@CookieValue(value = "userId", required = false) String userId,
		@RequestBody MemberDto.UpdateInfoRequest request) {

		Long id = Long.parseLong(userId);
		MemberDto.UpdateInfoResponse updateInfo = memberService.updateMemberInfo(id, request);

		return ResponseEntity.ok(updateInfo);
	}

	@GetMapping("/info")
	public ResponseEntity<MemberDto.GetInfoResponse> getInfo(
		@CookieValue(value = "userId", required = false) String userId) {

		Long id = Long.parseLong(userId);
		MemberDto.GetInfoResponse getInfo = memberService.getMemberInfo(id);

		return ResponseEntity.ok(getInfo);
	}

	@GetMapping("/search")
	public ResponseEntity<Page<MemberDto.MemberListItem>> searchMembers(
		@CookieValue(name = "userId", required = false) String userId,
		@RequestParam(required = false) String category,
		@RequestParam(required = false) String gender,
		@RequestParam(required = false) String age,
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size) {

		Long id = Long.parseLong(userId);
		Page<MemberDto.MemberListItem> result = memberService.getFilterMembers(category, gender, age, page, size, id);

		return ResponseEntity.ok(result);
	}
}
