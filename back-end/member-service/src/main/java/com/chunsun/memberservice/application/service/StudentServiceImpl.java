package com.chunsun.memberservice.application.service;

import java.time.LocalDate;
import java.time.Period;

import org.springframework.stereotype.Service;

import com.chunsun.memberservice.application.dto.StudentDto;
import com.chunsun.memberservice.common.error.GlobalErrorCodes;
import com.chunsun.memberservice.common.exception.BusinessException;
import com.chunsun.memberservice.domain.Member;
import com.chunsun.memberservice.domain.MemberRepository;
import com.chunsun.memberservice.domain.Role;
import com.chunsun.memberservice.domain.Student;
import com.chunsun.memberservice.domain.StudentRepository;

@Service
public class StudentServiceImpl implements StudentService {

	private final StudentRepository studentRepository;
	private final MemberRepository memberRepository;

	public StudentServiceImpl(StudentRepository studentRepository, MemberRepository memberRepository) {
		this.studentRepository = studentRepository;
		this.memberRepository = memberRepository;
	}

	// 카드 생성
	@Override
	public StudentDto.CreateCardResponse createCard(Long id, StudentDto.CreateCardRequest request) {

		Member member = memberRepository.findById(id).orElseThrow(()
			-> new BusinessException(GlobalErrorCodes.USER_NOT_FOUND));

		if(member.getRole() == Role.STUDENT) {
			throw new BusinessException(GlobalErrorCodes.ALREADY_STUDENT);
		}

		member.updateRole(Role.STUDENT);

		Student student = new Student(
			member,
			request.isExposed(),
			request.description()
		);

		studentRepository.save(student);

		return new StudentDto.CreateCardResponse("학생 카드 생성 완료 : " + id);
	}

	// 카드 업데이트
	@Override
	public StudentDto.UpdateCardResponse updateCard(Long id, StudentDto.UpdateCardRequest request) {

		Student student = studentRepository.findById(id).orElseThrow(()
			-> new BusinessException(GlobalErrorCodes.STUDENT_NOT_FOUND));

		if(student.getMember().getRole() != Role.STUDENT) {
			throw new BusinessException(GlobalErrorCodes.NOT_STUDENT);
		}

		student.updateCard(
			request.isExposed(),
			request.description()
		);

		studentRepository.save(student);

		return new StudentDto.UpdateCardResponse("학생 카드 업데이트 완료 : " + id);
	}

	// 카드 조회
	@Override
	public StudentDto.GetCardResponse getCard(Long id) {

		Student student = studentRepository.findById(id).orElseThrow(()
			-> new BusinessException(GlobalErrorCodes.STUDENT_NOT_FOUND));

		return new StudentDto.GetCardResponse(
			student.getIsExposed(),
			student.getDescription()
		);
	}

	// 카드 상세조회
	@Override
	public StudentDto.GetDetailResponse getDetail(Long id) {

		Member memberInfo = memberRepository.findById(id).orElseThrow(()
			-> new BusinessException(GlobalErrorCodes.USER_NOT_FOUND));

		Student studentInfo = studentRepository.findById(id).orElseThrow(()
			-> new BusinessException(GlobalErrorCodes.STUDENT_NOT_FOUND));

		return new StudentDto.GetDetailResponse(
			memberInfo.getName(),
			memberInfo.getNickname(),
			memberInfo.getGender(),
			Period.between(memberInfo.getBirthdate(), LocalDate.now()).getYears(),
			studentInfo.getDescription()
		);
	}
}
