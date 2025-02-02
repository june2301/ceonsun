package com.chunsun.memberservice.application.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.chunsun.memberservice.application.dto.MemberDto;
import com.chunsun.memberservice.domain.Member;
import com.chunsun.memberservice.domain.MemberRepository;

@Service
public class MemberServiceImpl implements MemberService {

	private final MemberRepository memberRepository;

	public MemberServiceImpl(MemberRepository memberRepository) {
		this.memberRepository = memberRepository;
	}

	// 회원가입
	@Override
	public MemberDto.SignUpResponse signUp(MemberDto.SignUpRequest request) {
		// 기존 회원 확인
		Optional<Member> existingMember = memberRepository.findByKakaoId(request.kakaoId());

		if(existingMember.isPresent()) {
			// 토큰 값
			String token = "jwtToken";
			return new MemberDto.SignUpResponse(token);
		}

		Member newMember = Member.builder()
			.kakaoId(request.kakaoId())
			.email(request.email())
			.build();
		memberRepository.save(newMember);

		// 토큰 값
		String token = "jwtToken";
		return new MemberDto.SignUpResponse(token);
	}
}
