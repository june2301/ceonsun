import { create } from "zustand";
import { authAPI } from "../api/services/auth";
import { jwtDecode } from "jwt-decode";

const useAuthStore = create((set) => ({
  // 상태
  isAuthenticated: false,
  token: null,
  user: {
    role: null,
    kakaoId: null,
    nickname: null,
    email: null,
  },

  // 액션
  setUser: (userData) =>
    set({
      user: userData,
    }),

  setAuth: (token) => {
    // JWT 토큰 디코딩
    const decodedToken = jwtDecode(token);

    set({
      isAuthenticated: true,
      token,
      user: {
        role: decodedToken.role,
        nickname: decodedToken.nickname,
        // JWT에 포함된 다른 정보들도 필요하다면 추가
      },
    });
  },

  logout: () =>
    set({
      isAuthenticated: false,
      token: null,
      user: {
        role: null,
        kakaoId: null,
        nickname: null,
        email: null,
      },
    }),

  // 로그인 처리 액션
  handleKakaoLogin: async (authCode) => {
    try {
      const response = await authAPI.kakaoLogin(authCode);

      // 202: 회원 미존재, 회원가입 필요
      if (response.status === 202) {
        const userInfo = {
          role: response.data.role,
          kakaoId: response.data.kakaoId,
          nickname: response.data.nickname,
          email: response.data.email,
        };

        set({
          user: userInfo,
          isAuthenticated: false,
        });
        return { needsSignup: true };
      }

      // 204: 회원 존재, 로그인 성공
      if (response.status === 204) {
        const token = response.headers["x-chunsun-authorization"];
        const decodedToken = jwtDecode(token);

        set({
          isAuthenticated: true,
          token,
          user: {
            role: decodedToken.role,
            nickname: decodedToken.nickname,
            // JWT에 포함된 다른 정보들도 필요하다면 추가
          },
        });
        return { needsSignup: false };
      }

      return { needsSignup: true };
    } catch (error) {
      console.error("Kakao login error:", error);
      throw error;
    }
  },
}));

export default useAuthStore;
