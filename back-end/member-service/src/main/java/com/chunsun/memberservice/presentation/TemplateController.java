package com.chunsun.memberservice.presentation;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chunsun.memberservice.config.interceptor.annotation.StudentId;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/test")
public class TemplateController {

    @GetMapping
    public ResponseEntity<Void> createMember(@StudentId Long id) {
        String str = "test";

//        throw new BusinessException(GlobalErrorCodes.INVALID_HEADER_DATA);

        log.info(String.valueOf(id)); // 로그인 유저 ID 확인 로그
//
        return ResponseEntity.noContent().build();
    }
}
