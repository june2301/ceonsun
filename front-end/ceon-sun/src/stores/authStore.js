import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { authAPI } from "../api/services/auth";
import * as jwt_decode from "jwt-decode";

// (중요) websocketStore 불러오기
import useWebSocketStore from "./websocketStore";

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
          sessionStorage.setItem("token", token);

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
        // 1) 세션 스토리지에서 토큰 제거
        sessionStorage.removeItem("token");

        // 2) WebSocket 구독/연결 해제
        //    (websocketStore의 disconnect() 호출)
        useWebSocketStore.getState().disconnect();

        // 3) 상태 리셋
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

      // 토큰 갱신 처리
      updateToken: (token) => {
        if (!token) return;

        try {
          const pureToken = token.startsWith("Bearer ")
            ? token.slice(7)
            : token;

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
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export default useAuthStore;
