package com.chunsun.memberservice.application.service;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chunsun.memberservice.application.dto.TeacherDto;
import com.chunsun.memberservice.common.error.GlobalErrorCodes;
import com.chunsun.memberservice.common.exception.BusinessException;
import com.chunsun.memberservice.config.feign.RankClient;
import com.chunsun.memberservice.domain.Entity.Category;
import com.chunsun.memberservice.domain.Entity.Member;
import com.chunsun.memberservice.domain.Entity.MemberCategory;
import com.chunsun.memberservice.domain.Repository.MemberRepository;
import com.chunsun.memberservice.domain.Enum.Role;
import com.chunsun.memberservice.domain.Entity.Teacher;
import com.chunsun.memberservice.domain.Repository.TeacherRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TeacherServiceImpl implements TeacherService {

	private final TeacherRepository teacherRepository;
	private final MemberRepository memberRepository;
	private final CategoryService categoryService;
	private final RankClient rankClient;

	@Override
	@Transactional
	public TeacherDto.CreateCardResponse createCard(Long id, TeacherDto.CreateCardRequest request) {

		Member member = memberRepository.findById(id).orElseThrow(()
			-> new BusinessException(GlobalErrorCodes.USER_NOT_FOUND));

		Role role = member.getRole();

		if(role == Role.STUDENT) {
			throw new BusinessException(GlobalErrorCodes.ALREADY_STUDENT);
		}
		if(role == Role.TEACHER) {
			throw new BusinessException(GlobalErrorCodes.ALREADY_TEACHER);
		}

		member.updateRole(Role.TEACHER);

		Teacher teacher = new Teacher(
			member,
			request.description(),
			request.careerDescription(),
			request.careerProgress(),
			request.classContents(),
			request.isWanted(),
			request.bank(),
			request.account(),
			request.price()
		);
		teacherRepository.save(teacher);

		return new TeacherDto.CreateCardResponse("선생 카드 생성 완료");
	}

	@Override
	@Transactional
	public TeacherDto.UpdateCardResponse updateCard(Long id, TeacherDto.UpdateCardRequest request) {

		Teacher teacher = teacherRepository.findById(id).orElseThrow(()
			-> new BusinessException(GlobalErrorCodes.TEACHER_NOT_FOUND));

		Member member = memberRepository.findById(id).orElseThrow(
			() -> new BusinessException(GlobalErrorCodes.USER_NOT_FOUND));

		if (member.getRole() != Role.TEACHER) {
			throw new BusinessException(GlobalErrorCodes.NOT_TEACHER);
		}

		teacher.updateCard(
			request.description(),
			request.careerDescription(),
			request.careerProgress(),
			request.classContents(),
			request.isWanted(),
			request.bank(),
			request.account(),
			request.price()
		);

		return new TeacherDto.UpdateCardResponse("선생 카드 업데이트 완료");
	}

	@Override
	public TeacherDto.GetCardResponse getCard(Long id) {

		Teacher teacher = teacherRepository.findById(id).orElseThrow(()
			-> new BusinessException(GlobalErrorCodes.TEACHER_NOT_FOUND));

		return new TeacherDto.GetCardResponse(
			teacher.getDescription(),
			teacher.getCareerDescription(),
			teacher.getCareerProgress(),
			teacher.getClassContents(),
			teacher.getIsWanted(),
			teacher.getBank(),
			teacher.getAccount(),
			teacher.getPrice(),
			teacher.getTotalClassCount(),
			teacher.getTotalClassHours(),
			categoryService.getUserCategories(id)
		);
	}

	@Override
	public TeacherDto.GetDetailResponse getDetail(Long id) {

		Member memberInfo = memberRepository.findWithCategoriesById(id).orElseThrow(()
			-> new BusinessException(GlobalErrorCodes.USER_NOT_FOUND));

		Teacher teacherInfo = teacherRepository.findById(id).orElseThrow(()
			-> new BusinessException(GlobalErrorCodes.TEACHER_NOT_FOUND));

		List<Category> categories = memberInfo.getMemberCategories().stream()
			.map(MemberCategory::getCategory)
			.collect(Collectors.toList());

		rankClient.incrementTeacherViewCount(teacherInfo.getId());

		return new TeacherDto.GetDetailResponse(
			memberInfo.getName(),
			memberInfo.getProfileImage(),
			memberInfo.getNickname(),
			memberInfo.getGender(),
			Period.between(memberInfo.getBirthdate(), LocalDate.now()).getYears(),
			teacherInfo.getDescription(),
			teacherInfo.getCareerDescription(),
			teacherInfo.getCareerProgress(),
			teacherInfo.getClassContents(),
			teacherInfo.getPrice(),
			teacherInfo.getTotalClassCount(),
			teacherInfo.getTotalClassHours(),
			categories
		);
	}

	@Override
	@Transactional
	public TeacherDto.ClassFinishResponse updateClass(Long id, TeacherDto.ClassFinishRequest request) {

		Teacher teacher = teacherRepository.findById(id).orElseThrow(()
			-> new BusinessException(GlobalErrorCodes.TEACHER_NOT_FOUND));

		if (request.time() <= 0) {
			throw new BusinessException(GlobalErrorCodes.INVALID_CLASS_TIME);
		}

		Integer count = teacher.getTotalClassCount() + 1;
		Integer hours = teacher.getTotalClassHours() + request.time();

		teacher.updateClass(count, hours);

		return new TeacherDto.ClassFinishResponse(count, hours);
	}

	@Override
	public TeacherDto.ClassFinishResponse getClass(Long id) {

		Teacher teacher = teacherRepository.findById(id).orElseThrow(()
			-> new BusinessException(GlobalErrorCodes.TEACHER_NOT_FOUND));

		return new TeacherDto.ClassFinishResponse(teacher.getTotalClassCount(), teacher.getTotalClassHours()/60);
	}
}
