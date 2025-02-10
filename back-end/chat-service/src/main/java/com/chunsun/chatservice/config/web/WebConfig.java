package com.chunsun.chatservice.config.web;


import java.util.List;

import lombok.RequiredArgsConstructor;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.chunsun.chatservice.config.interceptor.StudentIdArgumentResolver;
import com.chunsun.chatservice.config.interceptor.TeacherIdArgumentResolver;
import com.chunsun.chatservice.config.interceptor.UserInterceptor;

@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {
	private final UserInterceptor userInterceptor;
	private final StudentIdArgumentResolver studentIdArgumentResolver;
	private final TeacherIdArgumentResolver teacherIdArgumentResolver;

	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(userInterceptor)
			.addPathPatterns("/**");
	}

	@Override
	public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
		resolvers.add(studentIdArgumentResolver);
		resolvers.add(teacherIdArgumentResolver);
	}
}
