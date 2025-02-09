package com.chunsun.authservice.application.dto;

import com.chunsun.authservice.domain.entity.Role;

import lombok.Builder;

@Builder
public record MemberDto(Long id, String nickname, Role role) {
}
