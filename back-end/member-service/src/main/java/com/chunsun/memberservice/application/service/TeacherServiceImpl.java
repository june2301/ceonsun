package com.chunsun.memberservice.application.service;

import java.time.LocalDate;
import java.time.Period;

import org.springframework.stereotype.Service;

import com.chunsun.memberservice.application.dto.TeacherDto;
import com.chunsun.memberservice.domain.Member;
import com.chunsun.memberservice.domain.MemberRepository;
import com.chunsun.memberservice.domain.Role;
import com.chunsun.memberservice.domain.Teacher;
import com.chunsun.memberservice.domain.TeacherRepository;

@Service
public class TeacherServiceImpl implements TeacherService {

	private final TeacherRepository teacherRepository;
	private final MemberRepository memberRepository;

	public TeacherServiceImpl(TeacherRepository teacherRepository, MemberRepository memberRepository) {
		this.teacherRepository = teacherRepository;
		this.memberRepository = memberRepository;
	}

	@Override
	public TeacherDto.CreateCardResponse createCard(Long id, TeacherDto.CreateCardRequest request) {

		Member member = memberRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));

		member.updateRole(Role.TEACHER);

		Teacher teacher = new Teacher(
			member,
			request.description(),
			request.classContents(),
			request.careerDescription(),
			request.careerProgress(),
			request.isWanted(),
			request.bank(),
			request.account(),
			request.price()
		);

		teacherRepository.save(teacher);

		return new TeacherDto.CreateCardResponse("선생 카드 생성 완료 : " + id);
	}

	@Override
	public TeacherDto.UpdateCardResponse updateCard(Long id, TeacherDto.UpdateCardRequest request) {

		Teacher teacher = teacherRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));

		teacher.updateCard(
			request.description(),
			request.classContents(),
			request.careerDescription(),
			request.careerProgress(),
			request.isWanted(),
			request.bank(),
			request.account(),
			request.price()
		);

		teacherRepository.save(teacher);

		return new TeacherDto.UpdateCardResponse("선생 카드 업데이트 완료 : " + id);
	}

	@Override
	public TeacherDto.GetCardResponse getCard(Long id) {

		Teacher teacher = teacherRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));

		return new TeacherDto.GetCardResponse(
			teacher.getDescription(),
			teacher.getCareerDescription(),
			teacher.getClassProgress(),
			teacher.getClassContents(),
			teacher.isWanted(),
			teacher.getBank(),
			teacher.getAccount(),
			teacher.getPrice(),
			teacher.getTotalClassCount(),
			teacher.getTotalClassHours()
		);
	}

	@Override
	public TeacherDto.GetDetailResponse getDetail(Long id) {

		Member memberInfo = memberRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));
		Teacher teacherInfo = teacherRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));

		return new TeacherDto.GetDetailResponse(
			memberInfo.getName(),
			memberInfo.getNickname(),
			memberInfo.getGender(),
			Period.between(memberInfo.getBirthdate(), LocalDate.now()).getYears(),
			teacherInfo.getDescription(),
			teacherInfo.getCareerDescription(),
			teacherInfo.getClassProgress(),
			teacherInfo.getClassContents(),
			teacherInfo.getPrice(),
			teacherInfo.getTotalClassCount(),
			teacherInfo.getTotalClassHours()
		);
	}
}
