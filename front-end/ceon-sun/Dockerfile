# 1. Node 이미지 사용
FROM node:20 AS build  # Node 18이 아닌 20으로 변경

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 전체 프로젝트 복사
COPY . .

# 4. 의존성 설치
RUN npm install

# 5. 빌드 실행
RUN npm run build

# 2. EC2의 Nginx 정적 파일 디렉토리로 복사하기 위한 아티팩트 준비
CMD ["cp", "-r", "/app/build", "/home/ubuntu/nginx/html"]