import { create } from "zustand";
import { authAPI } from "../api/services/auth";
import * as jwt_decode from "jwt-decode";

const useAuthStore = create((set, get) => ({
  // 상태
  isAuthenticated: false,
  token: null,
  user: {
    userId: null,
    nickname: null,
    role: null,
  },

  // 액션
  setAuth: (token) => {
    if (!token) return;

    try {
      const pureToken = token.startsWith("Bearer ") ? token.slice(7) : token;
      // 로컬 스토리지에 토큰 저장
      localStorage.setItem("token", token);

      // jwt_decode.default 대신 jwt_decode.jwtDecode 사용
      const decoded = jwt_decode.jwtDecode(pureToken);
      console.log("토큰 디코딩 결과:", decoded);

      set({
        isAuthenticated: true,
        token,
        user: {
          userId: decoded.sub,
          nickname: decoded.nickname,
          role: decoded.role,
        },
      });

      console.log("저장된 user 정보:", {
        userId: decoded.sub,
        nickname: decoded.nickname,
        role: decoded.role,
      });
    } catch (error) {
      console.error("JWT 디코딩 에러:", error);
    }
  },

  kakaoLogin: async (code) => {
    try {
      const result = await authAPI.kakaoLogin(code);
      if (result.token) {
        // 로그인 성공 시 토큰을 setAuth로 넘겨서 디코딩 & store 저장
        console.log("kakaoLogin 호출됨, result:", result);
        get().setAuth(result.token);
      }
      return result;
    } catch (error) {
      console.error("카카오 로그인 에러:", error);
      throw error;
    }
  },

  updateUser: (updatedFields) => {
    set((state) => ({
      user: { ...state.user, ...updatedFields },
    }));
  },

  logout: () => {
    localStorage.removeItem("token");

    set({
      isAuthenticated: false,
      token: null,
      user: {
        userId: null,
        nickname: null,
        role: null,
      },
    });
  },
}));

export default useAuthStore;
