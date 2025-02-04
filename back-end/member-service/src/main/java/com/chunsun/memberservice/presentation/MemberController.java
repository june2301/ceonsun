package com.chunsun.memberservice.presentation;

import java.time.LocalDateTime;
import java.util.Map;

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
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/members")
public class MemberController {

	private final MemberService memberService;

	public MemberController(MemberService memberService) {
		this.memberService = memberService;
	}

	@PostMapping
	public ResponseEntity<Void> signUp(HttpServletResponse response, @RequestBody MemberDto.KaKaoRequest request) {
		try {
			// 중복 체크
			boolean existsKaKaoId = memberService.existsByKakaoId(request.kakaoId());
			boolean existsEmail = memberService.existsByEmail(request.email());

			if (existsKaKaoId || existsEmail) {
				return ResponseEntity.status(HttpStatus.CONFLICT).build();
			}
			// 쿠키에 카카오 아이디, 이메일 저장
			Cookie kakaoIdCookie = new Cookie("kakaoId", request.kakaoId());
			kakaoIdCookie.setPath("/");
			kakaoIdCookie.setMaxAge(60 * 10);

			Cookie emailCookie = new Cookie("email", request.email());
			emailCookie.setPath("/");
			emailCookie.setMaxAge(60 * 10);

			response.addCookie(kakaoIdCookie);
			response.addCookie(emailCookie);

			// 회원가입 후 리다이렉팅
			return ResponseEntity.ok().build();
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	@DeleteMapping
	public ResponseEntity<Void> withdraw(@CookieValue(value = "userId", required = false) String userId) {

		extractUserId(userId);

		try {
			Long id = Long.parseLong(userId);
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

	@PostMapping("/info")
	public ResponseEntity<MemberDto.SignUpResponse> createInfo(
		@CookieValue(value = "kakaoId", required = false) String kakaoId,
		@CookieValue(value = "email", required = false) String email,
		@RequestBody MemberDto.SignUpRequest request) {

		if (kakaoId == null || email == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
				.body(new MemberDto.SignUpResponse("쿠키 정보가 없습니다."));
		}

		// 회원 정보 생성
		MemberDto.SignUpResponse response = memberService.signUp(kakaoId, email, request);

		return ResponseEntity.ok(response);
	}

	@PutMapping("/info")
	public ResponseEntity<MemberDto.UpdateInfoResponse> updateInfo(
		@CookieValue(value = "userId", required = false) String userId,
		@RequestBody MemberDto.UpdateInfoRequest request) {

		extractUserId(userId);

		try {
			Long id = Long.parseLong(userId);
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

		extractUserId(userId);

		try {
			Long id = Long.parseLong(userId);
			MemberDto.GetInfoResponse getInfo = memberService.getMemberInfo(id);
			return ResponseEntity.ok(getInfo);
		} catch (NumberFormatException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	////////////////////////////////////////////////////////////

	private Integer extractUserId(String userId) {
		// 쿠키에 userId가 null 일 때
		if (userId == null) {
			throw new UnauthorizedException(GlobalErrorCodes.UNAUTHORIZED);
		}
		try {
			return Integer.parseInt(userId);
		}
		// userId에 숫자가 아닌 값이 들어왔을 때
		catch (NumberFormatException e) {
			throw new BadRequestException(GlobalErrorCodes.INVALID_USER_ID);
		}
	}

	// 탈퇴한 회원인지 확인
	private boolean checkDeltedMember(String kakaoId) {
		// deletedAt이 null인지 체크
		return memberService.isDeleted(kakaoId);
	}


}
