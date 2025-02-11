# 1. Node 이미지 사용
FROM node:20 AS build

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 전체 프로젝트 복사
COPY . .

# 4. 의존성 설치
RUN npm install

# 5. React 빌드 실행
RUN npm run build

# 6. 빌드된 파일을 직접 복사
RUN mkdir -p /home/ubuntu/nginx/html && cp -r /app/dist/* /home/ubuntu/nginx/html/

# 7. 최종 컨테이너 실행 시 실행할 명령어 제거
CMD [ "echo", "Build complete" ]
