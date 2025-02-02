package com.chunsun.memberservice.presentation;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chunsun.memberservice.application.dto.MemberDto;
import com.chunsun.memberservice.application.service.MemberService;


@RestController
@RequestMapping("/members2")
public class MemberController {

	private final MemberService memberService;

	public MemberController(MemberService memberService) {
		this.memberService = memberService;
	}

	@GetMapping
	public String test(){
		return "test";
	}

	@PostMapping
	public ResponseEntity<MemberDto.SignUpResponse> signUp(@RequestBody MemberDto.SignUpRequest request) {
		return ResponseEntity.ok(memberService.signUp(request));
	}


}
