package com.chunsun.memberservice.application.service;

import com.chunsun.memberservice.application.dto.MemberDto;

public interface MemberService {

	MemberDto.SignUpResponse signUp(MemberDto.SignUpRequest request);

	boolean existsByKakaoId(String kakaoId);

	boolean existsByEmail(String email);

	void deleteMember(int id);

	boolean existsByNickname(String nickname);

	MemberDto.InsertInfoResponse insertMemberInfo(int id, MemberDto.InsertInfoRequest request);

	MemberDto.UpdateInfoResponse updateMemberInfo(int id, MemberDto.UpdateInfoRequest request);

	MemberDto.GetInfoResponse getMemberInfo(int id);
}
