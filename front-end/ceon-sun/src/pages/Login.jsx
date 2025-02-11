import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import logo from "../assets/img/logo.png";
import kakao_login from "../assets/img/kakao_login.png";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { kakaoLogin } = useAuthStore();

  const KAKAO_AUTH_URL = "https://kauth.kakao.com/oauth/authorize";
  const CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID;
  const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

  const handleKakaoLoginClick = () => {
    const kakaoURL = `${KAKAO_AUTH_URL}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    window.location.href = kakaoURL;
  };

  useEffect(() => {
    // URL에서 인가 코드 추출
    const code = new URLSearchParams(location.search).get("code");

    if (code) {
      kakaoLogin(code)
        .then((result) => {
          if (result.needsSignup) {
            navigate("/signup", {
              state: { userInfo: result.userInfo, authCode: code },
              replace: true,
            });
          } else {
            navigate("/mainpage", { replace: true });
          }
        })
        .catch((error) => {
          console.error("로그인 처리 중 오류 발생:", error);
        });
    }
  }, [location, navigate, kakaoLogin]);

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
            onClick={handleKakaoLoginClick}
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
};

export default Login;
