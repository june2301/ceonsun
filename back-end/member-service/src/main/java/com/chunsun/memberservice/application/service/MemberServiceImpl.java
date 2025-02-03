package com.chunsun.memberservice.application.service;

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

	// 회원 가입
	@Override
	public MemberDto.SignUpResponse signUp(MemberDto.SignUpRequest request) {
		Member member = Member.builder()
			.kakaoId(request.kakaoId())
			.email(request.email())
			.build();
		memberRepository.save(member);

		// 토큰 값 추후 입력
		String token = "jwtToken";
		return new MemberDto.SignUpResponse("가입 완료",token);
	}

	// 카카오 아이디 중복 가입 체크
	@Override
	public boolean existsByKakaoId(String kakaoId) {
		return memberRepository.existsByKakaoId(kakaoId);
	}

	// 이메일 중복 가입 체크
	@Override
	public boolean existsByEmail(String email) {
		return memberRepository.existsByEmail(email);
	}

	// 회원 탈퇴
	@Override
	public void deleteMember(int id) {
		Member member = memberRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));

		member.delete();
		memberRepository.save(member);
	}

	// 닉네임 중복 체크
	@Override
	public boolean existsByNickname(String nickname) {
		return memberRepository.existsByNickname(nickname);
	}

	// 개인정보 입력
	@Override
	public MemberDto.InsertInfoResponse insertMemberInfo(int id, MemberDto.InsertInfoRequest request) {
		Member member = memberRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));

		member.insertInfo(request.name(), request.nickname(), request.birthdate(), request.gender());
		memberRepository.save(member);

		return new MemberDto.InsertInfoResponse();
	}

	// 개인정보 수정
	@Override
	public MemberDto.UpdateInfoResponse updateMemberInfo(int id, MemberDto.UpdateInfoRequest request) {
		Member member = memberRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));

		member.updateInfo(request.nickname(), request.profileImage());
		memberRepository.save(member);

		return new MemberDto.UpdateInfoResponse();
	}

	// 개인정보 조회
	@Override
	public MemberDto.GetInfoResponse getMemberInfo(int id) {
		Member member = memberRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));

		return new MemberDto.GetInfoResponse(
			member.getName(),
			member.getNickname(),
			member.getEmail(),
			member.getBirthdate(),
			member.getGender(),
			member.getProfileImage()
		);
	}

}
