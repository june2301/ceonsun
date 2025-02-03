package com.chunsun.memberservice.application.service;

import com.chunsun.memberservice.application.dto.MemberDto;

public interface MemberService {

	MemberDto.SignUpResponse signUp(String kakaoId, String email, MemberDto.SignUpRequest request);

	boolean existsByKakaoId(String kakaoId);

	boolean existsByEmail(String email);

	void deleteMember(Long id);

	boolean existsByNickname(String nickname);

	MemberDto.UpdateInfoResponse updateMemberInfo(Long id, MemberDto.UpdateInfoRequest request);

	MemberDto.GetInfoResponse getMemberInfo(Long id);

	boolean isDeleted(String kakaoId);

}
