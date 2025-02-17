import React, { useState } from "react";
import defaultProfileImg from "@/assets/img/default-profile.png";
import { memberAPI } from "../api/services/member";
import { authAPI } from "../api/services/auth";
import useAuthStore from "../stores/authStore";

function UpdateProfile({ userInfo, onSave }) {
  const { user, setAuth } = useAuthStore();
  const [formData, setFormData] = useState({
    nickname: userInfo.nickname || "",
    profileImage: userInfo.profileImage || null,
  });
  const [nicknameChecked, setNicknameChecked] = useState(false);

  const handleNicknameChange = (e) => {
    const newNickname = e.target.value;
    setFormData({ ...formData, nickname: newNickname });
    // 현재 사용자의 닉네임과 동일하면 중복체크 통과
    if (newNickname === user.nickname) {
      setNicknameChecked(true);
    } else {
      setNicknameChecked(false);
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profileImage: file });
  };

  const handleResetProfileImage = () => {
    // profileImage를 null로 설정하여 기본 이미지가 표시되도록 함
    setFormData({ ...formData, profileImage: null });

    // 파일 input 초기화
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleDuplicateCheck = async () => {
    if (!formData.nickname.trim()) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    // 현재 사용자의 닉네임과 동일한 경우
    if (formData.nickname === user.nickname) {
      setNicknameChecked(true);
      alert("사용 가능한 닉네임입니다.");
      return;
    }

    try {
      const isAvailable = await memberAPI.checkNickname(formData.nickname);
      if (isAvailable) {
        setNicknameChecked(true);
        alert("사용 가능한 닉네임입니다.");
      } else {
        setNicknameChecked(false);
        alert("이미 사용 중인 닉네임입니다.");
      }
    } catch (error) {
      console.error("닉네임 중복 체크 중 오류 발생:", error);
      setNicknameChecked(false);
      alert("닉네임 중복 체크 중 오류가 발생했습니다.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nicknameChecked) {
      alert("닉네임 중복체크를 해주세요.");
      return;
    }

    try {
      // FormData 객체 생성
      const formDataToSend = new FormData();
      formDataToSend.append("nickname", formData.nickname);

      // 프로필 이미지가 File 객체인 경우에만 추가
      if (formData.profileImage instanceof File) {
        formDataToSend.append(
          "profileImage",
          formData.profileImage,
          formData.profileImage.name,
        );
      }

      await memberAPI.updateProfile(user.userId, formDataToSend);

      // 2. 토큰 재발급 요청 및 store 업데이트
      const { token } = await authAPI.changeRole();
      if (token) {
        setAuth(token);
      }

      // 3. 부모 컴포넌트에 알림
      onSave(formData);

      alert("프로필이 성공적으로 수정되었습니다.");
    } catch (error) {
      console.error("프로필 수정 실패:", error);
      alert("프로필 수정에 실패했습니다.");
    }
  };

  // 프로필사진 미리보기 처리:
  // 파일 객체(File)이면 URL.createObjectURL, 문자열이면 그대로 사용,
  // 둘 다 없으면 기본 이미지 사용
  let previewImage;
  if (formData.profileImage instanceof File) {
    previewImage = URL.createObjectURL(formData.profileImage);
  } else if (formData.profileImage) {
    previewImage = formData.profileImage;
  } else {
    previewImage = defaultProfileImg;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4 ml-2">
        <label className="block text-gray-700 font-bold mb-2">
          프로필 사진
        </label>
        <div className="flex items-center ml-2">
          <img
            src={previewImage}
            alt="Profile Preview"
            className="w-24 h-24 border border-gray-300 rounded-md mr-4 object-cover"
          />
          <div className="flex flex-col gap-2">
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="hidden"
                id="profileImageInput"
              />
              <label
                htmlFor="profileImageInput"
                className="w-24 h-[28px] flex items-center justify-center bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition text-sm cursor-pointer px-1"
              >
                이미지 선택
              </label>
            </div>
            <button
              type="button"
              onClick={handleResetProfileImage}
              className="w-24 h-[28px] flex items-center justify-center bg-gray-500 text-white rounded shadow hover:bg-gray-600 transition text-sm"
            >
              초기화
            </button>
          </div>
        </div>
      </div>
      <div className="mb-4 ml-2">
        <label className="block text-gray-700 font-bold mb-2">닉네임</label>
        <div className="flex items-center ml-2">
          <input
            type="text"
            name="nickname"
            value={formData.nickname}
            onChange={handleNicknameChange}
            className="w-[200px] p-2 border border-gray-300 rounded"
          />
          <button
            type="button"
            onClick={handleDuplicateCheck}
            className="ml-2 px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600 transition"
          >
            중복체크
          </button>
        </div>
        {nicknameChecked && (
          <p className="mt-1 text-sm text-green-600 ml-3">
            사용 가능한 닉네임입니다.
          </p>
        )}
      </div>
      <div className="flex flex-col mt-6">
        <div className="flex justify-end mb-2">
          <button
            type="submit"
            className="mr-2 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
          >
            저장하기
          </button>
        </div>
        <hr className="border-t-2 border-gray-300" />
      </div>
    </form>
  );
}

export default UpdateProfile;
