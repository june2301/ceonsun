import React, { useState } from "react";
import DefaultProfile from "./DefaultProfile";
import UpdateProfile from "./UpdateProfile";

function MyInfo({
  role,
  teacherLessonCount,
  userInfo,
  isLarge,
  onProfileUpdate,
}) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSave = (updatedData) => {
    setIsEditing(false);
    onProfileUpdate(updatedData);
  };

  return (
    <div className="w-[600px] pl-2">
      {isEditing ? (
        <UpdateProfile userInfo={userInfo} onSave={handleSave} />
      ) : (
        <>
          <div className="relative">
            <DefaultProfile {...userInfo} isLarge={isLarge} />
            {isLarge && (
              <button
                onClick={handleEditClick}
                className="absolute bottom-0 right-0 px-3 py-1 bg-indigo-400 text-white rounded shadow hover:bg-indigo-500 transition"
              >
                수정하기
              </button>
            )}
          </div>
          <hr className="mt-4 border-t-2 border-gray-300" />
          {/* {role === "TEACHER" && (
            <div className="mt-4 font-semibold text-gray-700 text-center">
              수업 이력 : 과외 체결 횟수 {teacherLessonCount}회
            </div>
          )} */}
        </>
      )}
    </div>
  );
}

export default MyInfo;
