import React from "react";
import DefaultProfile from "./DefaultProfile";

function TeacherInfoA({
  description = "",
  careerDescription = "",
  showProfile = false,
  teacher,
}) {
  return (
    <div className="w-full px-2 py-2">
      {showProfile && teacher && (
        <div className="mb-4">
          <DefaultProfile
            name={teacher.name}
            nickname={teacher.nickname}
            age={teacher.age}
            gender={teacher.gender}
            profileImage={teacher.profileImage}
            isLarge={false}
          />
          <hr className="my-6 border-t border-gray-300" />
        </div>
      )}
      {/* 소개글 */}
      <h2 className="text-lg font-bold mb-2">소개글</h2>
      <div className="flex pl-1">
        <div className="border-l-4 border-gray-400 pl-1">
          <p className="text-gray-800 leading-6 whitespace-pre-line pl-2">
            {description}
          </p>
        </div>
      </div>

      {/* 기타 경력사항 */}
      <h2 className="text-lg font-bold mt-6 mb-2">기타 경력사항</h2>
      <div className="flex pl-1">
        <div className="border-l-4 border-gray-400 pl-1">
          <p className="text-gray-800 leading-6 whitespace-pre-line pl-2">
            {careerDescription}
          </p>
        </div>
      </div>
    </div>
  );
}

export default TeacherInfoA;
