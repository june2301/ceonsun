import api from "../axios";

export const authAPI = {
  // 카카오 로그인 (회원가입 포함)
  kakaoLogin: (authCode) =>
    api.post("/auth-service/login", null, {
      headers: {
        "X-Chunsun-Kakao-Auth-Code": authCode,
        "Content-Type": "application/json",
      },
    }),
};
