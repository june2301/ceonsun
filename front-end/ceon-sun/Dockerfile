# 1. Node.js를 사용하여 프론트엔드 애플리케이션 빌드
FROM node:20 AS build

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 전체 프로젝트 복사
COPY . .

# 4. 의존성 설치
RUN npm install

# 5. 빌드 실행
RUN npm run build

# 6. Nginx 이미지를 기반으로 컨테이너 실행
FROM nginx:latest

# 7. Nginx 설정 파일을 복사 (필요시 수정)
# COPY nginx.conf /etc/nginx/nginx.conf

# 8. 빌드된 정적 파일을 Nginx의 기본 정적 파일 디렉토리로 복사
# COPY --from=build /app/dist /usr/share/nginx/html

# 9. 컨테이너 실행 (기본적으로 Nginx 실행)
# EXPOSE 80
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
