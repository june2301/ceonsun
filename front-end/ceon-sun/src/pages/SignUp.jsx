import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { memberAPI } from "../api/services/member";
import logo from "../assets/img/logo.png"; // 로고 이미지 import
import useAuthStore from "../stores/authStore";

const KAKAO_AUTH_URL = "https://kauth.kakao.com/oauth/authorize";
const CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = location.state || {};
  const [error, setError] = useState("");
  const [nicknameChecked, setNicknameChecked] = useState(false);

  const { user, updateUser } = useAuthStore();

  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    birthdate: "",
    gender: "",
  });

  // 컴포넌트 마운트 시 정보 확인
  useEffect(() => {
    console.log("SignUp 페이지 접근 시 user 정보:", user);
  }, [user, location.state, userInfo]);

  // userInfo가 없는 경우 로그인 페이지로 리다이렉트
  if (!userInfo) {
    navigate("/");
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "birthdate") {
      // 숫자만 입력 가능하도록
      const numbersOnly = value.replace(/\D/g, "");
      if (numbersOnly.length <= 8) {
        setFormData({
          ...formData,
          [name]: numbersOnly,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
      // 닉네임이 변경되면 중복체크 상태 초기화
      if (name === "nickname") {
        setNicknameChecked(false);
      }
    }
  };

  const handleNicknameCheck = async () => {
    if (!formData.nickname.trim()) {
      setError("닉네임을 입력해주세요.");
      return;
    }

    try {
      const isAvailable = await memberAPI.checkNickname(formData.nickname);
      if (isAvailable) {
        setNicknameChecked(true);
        setError("사용 가능한 닉네임입니다.");
      } else {
        setNicknameChecked(false);
        setError("이미 사용 중인 닉네임입니다.");
      }
    } catch (error) {
      console.error("닉네임 중복 체크 실패:", error);
      setNicknameChecked(false);
      setError("닉네임 중복 체크 중 오류가 발생했습니다.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nicknameChecked) {
      setError("닉네임 중복 체크를 해주세요.");
      return;
    }
    try {
      // birthdate 형식 변환 (YYYYMMDD -> YYYY-MM-DD)
      let birthdateFormatted = formData.birthdate;
      if (/^\d{8}$/.test(birthdateFormatted)) {
        const year = birthdateFormatted.slice(0, 4);
        const month = birthdateFormatted.slice(4, 6);
        const day = birthdateFormatted.slice(6, 8);
        birthdateFormatted = `${year}-${month}-${day}`;
      }

      // userInfo에서 role을 제외한 나머지 정보만 추출
      const { role, ...userInfoWithoutRole } = userInfo;

      const signupData = {
        ...userInfoWithoutRole,
        ...formData,
        birthdate: birthdateFormatted,
      };

      console.log("회원가입 시도:", {
        formData: formData,
        userInfoWithoutRole: userInfoWithoutRole,
        signupData: signupData,
      });

      console.log("회원가입 시도 시 user 정보:", {
        userId: user.userId,
        nickname: formData.nickname,
        role: user.role,
      });

      const response = await memberAPI.completeSignup(signupData);

      console.log("회원가입 성공 응답:", response);

      // 카카오 로그인 버튼 클릭 시와 동일한 로직을 실행하여 OAuth 흐름을 재시작합니다.
      const kakaoURL = `${KAKAO_AUTH_URL}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
      window.location.href = kakaoURL; // → 사용자가 카카오 로그인 페이지에서 새 인가코드를 받아오면, Login 컴포넌트의 useEffect가 실행되어 API 호출을 진행합니다.
    } catch (error) {
      console.error("회원가입 실패:", error);
      setError("회원가입에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
      <div className="w-[400px] bg-white rounded-lg shadow-md p-8">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="ChunSun Logo" className="w-[150px]" />
          <p className="text-lg text-gray-700 mt-4 font-bold">추가 정보 입력</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              이름
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="nickname"
              className="block text-sm font-medium text-gray-700"
            >
              닉네임
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                id="nickname"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                required
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleNicknameCheck}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                중복체크
              </button>
            </div>
            {error && (
              <p
                className={`text-sm mt-1 ${
                  error.includes("사용 가능")
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {error}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="birthdate"
              className="block text-sm font-medium text-gray-700"
            >
              생년월일 (YYYYMMDD)
            </label>
            <input
              type="text"
              id="birthdate"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              placeholder="YYYYMMDD"
              maxLength="8"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              성별
            </label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="MALE"
                  checked={formData.gender === "MALE"}
                  onChange={handleChange}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2">남자</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="FEMALE"
                  checked={formData.gender === "FEMALE"}
                  onChange={handleChange}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2">여자</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            가입하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
