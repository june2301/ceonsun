package com.chunsun.memberservice.presentation;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.chunsun.memberservice.application.dto.MemberDto;
import com.chunsun.memberservice.application.service.MemberService;
import com.chunsun.memberservice.common.error.GlobalErrorCodes;
import com.chunsun.memberservice.common.exception.BadRequestException;
import com.chunsun.memberservice.common.exception.ForbiddenException;
import com.chunsun.memberservice.common.exception.UnauthorizedException;

import feign.Response;

@RestController
@RequestMapping("/members")
public class MemberController {

	private final MemberService memberService;

	public MemberController(MemberService memberService) {
		this.memberService = memberService;
	}

	@PostMapping
	public ResponseEntity<MemberDto.SignUpResponse> signUp(@RequestBody MemberDto.SignUpRequest request) {
		try {
			// 중복 체크
			boolean existsKaKaoId = memberService.existsByKakaoId(request.kakaoId());
			boolean existsEmail = memberService.existsByEmail(request.email());

			if (existsKaKaoId || existsEmail) {
				return ResponseEntity.status(HttpStatus.CONFLICT)
					.body(new MemberDto.SignUpResponse("이미 가입된 회원", null));
			}

			return ResponseEntity.ok(memberService.signUp(request));
		} catch (Exception e) {
			// 예외 발생 시 에러 로그 출력
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(new MemberDto.SignUpResponse("오류 발생", null));
		}
	}


	@DeleteMapping
	public ResponseEntity<Void> withdraw(@CookieValue(value = "userId", required = false) String userId) {
		if (userId == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

		try {
			int id = Integer.parseInt(userId);
			memberService.deleteMember(id);
			return ResponseEntity.ok().build();
		} catch (NumberFormatException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build(); // userId가 숫자가 아닐 경우 400 에러
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}


	@GetMapping
	public ResponseEntity<Void> nicknameCheck(@RequestParam String nickname) {
		try {
			boolean existsNickname = memberService.existsByNickname(nickname);
			System.out.println(nickname);

			if (existsNickname) { // 중복 되면 409
				return ResponseEntity.status(HttpStatus.CONFLICT).build();
			}
			return ResponseEntity.ok().build();
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	@PutMapping("/info")
	public ResponseEntity<MemberDto.InsertInfoResponse> insertInfo(
		@CookieValue(value = "userId", required = false) String userId,
		@RequestBody MemberDto.InsertInfoRequest request) {

		if (userId == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

		try {
			int id = Integer.parseInt(userId);
			MemberDto.InsertInfoResponse insertInfo = memberService.insertMemberInfo(id, request);
			return ResponseEntity.ok(insertInfo);
		} catch (NumberFormatException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	@PutMapping("/info/update")
	public ResponseEntity<MemberDto.UpdateInfoResponse> updateInfo(
		@CookieValue(value = "userId", required = false) String userId,
		@RequestBody MemberDto.UpdateInfoRequest request) {

		if (userId == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

		try {
			int id = Integer.parseInt(userId);
			MemberDto.UpdateInfoResponse updateInfo = memberService.updateMemberInfo(id, request);
			return ResponseEntity.ok(updateInfo);
		} catch (NumberFormatException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	@GetMapping("/info")
	public ResponseEntity<MemberDto.GetInfoResponse> getInfo(
		@CookieValue(value = "userId", required = false) String userId) {

		if (userId == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

		try {
			int id = Integer.parseInt(userId);
			MemberDto.GetInfoResponse getInfo = memberService.getMemberInfo(id);
			return ResponseEntity.ok(getInfo);
		} catch (NumberFormatException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	// 쿠키에 userId 확인
	private Integer extractUserId(String userId) {
		if (userId == null) {
			throw new UnauthorizedException(GlobalErrorCodes.UNAUTHORIZED);
		}
		try {
			return Integer.parseInt(userId);
		} catch (NumberFormatException e) {
			throw new BadRequestException(GlobalErrorCodes.INVALID_USER_ID);
		}
	}

	// 탈퇴한 회원인지 확인
	private void checkIfDeletedMember(int userId) {
		boolean isDeleted = memberService.isDeleted; // deletedAt이 null인지 체크하는 메서드
		if (isDeleted) {
			throw new ForbiddenException("탈퇴한 회원입니다. 다시 가입해주세요.");
		}
	}


}
