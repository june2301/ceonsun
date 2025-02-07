import React from "react";
import DefaultProfile from "./DefaultProfile";
import { ArrowUpIcon, ArrowLongLeftIcon } from "@heroicons/react/24/solid";

function StudentCardDetail({
  nickname,
  name,
  age,
  gender,
  profileImage,
  subjects = [],
  introduction = "",
  // 구분 플래그
  isListDetail = false, // CardListPage에서 접근
  isMyDetail = false, // MyLecture에서 접근
  studentStatus = "", // MyStudentList에서 접근시 사용
  // 닫기(Detail 종료) 함수
  onClose,
  // 버튼 클릭 핸들러들
  onAccept, // 수락하기
  onReject, // 거절하기
  onClassEnter, // 수업방 접속
  onInquiry, // 문의하기
  // 내 Detail 모드 전용
  onUpdate,
  cardPublic,
  onEndClass,
}) {
  // 상태에 따른 스타일 결정
  const getStatusStyle = () => {
    switch (studentStatus) {
      case "신청중":
        return { color: "#FFA500" };
      case "과외중":
        return { color: "#007BFF" };
      case "과외 종료":
        return { color: "#A89F91" };
      default:
        return { color: "#6B7280" }; // text-gray-500에 해당하는 색상
    }
  };

  // 하단 버튼 영역 렌더링 함수
  const renderBottomButtons = () => {
    if (isMyDetail) {
      return (
        <div className="flex justify-end">
          <button
            onClick={onUpdate}
            className="px-4 py-2 bg-amber-200 font-semibold rounded shadow hover:bg-amber-300 transition"
          >
            수정하기
          </button>
        </div>
      );
    }

    if (isListDetail) {
      return (
        <div className="flex justify-end">
          <button
            onClick={onInquiry}
            className="px-4 py-2 bg-green-300 hover:bg-green-400 font-semibold rounded shadow transition"
          >
            문의하기
          </button>
        </div>
      );
    }

    // MyStudentList의 경우
    switch (studentStatus) {
      case "신청중":
        return (
          <div className="flex justify-end space-x-2">
            <button
              onClick={onAccept}
              className="whitespace-nowrap text-sm font-semibold rounded px-3 py-2 bg-blue-400 hover:bg-blue-500 text-white"
            >
              수락하기
            </button>
            <button
              onClick={onReject}
              className="whitespace-nowrap text-sm font-semibold rounded px-3 py-2 bg-gray-400 hover:bg-gray-600 text-white"
            >
              거절하기
            </button>
          </div>
        );
      case "과외중":
        return (
          <div className="flex justify-between">
            <button
              onClick={onEndClass}
              className="whitespace-nowrap text-sm font-semibold rounded px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700"
            >
              과외 종료하기
            </button>
            <button
              onClick={onClassEnter}
              className="whitespace-nowrap text-sm text-gray-700 font-semibold rounded px-3 py-2 border-2 border-gray-300 bg-white hover:bg-gray-300"
            >
              수업방 접속
            </button>
          </div>
        );
      case "과외 종료":
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-md p-4 shadow-[0_2px_8px_rgba(0,0,0,0.1)] relative">
      {/* 상단 닫기 버튼과 상태 표시 */}
      {isMyDetail ? (
        <div className="pb-3 text-gray-600 hover:text-gray-800">
          <button onClick={onClose} className="flex items-center space-x-1">
            <ArrowLongLeftIcon className="w-7 h-7" />
            <span className="font-bold">수강 정보</span>
          </button>
        </div>
      ) : (
        <div className="absolute top-4 right-4 flex items-center space-x-3">
          {/* 상태 텍스트 - studentStatus가 있을 때만 표시 */}
          {studentStatus && (
            <span className="text-sm font-semibold" style={getStatusStyle()}>
              {studentStatus}
            </span>
          )}
          {/* 닫기 버튼 */}
          <button onClick={onClose} title="닫기">
            <ArrowUpIcon className="w-5 h-5 text-gray-600 hover:text-gray-800" />
          </button>
        </div>
      )}

      {/* DefaultProfile (작은 버전) */}
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

      {/* 카드 공개 정보 (MyLecture에서만 표시) */}
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
      {renderBottomButtons()}
    </div>
  );
}

export default StudentCardDetail;
