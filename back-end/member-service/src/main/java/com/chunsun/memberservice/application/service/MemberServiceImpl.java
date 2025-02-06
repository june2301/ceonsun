package com.chunsun.memberservice.application.service;

import java.time.LocalDate;
import java.time.Period;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.chunsun.memberservice.application.dto.MemberDto;
import com.chunsun.memberservice.common.error.GlobalErrorCodes;
import com.chunsun.memberservice.common.exception.BusinessException;
import com.chunsun.memberservice.domain.Category;
import com.chunsun.memberservice.domain.CategoryRepository;
import com.chunsun.memberservice.domain.Gender;
import com.chunsun.memberservice.domain.Member;
import com.chunsun.memberservice.domain.MemberCategory;
import com.chunsun.memberservice.domain.MemberRepository;
import com.chunsun.memberservice.domain.Role;
import com.chunsun.memberservice.domain.Student;
import com.chunsun.memberservice.domain.StudentRepository;
import com.chunsun.memberservice.domain.MemberSpecification;
import com.chunsun.memberservice.domain.Teacher;
import com.chunsun.memberservice.domain.TeacherRepository;

@Service
public class MemberServiceImpl implements MemberService {

	private final MemberRepository memberRepository;
	private final CategoryRepository categoryRepository;
	private final StudentRepository studentRepository;
	private final TeacherRepository teacherRepository;

	public MemberServiceImpl(MemberRepository memberRepository, CategoryRepository categoryRepository,
		StudentRepository studentRepository, TeacherRepository teacherRepository) {
		this.memberRepository = memberRepository;
		this.categoryRepository = categoryRepository;
		this.studentRepository = studentRepository;
		this.teacherRepository = teacherRepository;
	}

	// 회원 가입
	@Override
	public MemberDto.SignUpResponse signUp(MemberDto.SignUpRequest request) {

		if(memberRepository.existsByKakaoId(request.kakaoId())) {
			throw new BusinessException(GlobalErrorCodes.DUPLICATE_KAKAO_ID);
		}

		if(memberRepository.existsByEmail(request.email())) {
			throw new BusinessException(GlobalErrorCodes.DUPLICATE_EMAIL);
		}

		Member member = Member.builder()
			.kakaoId(request.kakaoId())
			.email(request.email())
			.name(request.name())
			.nickname(request.nickname())
			.birthdate(request.birthdate())
			.role(Role.GUEST)
			.gender(request.gender())
			.build();
		memberRepository.save(member);

		return new MemberDto.SignUpResponse("가입 완료");
	}

	// 회원 탈퇴
	@Override
	public void deleteMember(Long id) {

		Member member = memberRepository.findById(id)
			.orElseThrow(() -> new BusinessException(GlobalErrorCodes.USER_NOT_FOUND));

		if(member.getDeletedAt() != null) {
			throw new BusinessException(GlobalErrorCodes.ALREADY_DELETED_USER);
		}

		// 1. 연관된 데이터 삭제 (카테고리 관계 삭제)
		member.getMemberCategories().clear();

		if (member.getRole() == Role.STUDENT && member.getStudent() != null) {
			Student student = studentRepository.findById(id)
				.orElseThrow(() -> new BusinessException(GlobalErrorCodes.STUDENT_NOT_FOUND));
			student.delete();
		} else if (member.getRole() == Role.TEACHER && member.getTeacher() != null) {
			Teacher teacher = teacherRepository.findById(id)
				.orElseThrow(() -> new BusinessException(GlobalErrorCodes.TEACHER_NOT_FOUND));
			teacher.delete();
		}
		member.delete();
		memberRepository.save(member);
	}

	// 닉네임 중복 체크
	@Override
	@Transactional(readOnly = true)
	public void checkNicknameAvailability(String nickname) {

		if(memberRepository.existsByNickname(nickname)) {
			throw new BusinessException(GlobalErrorCodes.DUPLICATE_NICKNAME);
		}
	}

	// 개인정보 수정
	@Override
	public MemberDto.UpdateInfoResponse updateMemberInfo(MemberDto.UpdateInfoRequest request) {

		Member member = memberRepository.findById(request.id())
			.orElseThrow(() -> new BusinessException(GlobalErrorCodes.USER_NOT_FOUND));

		member.updateInfo(request.nickname(), request.profileImage());
		memberRepository.save(member);

		return new MemberDto.UpdateInfoResponse();
	}

