import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import useWebSocketStore from "../stores/websocketStore";
import logo from "../assets/img/logo.png";
import kakao_login from "../assets/img/kakao_login.png";
import loginBg from "../assets/img/login.png"; // 배경 이미지 import
import {
  connectNotification,
  checkUnreadNotifications,
} from "../api/services/notification";
import * as jwt_decode from "jwt-decode";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { kakaoLogin } = useAuthStore();

  // WebSocket 연결만 담당 (메인 페이지에서 구독)
  const connectWebSocket = useWebSocketStore((state) => state.connect);

  const KAKAO_AUTH_URL = "https://kauth.kakao.com/oauth/authorize";
  const CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID;
  const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

  // 카카오 로그인 버튼 클릭
  const handleKakaoLoginClick = () => {
    const kakaoURL = `${KAKAO_AUTH_URL}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    window.location.href = kakaoURL;
  };

  // 로그인 후 콜백 처리
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    const returnUrl = params.get("returnUrl");

    if (code) {
      kakaoLogin(code)
        .then(async (result) => {
          // 1) 회원가입이 필요한 경우 → /signup
          if (result.needsSignup) {
            navigate("/signup", {
              state: { userInfo: result.userInfo, authCode: code },
              replace: true,
            });
          } else {
            // 2) 이미 회원가입 완료된 사용자
            //    소켓 연결 + 알림 설정 + mainpage로 이동
            useWebSocketStore.getState().connect();

            // 알림 로직
            const token = result.token.startsWith("Bearer ")
              ? result.token.slice(7)
              : result.token;
            const decoded = jwt_decode.jwtDecode(token);

            connectNotification(decoded.sub);
            await checkUnreadNotifications(decoded.sub);

            navigate(returnUrl || "/mainpage", { replace: true });
          }
        })
        .catch((error) => {
          console.error("로그인 처리 중 오류 발생:", error);
          alert("로그인에 실패했습니다. 다시 시도해주세요.");
        });
    }
  }, [location, navigate, kakaoLogin, connectWebSocket]);

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-gray-100 relative"
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* 배경 오버레이 (선택사항: 배경을 어둡게 하여 로그인 창을 더 잘 보이게 함) */}
      <div className="absolute inset-0 bg-black bg-opacity-5"></div>

      {/* 로그인 창 */}
      <div className="w-[480px] h-[360px] bg-white rounded-lg shadow-md p-8 flex flex-col justify-around relative z-10">
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
