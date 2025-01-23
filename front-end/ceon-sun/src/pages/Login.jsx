import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/img/logo.png";
import kakao_login from "../assets/img/kakao_login.png";

function Login() {
  const navigate = useNavigate();
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!window.Kakao) {
      const script = document.createElement("script");
      script.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js";
      script.integrity =
        "sha384-DKYJZ8NLiK8MN4/C5P2dtSmLQ4KwPaoqAfyA/DfmEc1VDxu4yyC7wy6K1Hs90nka";
      script.crossOrigin = "anonymous";
      script.onload = () => {
        window.Kakao.init("c089c8172def97eb00c07217cae17495");
        displayToken();
      };
      document.head.appendChild(script);
    } else {
      displayToken();
    }
  }, []);

  const loginWithKakao = () => {
    if (!window.Kakao) return;

    window.Kakao.Auth.authorize({
      redirectUri: "https://developers.kakao.com/tool/demo/oauth",
    });
  };

  // 토큰이 있으면 로그인 상태로 간주하고, 필요시 회원정보 페이지로 이동
  // (실제로는 백엔드 검증 후 이동하는 방식 등을 구현)
  const displayToken = () => {
    const existingToken = getCookie("authorize-access-token");
    if (existingToken) {
      window.Kakao.Auth.setAccessToken(existingToken);
      window.Kakao.Auth.getStatusInfo()
        .then((res) => {
          if (res.status === "connected") {
            const _token = window.Kakao.Auth.getAccessToken();
            setToken(_token);
            // 로그인 성공시 페이지 이동
            // 추가 정보 입력X -> 추가 정보 입력 페이지
            // 추가 정보 입력O -> 메인페이지지
            navigate("/SignUp");
          }
        })
        .catch((err) => {
          console.error(err);
          window.Kakao.Auth.setAccessToken(null);
        });
    }
  };

  const getCookie = (name) => {
    const parts = document.cookie.split(name + "=");
    if (parts.length === 2) return parts[1].split(";")[0];
    return "";
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#ccc", // 추후 이미지로 교체
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* 로그인 박스 */}
      <div
        style={{
          width: "400px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "40px 30px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <img
          src={logo}
          alt="ChunSun Logo"
          style={{ width: "150px", marginBottom: "20px" }}
        />
        <p style={{ marginBottom: "50px", fontSize: "18px" }}>
          개발자를 위한 과외 커넥팅 플랫폼
        </p>

        {/* 카카오 로그인 버튼 */}
        <button
          onClick={loginWithKakao}
          style={{
            border: "none",
            background: "none",
            padding: 0,
            cursor: "pointer",
          }}
        >
          <img src={kakao_login} alt="카카오 로그인 버튼" width="300" />
        </button>

        {/* 토큰 상태 표시 (데모용) */}
        {token && (
          <p style={{ marginTop: "20px" }}>
            로그인 성공, 토큰: <b>{token}</b>
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;
