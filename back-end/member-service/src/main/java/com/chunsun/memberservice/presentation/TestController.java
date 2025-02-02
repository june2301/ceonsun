package com.chunsun.memberservice.presentation;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
        @GetMapping
        public String test() {
            return "member-service";
        }

        @GetMapping("members")
        public String test2() {
            return "members";
        }
}
