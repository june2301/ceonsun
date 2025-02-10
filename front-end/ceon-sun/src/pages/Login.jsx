import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import logo from "../assets/img/logo.png";
import kakao_login from "../assets/img/kakao_login.png";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleKakaoLogin } = useAuthStore();

  // 1. 카카오 로그인 버튼 클릭 시 카카오 인증 페이지로 이동
  const loginWithKakao = () => {
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${
      import.meta.env.VITE_KAKAO_CLIENT_ID
    }&redirect_uri=${
      import.meta.env.VITE_KAKAO_REDIRECT_URI
    }&response_type=code`;
    window.location.href = KAKAO_AUTH_URL;
  };

  // 3, 4. 리다이렉트 시 인가 코드를 받아서 백엔드 API 호출
  useEffect(() => {
    const code = new URLSearchParams(location.search).get("code");

    if (code) {
      const processLogin = async () => {
        try {
          const result = await handleKakaoLogin(code);
          if (result.needsSignup) {
            navigate("/signup");
          } else {
            navigate("/");
          }
        } catch (error) {
          console.error("Login failed:", error);
        }
      };

      processLogin();
    }
  }, [location, handleKakaoLogin, navigate]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
      <div className="w-[480px] h-[360px] bg-white rounded-lg shadow-md p-8 flex flex-col justify-around">
        <div className="flex flex-col items-center">
          <img src={logo} alt="ChunSun Logo" className="w-[150px] mb-6" />
          <p className="text-lg text-gray-700 font-bold">
            "개발자를 위한 과외 커넥팅 플랫폼"
          </p>
        </div>
        <div className="w-full flex justify-center">
          <button
            onClick={loginWithKakao}
            className="w-[90%] border-none bg-transparent p-0 cursor-pointer"
          >
            <img
              src={kakao_login}
              alt="카카오 로그인"
              className="w-full cursor-pointer"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
