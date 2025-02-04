import React, { useState } from "react";
import DefaultProfile from "./DefaultProfile";
import UpdateProfile from "./UpdateProfile";

function MyInfo({ userRole, teacherLessonCount, ...props }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSave = (updatedData) => {
    console.log("Updated profile data:", updatedData);
    // 수정 후 필요한 처리를 진행한 후 수정 모드를 종료합니다.
    setIsEditing(false);
  };

  return (
    <div className="w-[600px] pl-2">
      {isEditing ? (
        // 수정 모드: UpdateProfile로 전체 영역 교체
        <UpdateProfile {...props} onSave={handleSave} />
      ) : (
        <>
          {/* 기본 프로필 정보와 우측 하단 수정하기 버튼 */}
          <div className="relative">
            <DefaultProfile {...props} />
            {props.isLarge && (
              <button
                onClick={handleEditClick}
                className="absolute bottom-0 right-0 px-3 py-1 bg-indigo-400 text-white rounded shadow hover:bg-indigo-500 transition"
              >
                수정하기
              </button>
            )}
          </div>
          {/* DefaultProfile 아래 가로선 */}
          <hr className="mt-4 border-t-2 border-gray-300" />
          {/* teacher인 경우 수업 이력 표시 */}
          {userRole === "teacher" && (
            <div className="mt-4 font-semibold text-gray-700 text-center">
              수업 이력 : 과외 체결 횟수 {teacherLessonCount}회
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MyInfo;
