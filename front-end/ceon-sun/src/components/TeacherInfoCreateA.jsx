import React, { useState } from "react";
import DefaultProfile from "./DefaultProfile";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

function TeacherInfoCreateA({
  name,
  nickname,
  age,
  birthdate,
  gender,
  profileImage,
  // 업데이트 모드 여부
  updateMode = false,
  // 업데이트 모드일 때 초기 데이터
  introduction: initialIntroduction = "",
  experience: initialExperience = "",
  contactPublic: initialContactPublic = true,
  // 업데이트 모드에서 뒤로가기 처리용
  onClose,
  // 업데이트 모드에서 수정 완료 처리용
  onUpdate,
}) {
  // 문의 연락: true = 허용, false = 거부 (기본값은 허용)
  const [contactPublic, setContactPublic] = useState(initialContactPublic);
  const [introduction, setIntroduction] = useState(initialIntroduction);
  const [experience, setExperience] = useState(initialExperience);
  const [showTooltip, setShowTooltip] = useState(false);

  // 작성 모드 제출 함수
  const handleSubmit = (e) => {
    e.preventDefault();
    const teacherInfoData = {
      contactPublic,
      introduction,
      experience,
    };
    console.log("Teacher Info Data (작성):", teacherInfoData);
    // TODO: 입력 데이터를 백엔드로 전송하는 로직 추가
  };

  // 업데이트 모드 제출 함수
  const handleUpdate = (e) => {
    e.preventDefault();
    const teacherInfoData = {
      contactPublic,
      introduction,
      experience,
    };
    console.log("Teacher Info Data (수정):", teacherInfoData);
    if (onUpdate) onUpdate(teacherInfoData);
  };

  return (
    <form
      onSubmit={updateMode ? handleUpdate : handleSubmit}
      className="bg-white p-2"
    >
      {/* 상단에 DefaultProfile */}
      <div className="mb-5">
        <DefaultProfile
          name={name}
          nickname={nickname}
          age={age}
          birthdate={birthdate}
          gender={gender}
          profileImage={profileImage}
          isLarge={false}
        />
      </div>

      {/* DefaultProfile 아래 가로선 */}
      <hr className="mb-5 border-t border-gray-300" />

      {/* 1. 문의 연락 허용/거부 선택 */}
      <div className="mx-2 mb-8 flex items-center">
        {/* 왼쪽: 제목과 정보 아이콘 */}
        <div className="flex items-center justify-start">
          <label className="text-gray-700 font-bold mr-2">문의 연락</label>
          <div
            className="relative cursor-pointer"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <InformationCircleIcon className="w-5 h-5 text-gray-400" />
            {showTooltip && (
              <div className="absolute bottom-full left-0 mb-2 w-[280px] p-3 bg-white border border-gray-300 rounded shadow-lg text-xs text-gray-700 z-20">
                문의 연락을 허용하면 학생이 선생님께 연락할 수 있습니다.
              </div>
            )}
          </div>
        </div>

        {/* 오른쪽: 허용/거부 버튼 */}
        <div className="flex flex-1 justify-evenly">
          <button
            type="button"
            onClick={() => setContactPublic(true)}
            className="flex items-center space-x-2"
          >
            <span
              className={`w-4 h-4 rounded-full border-2 ${
                contactPublic
                  ? "bg-blue-500 border-blue-500"
                  : "border-gray-400"
              }`}
            ></span>
            <span>허용</span>
          </button>
          <button
            type="button"
            onClick={() => setContactPublic(false)}
            className="flex items-center space-x-2"
          >
            <span
              className={`w-4 h-4 rounded-full border-2 ${
                !contactPublic
                  ? "bg-blue-500 border-blue-500"
                  : "border-gray-400"
              }`}
            ></span>
            <span>거부</span>
          </button>
        </div>
      </div>

      {/* 2. 소개글 작성 */}
      <div className="mx-2 mb-6">
        <label className="block text-gray-700 font-bold mb-2">소개글</label>
        <div className="ml-4">
          <textarea
            value={introduction}
            onChange={(e) => setIntroduction(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded resize-none"
            rows="4"
            placeholder="선생님으로서의 강점이나 수업 스타일을 소개해주세요."
          />
        </div>
      </div>

      {/* 3. 기타 경력사항 */}
      <div className="mx-2 mb-6">
        <label className="block text-gray-700 font-bold mb-2">
          기타 경력사항
        </label>
        <div className="ml-4">
          <textarea
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded resize-none"
            rows="4"
            placeholder="관련 자격증이나 경력을 작성해주세요."
          />
        </div>
      </div>

      {/* 하단 버튼 영역 */}
      <div className="mx-2 flex justify-end">
        {updateMode ? (
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
          >
            수정 완료
          </button>
        ) : (
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
          >
            등록하기
          </button>
        )}
      </div>
    </form>
  );
}

export default TeacherInfoCreateA;
