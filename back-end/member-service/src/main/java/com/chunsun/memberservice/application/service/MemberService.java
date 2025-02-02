package com.chunsun.memberservice.application.service;

import org.springframework.stereotype.Service;

import com.chunsun.memberservice.application.dto.MemberDto;

public interface MemberService {

	MemberDto.SignUpResponse signUp(MemberDto.SignUpRequest request);
}
