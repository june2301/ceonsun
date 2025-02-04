package com.chunsun.memberservice.application.service;

import org.springframework.stereotype.Service;

import com.chunsun.memberservice.application.dto.MemberDto;
import com.chunsun.memberservice.domain.Member;
import com.chunsun.memberservice.domain.MemberRepository;
import com.chunsun.memberservice.domain.Role;

@Service
public class MemberServiceImpl implements MemberService {

	private final MemberRepository memberRepository;

	public MemberServiceImpl(MemberRepository memberRepository) {
		this.memberRepository = memberRepository;
	}

	// 회원 가입
	@Override
	public MemberDto.SignUpResponse signUp(String kakaoId, String email, MemberDto.SignUpRequest request) {
		Member member = Member.builder()
			.kakaoId(kakaoId)
			.email(email)
			.name(request.name())
			.nickname(request.nickname())
			.birthdate(request.birthdate())
			.role(Role.GUEST)
			.gender(request.gender())
			.build();
		memberRepository.save(member);

		return new MemberDto.SignUpResponse("가입 완료");
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
	public void deleteMember(Long id) {
		Member member = memberRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));

		member.delete();
		memberRepository.save(member);
	}

	// 닉네임 중복 체크
	@Override
	public boolean existsByNickname(String nickname) {
		return memberRepository.existsByNickname(nickname);
	}

	// 개인정보 수정
	@Override
	public MemberDto.UpdateInfoResponse updateMemberInfo(Long id, MemberDto.UpdateInfoRequest request) {
		Member member = memberRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));

		member.updateInfo(request.nickname(), request.profileImage());
		memberRepository.save(member);

		return new MemberDto.UpdateInfoResponse();
	}

	// 개인정보 조회
	@Override
	public MemberDto.GetInfoResponse getMemberInfo(Long id) {
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

	// 탈퇴한 회원인지 확인
	@Override
	public boolean isDeleted(String kakaoId) {
		Member member = memberRepository.findByKakaoId(kakaoId);

		return member.getDeletedAt() == null;
	}

}
