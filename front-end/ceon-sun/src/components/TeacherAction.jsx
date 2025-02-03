import React from "react";
import { ArrowLongLeftIcon, StarIcon } from "@heroicons/react/24/solid";
import DefaultProfile from "@/assets/img/default-profile.png";
// 만약 루트 경로를 @로 지정했다면 아래처럼 사용 가능
// import DefaultProfile from "@/assets/img/default-profile.png";

function TeacherAction({ teacher, onBack }) {
  return (
    <div className="w-[240px] min-w-[240px] flex flex-col px-4 py-3 border-r-2 border-gray-300">
      {/* 뒤로가기 버튼 (오른쪽 정렬) */}
      <div className="flex justify-end mb-3">
        <button onClick={onBack} className="hover:opacity-80">
          <ArrowLongLeftIcon className="w-8 h-8 text-gray-600" />
        </button>
      </div>

      {/* 프로필 카드 */}
      <div className="bg-white rounded-md border-2 border-gray-300 p-4 mb-3">
        {/* 프로필 사진과 "프로필 정보" 텍스트를 가로로 배치 */}
        <div className="flex items-center mb-4">
          <div className="w-24 h-24 mr-4 border border-gray-400 rounded">
            <img
              src={teacher.profileImage || DefaultProfile}
              alt="Profile"
              className="w-full h-full object-cover rounded"
            />
          </div>
          <div className="text-base font-bold text-center">
            프로필 <br /> 정보
          </div>
        </div>

        {/* 프로필 상세 정보 */}
        <div className="text-sm text-gray-600 leading-5">
          <div>
            닉네임 : <span className="font-bold">{teacher.nickname}</span>
          </div>
          <div>
            나이 : <span className="font-bold">{teacher.age}</span>
          </div>
          <div>
            성별 : <span className="font-bold">{teacher.gender}</span>
          </div>
          <div className="grid grid-cols-[auto,1fr] gap-x-2">
            <span>과목 :</span>
            <span className="font-bold">
              {teacher.subjects && teacher.subjects.length > 0
                ? teacher.subjects.join(", ")
                : "미등록"}
            </span>
          </div>
        </div>
      </div>

      {/* 문의, 찜하기, 과외신청 버튼 */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <button className="w-[100px] h-[40px] border-2 border-gray-300 rounded py-1 px-3 text-sm hover:bg-gray-100">
            문의하기
          </button>
          <button className="w-[100px] h-[40px] border-2 border-gray-300 rounded py-1 px-3 text-sm hover:bg-gray-100 flex items-center justify-center">
            <StarIcon className="w-5 h-5 mr-1 text-gray-200" />
            찜하기
          </button>
        </div>
        <button className="bg-yellow-400 hover:bg-yellow-300 text-white rounded py-2 font-semibold">
          과외 신청하기
        </button>
      </div>
    </div>
  );
}

export default TeacherAction;
