import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import { authAPI } from "../api/services/auth";
import logo from "../assets/img/logo.png"; // 로고 이미지 import

const SignUp = () => {
  const navigate = useNavigate();
  const { kakaoUserInfo } = useAuthStore();
  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    birthdate: "",
    gender: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("Current kakaoUserInfo:", kakaoUserInfo);
  }, [kakaoUserInfo]);

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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // YYYYMMDD를 YYYY-MM-DD로 변환
      const birthdate = formData.birthdate;
      if (birthdate.length !== 8) {
        setError("생년월일은 8자리로 입력해주세요. (YYYYMMDD)");
        return;
      }

      const formattedBirthdate = `${birthdate.slice(0, 4)}-${birthdate.slice(
        4,
        6,
      )}-${birthdate.slice(6, 8)}`;

      // 변환된 날짜 유효성 검사
      const birthdateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
      if (!birthdateRegex.test(formattedBirthdate)) {
        setError("올바르지 않은 생년월일입니다.");
        return;
      }

      if (!formData.gender) {
        setError("성별을 선택해주세요.");
        return;
      }

      const signupData = {
        kakaoId: kakaoUserInfo?.kakaoId || "test_kakao_id",
        email: kakaoUserInfo?.email || "test@email.com",
        name: formData.name,
        nickname: formData.nickname,
        birthdate: formattedBirthdate,
        gender: formData.gender,
      };

      console.log("Sending signup data:", signupData);

      const response = await authAPI.signup(signupData);
      console.log("Signup response:", response);

      if (response.data.message === "가입 완료") {
        console.log("회원가입 성공, 메인 페이지로 이동");
        navigate("/");
      }
    } catch (error) {
      console.error("Signup failed:", error);
      setError("회원가입 중 오류가 발생했습니다.");
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
            <input
              type="text"
              id="nickname"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

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
