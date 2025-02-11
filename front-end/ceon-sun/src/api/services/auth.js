import api from "../axios";

export const authAPI = {
  // 카카오 인가코드로 로그인/회원가입 처리
  kakaoLogin: async (authCode) => {
    try {
      console.log("인가코드:", authCode);

      const response = await api.post("/auth-service/login", {
        authCode: authCode,
      });

      console.log("서버 응답:", response);

      if (response.status === 202) {
        return {
          needsSignup: true,
          token: response.headers["x-chunsun-authorization"],
          userInfo: response.data,
        };
      } else if (response.status === 204) {
        return {
          needsSignup: false,
          token: response.headers["x-chunsun-authorization"],
        };
      }

      console.log("예상치 못한 응답 상태:", response.status);
      throw new Error("예상치 못한 응답");
    } catch (error) {
      console.error("카카오 로그인 API 에러:", error);
      if (error.response) {
        console.error("에러 상세:", {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });
      }
      throw error;
    }
  },

  // 카카오 로그인 응답 처리만 담당
  handleKakaoResponse: (response) => {
    const token = response.headers["x-chunsun-authorization"];
    if (response.status === 202) {
      // 회원가입 필요
      return {
        needsSignup: true,
        userInfo: response.data,
        token,
      };
    } else if (response.status === 204) {
      // 로그인 성공
      return {
        needsSignup: false,
        token,
      };
    }
    throw new Error("Unexpected response");
  },
};
