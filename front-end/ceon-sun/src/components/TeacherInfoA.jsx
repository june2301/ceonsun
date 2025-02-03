import React from "react";

function TeacherInfoA({ introduction = "", experience = "" }) {
  return (
    <div className="w-full px-4 py-2">
      {/* 소개글 */}
      <h2 className="text-lg font-bold mb-2">소개글</h2>
      <div className="flex">
        <div className="border-l-4 border-gray-400 pl-2">
          <p className="text-gray-800 leading-6 whitespace-pre-line pl-2">
            {introduction}
          </p>
        </div>
      </div>

      {/* 기타 경력사항 */}
      <h2 className="text-lg font-bold mt-6 mb-2">기타 경력사항</h2>
      <div className="flex">
        <div className="border-l-4 border-gray-400 pl-2">
          <p className="text-gray-800 leading-6 whitespace-pre-line pl-2">
            {experience}
          </p>
        </div>
      </div>
    </div>
  );
}

export default TeacherInfoA;
