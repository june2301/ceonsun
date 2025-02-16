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
    setFormData({ ...formData, nickname: e.target.value });
    setNicknameChecked(false);
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profileImage: file });
  };

  const handleDuplicateCheck = async () => {
    if (!formData.nickname.trim()) {
      alert("닉네임을 입력해주세요.");
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
      await memberAPI.updateProfile(user.userId, {
        nickname: formData.nickname,
        profileImage: formData.profileImage,
      });

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
          <input
            type="file"
            accept="image/*"
            onChange={handleProfileImageChange}
            className="text-gray-700"
          />
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
