package com.chunsun.configservice;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http
			.csrf(csrf -> csrf.disable())
			.cors(Customizer.withDefaults()) // CORS 활성화
			.authorizeHttpRequests(auth -> auth
				.requestMatchers("/actuator/**").hasRole("ADMIN")
				.requestMatchers("/encrypt", "/decrypt").authenticated()
				.anyRequest().authenticated()
			)
			.httpBasic(Customizer.withDefaults());
		return http.build();
	}
}