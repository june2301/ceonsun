import React from "react";

function TeacherInfoC({ materials = [] }) {
  return (
    <div className="w-full px-8 py-4">
      <div className="space-y-4">
        {materials.map((item, index) => (
          <div key={index} className="flex items-center">
            {/* 왼쪽 동그란 점 */}
            <span className="w-2 h-2 bg-gray-600 rounded-full flex-shrink-0"></span>
            {/* 날짜 텍스트 */}
            <span className="ml-2 whitespace-nowrap">{item.date}</span>
            {/* 점선 (flex-grow 요소로, 좌우 여백을 줌) */}
            <div className="flex-grow border-b-2 border-dashed border-gray-400 mx-4"></div>
            {/* 다운로드 버튼: 파일 URL을 href로 사용 */}
            <a
              href={item.fileUrl}
              download
              className="text-blue-500 underline whitespace-nowrap"
            >
              다운로드
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeacherInfoC;
