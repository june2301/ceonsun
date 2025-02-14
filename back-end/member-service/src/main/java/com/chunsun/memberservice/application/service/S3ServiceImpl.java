package com.chunsun.memberservice.application.service;

import java.io.IOException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class S3ServiceImpl implements S3Service {

	private final AmazonS3 amazonS3;

	@Value("${spring.cloud.aws.s3.bucket}")
	private String bucket;

	public String uploadImage(MultipartFile image) throws IOException {
		String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename(); // 고유한 파일 이름 생성

		// 메타데이터 설정
		ObjectMetadata metadata = new ObjectMetadata();
		metadata.setContentType(image.getContentType());
		metadata.setContentLength(image.getSize());

		// S3에 파일 업로드 요청 생성
		PutObjectRequest putObjectRequest = new PutObjectRequest(bucket, fileName, image.getInputStream(), metadata);

		// S3에 파일 업로드
		amazonS3.putObject(putObjectRequest);

		return getPublicUrl(fileName);
	}

	@Override
	public String deleteImage(String imageURL) {

		String objectKey = imageURL.replace(
			String.format("https://%s.s3.%s.amazonaws.com/", bucket, amazonS3.getRegionName()), ""
		);

		amazonS3.deleteObject(bucket, objectKey);
		return imageURL;
	}

	private String getPublicUrl(String fileName) {
		return String.format("https://%s.s3.%s.amazonaws.com/%s", bucket, amazonS3.getRegionName(), fileName);
	}
}