import React from "react";
import DefaultProfile from "./DefaultProfile";
import { ArrowUpIcon, ArrowLongLeftIcon } from "@heroicons/react/24/solid";

function StudentCardDetail({
  nickname,
  name, // DefaultProfile에 전달할 이름
  age, // DefaultProfile에 전달할 나이
  gender, // DefaultProfile에 전달할 성별
  profileImage,
  subjects = [],
  introduction = "",
  // 구분 플래그: 리스트 내 확장인지 (Scenario 1) 또는 내 Detail 모드인지 (Scenario 2)
  isListDetail = false,
  isMyDetail = false,
  // 닫기(Detail 종료) 함수 – 상황에 맞게 전달됨
  onClose,
  // 수정하기 버튼 클릭 함수 (내 Detail 모드에서만 사용)
  onUpdate,
  // 카드 공개 여부 (내 학생 카드 Detail 모드에서 조회용)
  cardPublic,
}) {
  return (
    <div className="bg-white rounded-md p-4 shadow-[0_2px_8px_rgba(0,0,0,0.1)] relative">
      {/* 상단 버튼 영역 */}
      {isListDetail && (
        // Scenario 1: 우측 상단 닫기 버튼 (ArrowUpIcon)
        <div className="absolute top-4 right-4">
          <button onClick={onClose} title="닫기">
            <ArrowUpIcon className="w-5 h-5 text-gray-600 hover:text-gray-800" />
          </button>
        </div>
      )}
      {isMyDetail && (
        // Scenario 2: 좌측 상단에 왼쪽 화살표와 "수강 정보" 텍스트 전체가 버튼으로 동작
        <div className="pb-3">
          <button onClick={onClose} className="flex items-center space-x-1">
            <ArrowLongLeftIcon className="w-7 h-7 text-gray-600 hover:text-gray-800" />
            <span className="font-bold text-gray-700">수강 정보</span>
          </button>
        </div>
      )}

      {/* 상단: DefaultProfile (작은 버전) */}
      <div className="mb-5">
        <DefaultProfile
          name={name}
          nickname={nickname}
          age={age}
          gender={gender}
          profileImage={profileImage}
          isLarge={false}
        />
      </div>

      {/* 구분선 */}
      <hr className="mb-5 border-t border-gray-300" />

      {/* (Scenario 2) 카드 공개 정보 표시 */}
      {isMyDetail && (
        <div className="mb-8 flex items-center">
          <div className="flex items-center space-x-2">
            <span className="text-gray-700 font-bold pr-20">카드 공개</span>
            <div
              className={`w-4 h-4 rounded-full border-2 ${
                cardPublic ? "bg-blue-500 border-blue-500" : "border-gray-400"
              }`}
            ></div>
            <span>{cardPublic ? "허용" : "비공개"}</span>
          </div>
        </div>
      )}

      {/* 수강 희망 과목 */}
      <div className="mb-8">
        <div className="font-bold text-gray-700 mb-2">수강 희망 과목</div>
        <div className="flex flex-wrap gap-2 pl-0.5">
          {subjects.map((subj, idx) => (
            <span
              key={idx}
              className="px-3 py-1 rounded-full border border-gray-300 text-sm bg-white"
            >
              {subj}
            </span>
          ))}
        </div>
      </div>

      {/* 소개글 */}
      <div className="mb-6">
        <div className="font-bold text-gray-700 mb-2">소개글</div>
        <div className="flex pl-2">
          <div className="border-l-4 border-gray-400 pl-2">
            <p className="text-gray-800 leading-6 whitespace-pre-line pl-1">
              {introduction}
            </p>
          </div>
        </div>
      </div>

      {/* 하단 버튼 영역 */}
      {isMyDetail ? (
        // Scenario 2: 우측 하단 문의하기 버튼 대신 수정하기 버튼.
        // 수정하기 버튼을 누르면 onUpdate 함수가 호출되면서,
        // 현재 Detail 데이터를 객체로 전달하여 MyLecture가 StudentCardCreate(업데이트 모드)로 전환됨.
        <div className="flex justify-end">
          <button
            onClick={() =>
              onUpdate &&
              onUpdate({
                nickname,
                name,
                age,
                gender,
                profileImage,
                subjects,
                introduction,
                cardPublic,
              })
            }
            className="px-4 py-2 bg-amber-200 font-semibold rounded shadow hover:bg-amber-300 transition"
          >
            수정하기
          </button>
        </div>
      ) : isListDetail ? (
        // Scenario 1: 우측 하단 문의하기 버튼
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-green-300 hover:bg-green-400 font-semibold rounded shadow transition"
          >
            문의하기
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default StudentCardDetail;