	// 개인정보 조회
	@Override
	public MemberDto.GetInfoResponse getMemberInfo(Long id) {

		Member member = memberRepository.findById(id)
			.orElseThrow(() -> new BusinessException(GlobalErrorCodes.USER_NOT_FOUND));

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
	public Boolean isDeleted(Long id) {

		Member member = memberRepository.findById(id)
			.orElseThrow(() -> new BusinessException(GlobalErrorCodes.USER_NOT_FOUND));

		return member.getDeletedAt() == null;
	}

	@Override
	@Transactional(readOnly = true)
	public Page<MemberDto.MemberListItem> getFilterMembers(
		String category, String gender, String age, int page, int size, Long userId) {

		// 현재 요청한 사용자의 정보 조회
		Member requestingUser = memberRepository.findById(userId)
			.orElseThrow(() -> new BusinessException(GlobalErrorCodes.USER_NOT_FOUND));

		Role requesterRole = requestingUser.getRole();
		Role searchTargetRole = Role.GUEST;

		// 요청자가 Teacher이면 Student 목록을, Student이면 Teacher 목록을 검색
		if (requesterRole == Role.TEACHER) {
			searchTargetRole = Role.STUDENT;
		} else if (requesterRole == Role.STUDENT) {
			searchTargetRole = Role.TEACHER;
		} else {
			throw new BusinessException(GlobalErrorCodes.GUEST_NOT_ALLOWED);
		}

		// 기본 조건: 검색 대상 Role로 필터 (요청자의 반대 Role)
		Specification<Member> spec = Specification.where(MemberSpecification.memberIdEquals(searchTargetRole));

		// 성별 필터 (예: MALE 또는 FEMALE)
		if (gender != null && !gender.isEmpty()) {
			try {
				Gender genderEnum = Gender.valueOf(gender.toUpperCase());
				spec = spec.and(MemberSpecification.hasGender(genderEnum));
			} catch (IllegalArgumentException e) {
				throw new BusinessException(GlobalErrorCodes.INVALID_GENDER);
			}
		}

		// 연령대 필터 (예: "20-40")
		if (age != null && age.contains("-")) {
			String[] ageParts = age.split("-");

			try{
				Integer lowerAge = Integer.parseInt(ageParts[0]);
				Integer upperAge = Integer.parseInt(ageParts[1]);

				if (lowerAge > upperAge) {
					throw new BusinessException(GlobalErrorCodes.INVALID_AGE_RANGE);
				}

				spec = spec.and(MemberSpecification.hasAgeBetween(lowerAge, upperAge));

			} catch (NumberFormatException e) {
				throw new BusinessException(GlobalErrorCodes.INVALID_AGE_FORMAT);
			}



		}

		// 카테고리 필터 (예: "python,java" -> AND 조건으로 모든 카테고리를 보유한 경우)
		if (category != null && !category.isEmpty() && !category.equalsIgnoreCase("none")) {
			String[] categoryNames = category.split(",");
			List<Category> categories = Arrays.stream(categoryNames)
				.map(name -> categoryRepository.findByNameIgnoreCase(name)
					.orElseThrow(() -> new BusinessException(GlobalErrorCodes.CATEGORY_NOT_FOUND)))
				.collect(Collectors.toList());
			spec = spec.and(MemberSpecification.hasAllCategories(categories));
		}

		Pageable pageable = PageRequest.of(page, size);
		Page<Member> resultPage = memberRepository.findAll(spec, pageable);

		List<MemberDto.MemberListItem> dtoList = resultPage.getContent().stream().map(member -> {
			Long memberId = member.getId();
			String nickname = member.getNickname();
			Integer memberAge = Period.between(member.getBirthdate(), LocalDate.now()).getYears();
			Gender memberGender = member.getGender();
			List<Category> memberCategories = member.getMemberCategories().stream()
				.map(MemberCategory::getCategory)
				.collect(Collectors.toList());
			return new MemberDto.MemberListItem(memberId, nickname, memberAge, memberGender, memberCategories);
		}).collect(Collectors.toList());

		return new PageImpl<>(dtoList, pageable, resultPage.getTotalElements());
	}

}
