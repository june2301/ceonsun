# 1. Node.js 환경에서 React 빌드
FROM node:18 AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# 2. EC2의 Nginx 정적 파일 디렉토리로 복사하기 위한 아티팩트 준비
CMD ["cp", "-r", "/app/build", "/home/ubuntu/nginx/html"]