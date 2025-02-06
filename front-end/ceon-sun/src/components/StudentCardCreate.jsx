import React, { useState, useEffect } from "react";
import DefaultProfile from "./DefaultProfile";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { ArrowLongLeftIcon } from "@heroicons/react/24/solid";

const SUBJECTS = [
  "Python",
  "Java",
  "JavaScript",
  "C",
  "C#",
  "C++",
  "TypeScript",
  "Kotlin",
  "Swift",
];

function StudentCardCreate({
  name,
  nickname,
  age,
  birthdate,
  gender,
  profileImage,
  // 업데이트 모드 여부. true이면 기존 데이터를 수정하는 모드로 전환
  updateMode = false,
  // 업데이트 모드일 때 초기 데이터 (있으면 props로 전달)
  subjects: initialSubjects = [],
  introduction: initialIntroduction = "",
  // 업데이트 모드에서 뒤로가기(수정 전 Detail로 돌아가기) 버튼 처리용 onClose
  onClose,
  // 업데이트 모드에서 "수정 완료" 버튼 클릭 시 실행할 함수
  onUpdate,
}) {
  // 카드 공개: true = 허용, false = 거부 (기본값은 허용)
  const [cardPublic, setCardPublic] = useState(true);
  const [selectedSubjects, setSelectedSubjects] = useState(initialSubjects);
  const [introduction, setIntroduction] = useState(initialIntroduction);
  const [showTooltip, setShowTooltip] = useState(false);

  // 과목 버튼 클릭 시 선택/해제 처리
  const handleSubjectClick = (subj) => {
    if (selectedSubjects.includes(subj)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subj));
    } else {
      setSelectedSubjects([...selectedSubjects, subj]);
    }
  };

  // 작성 모드 제출 함수
  const handleSubmit = (e) => {
    e.preventDefault();
    const studentCardData = {
      cardPublic,
      selectedSubjects,
      introduction,
    };
    console.log("Student Card Data (작성):", studentCardData);
    // TODO: 입력 데이터를 백엔드로 전송하는 로직 추가
  };

  // 업데이트(수정) 모드 제출 함수
  const handleUpdate = (e) => {
    e.preventDefault();
    const studentCardData = {
      cardPublic,
      selectedSubjects,
      introduction,
    };
    console.log("Student Card Data (수정):", studentCardData);
    if (onUpdate) onUpdate(studentCardData);
  };

  // updateMode가 변경되었을 때, 부모에서 전달한 초기값으로 상태를 업데이트
  useEffect(() => {
    if (updateMode) {
      setSelectedSubjects(initialSubjects);
      setIntroduction(initialIntroduction);
    }
  }, [updateMode, initialSubjects, initialIntroduction]);

  return (
    <form
      onSubmit={updateMode ? handleUpdate : handleSubmit}
      className="bg-white p-2"
    >
      {/* updateMode일 경우 좌측 상단 뒤로가기 버튼 */}
      {updateMode && (
        <div className="mb-4">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center space-x-1 text-gray-700 hover:text-gray-900"
          >
            <ArrowLongLeftIcon className="w-7 h-7 text-gray-600 hover:text-gray-800" />

            <span className="font-bold text-gray-700">뒤로가기</span>
          </button>
        </div>
      )}

      {/* 상단에 DefaultProfile (작은 버전) */}
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

      {/* DefaultProfile 아래 약간 좁은 가로선 */}
      <hr className="mb-5 border-t border-gray-300" />

      {/* 1. 카드 공개 선택 - 제목과 버튼들이 한 줄에 표시 */}
      <div className="mx-2 mb-8 flex items-center">
        {/* 왼쪽: 제목과 정보 아이콘 */}
        <div className="flex items-center justify-start">
          <label className="text-gray-700 font-bold mr-2">카드 공개</label>
          <div
            className="relative cursor-pointer"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <InformationCircleIcon className="w-5 h-5 text-gray-400" />
            {showTooltip && (
              <div
                className="
                  absolute bottom-full left-0 mb-2
                  w-[280px] p-3
                  bg-white border border-gray-300
                  rounded shadow-lg
                  text-xs text-gray-700
                  z-20
                "
              >
                카드 공개를 허용하면 선생님이 카드를 조회할 수 있으며 문의
                연락이 도착할 수 있습니다.
              </div>
            )}
          </div>
        </div>

        {/* 오른쪽: 허용/거부 버튼 */}
        <div className="flex flex-1 justify-evenly">
          <button
            type="button"
            onClick={() => setCardPublic(true)}
            className="flex items-center space-x-2"
          >
            <span
              className={`w-4 h-4 rounded-full border-2 ${
                cardPublic ? "bg-blue-500 border-blue-500" : "border-gray-400"
              }`}
            ></span>
            <span>허용</span>
          </button>
          <button
            type="button"
            onClick={() => setCardPublic(false)}
            className="flex items-center space-x-2"
          >
            <span
              className={`w-4 h-4 rounded-full border-2 ${
                !cardPublic ? "bg-blue-500 border-blue-500" : "border-gray-400"
              }`}
            ></span>
            <span>거부</span>
          </button>
        </div>
      </div>

      {/* 2. 수강 희망 과목 선택 */}
      <div className="mx-2 mb-8">
        <label className="block text-gray-700 font-bold mb-2">
          수강 희망 과목 선택
          <span className="text-gray-500 text-xs ml-2">복수 선택 가능</span>
        </label>
        <div className="ml-4 flex flex-wrap gap-2 justify-start">
          {SUBJECTS.map((subj) => {
            const selected = selectedSubjects.includes(subj);
            return (
              <button
                key={subj}
                type="button"
                onClick={() => handleSubjectClick(subj)}
                className={`
                  px-3 py-1 rounded-full border text-sm
                  ${
                    selected
                      ? "bg-sky-100 border-blue-300"
                      : "bg-white-100 border-gray-300"
                  }
                `}
              >
                {subj}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. 소개글 작성 */}
      <div className="mx-2 mb-6">
        <label className="block text-gray-700 font-bold mb-2">
          소개글 작성
        </label>
        <div className="ml-4">
          <textarea
            value={introduction}
            onChange={(e) => setIntroduction(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded resize-none"
            rows="4"
            placeholder="간단한 소개글 혹은 원하는 수업 방식을 작성해보세요."
          />
        </div>
      </div>

      {/* 하단 버튼 영역: updateMode에 따라 다른 버튼을 표시 */}
      <div className="mx-2 flex justify-end space-x-4">
        {updateMode ? (
          <>
            <button
              type="button"
              onClick={handleUpdate}
              className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
            >
              수정 완료
            </button>
          </>
        ) : (
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
          >
            작성 완료
          </button>
        )}
      </div>
    </form>
  );
}

export default StudentCardCreate;
