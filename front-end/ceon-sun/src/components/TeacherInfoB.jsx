import React from "react";

function TeacherInfoB({ subjects = [], lessonFee = null, lessonInfo = "" }) {
  return (
    <div className="w-full px-2 py-2">
      {/* 수업 과목: 버튼처럼 보이는 작은 네모 박스로 나열 (세로줄 없음) */}
      <h2 className="text-lg font-bold mb-2">수업 과목</h2>
      <div className="flex flex-wrap gap-2 mb-6">
        {subjects.length > 0 ? (
          subjects.map((subj) => (
            <span
              key={subj}
              className="px-3 py-1 rounded-full border-2 text-sm bg-white-100 border-gray-400"
            >
              {subj}
            </span>
          ))
        ) : (
          <span>등록된 과목이 없습니다.</span>
        )}
      </div>

      {/* 수업 진행 */}
      <h2 className="text-lg font-bold mb-2">수업 진행</h2>
      <div className="flex">
        <div className="border-l-4 border-gray-400 pl-2 mb-6">
          <p className="text-gray-800 whitespace-pre-line pl-2">{lessonInfo}</p>
        </div>
      </div>

      {/* 회당 수업료 */}
      <h2 className="text-lg font-bold mb-2">회당 수업료</h2>
      <div className="flex">
        <div className="border-l-4 border-gray-400 pl-2">
          <p className="text-gray-800 pl-2">{lessonFee} 원</p>
        </div>
      </div>
    </div>
  );
}

export default TeacherInfoB;
