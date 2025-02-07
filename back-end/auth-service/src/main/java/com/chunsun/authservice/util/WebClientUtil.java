package com.chunsun.authservice.util;

import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.core.publisher.Mono;

public class WebClientUtil {
	private final WebClient webClient;

	public WebClientUtil(String baseUrl) {
		this.webClient = WebClient.builder()
			.baseUrl(baseUrl)
			.build();
	}

	/**
	 * form data를 이용하여 POST 요청을 보내는 메서드
	 *
	 * @param uri         요청 URI (baseUrl 이후의 경로)
	 * @param formData    요청에 포함시킬 폼 데이터 (Map<String, String>)
	 * @param responseType 응답을 변환할 클래스 타입
	 * @param <T>         응답 타입
	 * @return Mono<T> 형태의 비동기 응답
	 */
	public <T> Mono<T> postFormData(String uri, Map<String, String> formData, Class<T> responseType) {
		MultiValueMap<String, String> multiValueMap = new LinkedMultiValueMap<>();
		multiValueMap.setAll(formData);

		return webClient.post()
			.uri(uri)
			.contentType(MediaType.APPLICATION_FORM_URLENCODED)
			.body(BodyInserters.fromFormData(multiValueMap))
			.retrieve()
			.bodyToMono(responseType);
	}

	/**
	 * GET 요청 (Authorization 헤더 포함)
	 */
	public <T> Mono<T> getWithAuth(String uri, String accessToken, Class<T> responseType) {
		return webClient.get()
			.uri(uri)
			.header("Authorization", "Bearer " + accessToken)
			.retrieve()
			.bodyToMono(responseType);
	}
}
