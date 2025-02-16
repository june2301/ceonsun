import axios from "axios";
import { authAPI } from "./services/auth";
import useAuthStore from "../stores/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 크로스 도메인 요청시 쿠키 전송 허용
});

// 토큰 재발급 중인지 확인하는 플래그
let isTokenRefreshing = false;
// 토큰 재발급 대기중인 요청들을 저장하는 배열
let refreshSubscribers = [];

// 토큰 재발급 후 대기중인 요청들을 처리하는 함수
const onTokenRefreshed = (token) => {
  refreshSubscribers.map((callback) => callback(token));
  refreshSubscribers = [];
};

// 재발급 대기열에 추가하는 함수
const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    console.log("Request:", config);
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  },
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    console.log("Response:", response);
    return response;
  },
  async (error) => {
    console.error("Response Error:", error);
    const originalRequest = error.config;

    // 토큰 만료 에러 (401) && 재시도하지 않은 요청 && 토큰이 존재하는 경우에만 재발급 시도
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      sessionStorage.getItem("token")
    ) {
      originalRequest._retry = true;

      if (!isTokenRefreshing) {
        isTokenRefreshing = true;

        try {
          const response = await authAPI.refresh();
          const newToken = response.token;

          // AuthStore 업데이트 추가
          useAuthStore.getState().setAuth(newToken);

          // 세션 스토리지에 새 토큰 저장
          sessionStorage.setItem("token", newToken);
          api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

          onTokenRefreshed(newToken);
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // 토큰 재발급 실패 처리
          sessionStorage.removeItem("token");
          useAuthStore.getState().logout(); // AuthStore 상태도 초기화

          // 사용자에게 알림
          alert("로그인이 만료되었습니다. 다시 로그인해주세요.");

          // 현재 URL을 state로 전달하여 로그인 후 복귀 가능하도록 함
          const returnUrl = window.location.pathname;
          window.location.href = `/?returnUrl=${encodeURIComponent(returnUrl)}`;

          return Promise.reject(refreshError);
        } finally {
          isTokenRefreshing = false;
        }
      } else {
        return new Promise((resolve) => {
          addRefreshSubscriber((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }
    }

    return Promise.reject(error);
  },
);

export default api;
