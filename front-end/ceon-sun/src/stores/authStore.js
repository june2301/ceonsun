import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { authAPI } from "../api/services/auth";
import * as jwt_decode from "jwt-decode";

const useAuthStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      token: null,
      user: {
        userId: null,
        nickname: null,
        role: null,
      },

      setAuth: (token) => {
        if (!token) return;

        try {
          const pureToken = token.startsWith("Bearer ")
            ? token.slice(7)
            : token;
          localStorage.setItem("token", token);

          const decoded = jwt_decode.jwtDecode(pureToken);

          set({
            isAuthenticated: true,
            token,
            user: {
              userId: decoded.sub,
              nickname: decoded.nickname,
              role: decoded.role,
            },
          });
        } catch (error) {
          console.error("JWT 디코딩 에러:", error);
        }
      },

      kakaoLogin: async (code) => {
        try {
          const result = await authAPI.kakaoLogin(code);
          if (result.token) {
            console.log("kakaoLogin 호출됨, result:", result);
            get().setAuth(result.token); // 받은 토큰을 setAuth에 넘김
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
    }),
    {
      name: "auth-storage", // localStorage에 저장될 키 이름
      storage: createJSONStorage(() => localStorage), // 스토리지 엔진 설정
    },
  ),
);

export default useAuthStore;
