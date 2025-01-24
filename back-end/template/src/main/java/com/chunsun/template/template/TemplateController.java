package com.chunsun.template.template;

import com.chunsun.template.common.error.GlobalErrorCodes;
import com.chunsun.template.common.exception.BusinessException;
import com.chunsun.template.common.response.ResponseDto;
import com.chunsun.template.header.annotation.StudentId;
import com.chunsun.template.header.annotation.TeacherId;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
