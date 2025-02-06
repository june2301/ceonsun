package com.chunsun.memberservice.application.service;

import com.chunsun.memberservice.application.dto.StudentDto;

public interface StudentService {
	StudentDto.CardResponse createCard(StudentDto.CardRequest request);

	StudentDto.CardResponse updateCard(StudentDto.CardRequest request);

	StudentDto.GetCardResponse getCard(StudentDto.GetCardRequest request);

	StudentDto.GetDetailResponse getDetail(Long id);
}
