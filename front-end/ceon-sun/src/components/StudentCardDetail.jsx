import React from "react";

function StudentCardDetail({
  nickname,
  profileImage,
  subjects,
  onDetailClick,
}) {
  return (
    <div className="bg-white rounded-md p-4 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
      <div className="flex items-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full mr-4 overflow-hidden">
          <img
            src={profileImage}
            alt="profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <div className="font-bold text-lg">{nickname}</div>
          <div className="text-sm text-gray-600">자세한 학생 정보 표시...</div>
        </div>
      </div>
      <div className="mt-4">
        <div className="font-semibold">희망 과목:</div>
        <div className="text-gray-700">{subjects.join(", ")}</div>
      </div>
      {/* 닫기 버튼을 눌러 상세뷰를 접을 수 있도록 */}
      <button onClick={onDetailClick} className="mt-4 text-blue-500 underline">
        닫기
      </button>
    </div>
  );
}

export default StudentCardDetail;
