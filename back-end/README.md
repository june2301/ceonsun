```bash
# docker-compose 실행
docker-compose up -d
```

```bash
# docker-compose 삭제
docker-compose down -v
```

```bash
# 터미널에서 mysql 접속
# workbench 에서 접속 하는 경우 필요 없음

# 실행
docker exec -it chunsun-db bash

# 터미널에서 접속
mysql -u root -p

# 비밀번호 입력
1234
```