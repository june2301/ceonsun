import React, { useState } from "react";
import defaultProfileImg from "@/assets/img/default-profile.png";

function UpdateProfile({ profileImage, nickname, onSave }) {
  // 프로필사진과 닉네임만 수정합니다.
  const [formData, setFormData] = useState({
    nickname: nickname || "",
    profileImage: profileImage || null,
  });
  const [nicknameChecked, setNicknameChecked] = useState(false);

  const handleNicknameChange = (e) => {
    setFormData({ ...formData, nickname: e.target.value });
    setNicknameChecked(false); // 입력 변경 시 중복체크 초기화
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profileImage: file });
  };

  // 중복체크 버튼 클릭 (추후 백엔드 연동 시 API 호출로 대체)
  const handleDuplicateCheck = () => {
    // 임시로 항상 사용 가능하다고 처리
    setNicknameChecked(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nicknameChecked) {
      alert("닉네임 중복체크를 해주세요.");
      return;
    }
    onSave(formData);
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
      {/* 수정 컴포넌트 하단: 가로선과 우측의 저장하기 버튼 */}
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
