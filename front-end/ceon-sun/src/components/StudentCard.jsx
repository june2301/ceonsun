import React from "react";
import { ArrowDownIcon } from "@heroicons/react/24/solid";
import { ArrowLongRightIcon } from "@heroicons/react/24/solid";
import DefaultProfile from "@/assets/img/default-profile.png";

function StudentCard({
  // 항상 표시될 정보
  nickname,
  subjects = [],
  profileImage = "",

  // 상태: "신청중", "과외중", "과외 종료"
  studentStatus = "",

  // "자세히 보기" 표시 여부
  showDetail = false,
  showRemainLessons = false,
  remainLessonsCnt = 0,
  showClassroomButton = false, // "수업방 접속"
  showAcceptButton = false, // "수락하기"
  showRejectButton = false, // "거절하기"
  onDetailClick, // "자세히 보기" 버튼 클릭 시 호출할 함수

  // 새롭게 추가한 prop (본인 카드인 경우)
  isOwner = false,
  cardPublic, // boolean: true면 공개, false면 비공개
}) {
  // 하단 영역(구분선 아래)을 표시해야 하는지 여부
  const bottomVisible =
    showRemainLessons ||
    showClassroomButton ||
    showAcceptButton ||
    showRejectButton;

  // 본인 카드(isOwner === true)라면 cardPublic에 따라 "공개"/"비공개"를
  // 그렇지 않으면 studentStatus를 사용
  const displayStatus = isOwner
    ? cardPublic
      ? "공개"
      : "비공개"
    : studentStatus;

  // 상태에 따른 스타일 (isOwner인 경우 기본 스타일, 아니면 기존 색상 적용)
  const statusStyle = (() => {
    if (isOwner) {
      return { color: cardPublic ? "#007BFF" : "#A89F91" };
    }
    switch (studentStatus) {
      case "신청중":
        return { color: "#FFA500" };
      case "과외중":
        return { color: "#007BFF" };
      case "과외 종료":
        return { color: "#A89F91" };
      default:
        return { color: "#B0B0B0" };
    }
  })();

  return (
    <div className="bg-white rounded-md p-4 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
      {/* 상단 영역 */}
      <div className="pl-1 flex items-start">
        {/* 프로필 이미지 */}
        <div
          className="
            w-16 h-16
            bg-white
            rounded-md
            mr-4
            flex-shrink-0
            overflow-hidden
            border
            border-gray-300
          "
        >
          <img
            src={profileImage || DefaultProfile}
            alt="profile"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col w-full">
          {/* 1) [닉네임 : xxx] + [상태] 같은 줄 */}
          <div className="mt-1 flex items-center justify-between">
            <div>
              <span className="text-gray-600">닉네임 : </span>
              <span className="font-bold text-gray-600">{nickname}</span>
            </div>
            {displayStatus && (
              <span className="pr-2 text-sm font-semibold" style={statusStyle}>
                {displayStatus}
              </span>
            )}
          </div>

          {/* 2) [희망 과목 : xxx] + [자세히 보기] 같은 줄 */}
          <div className="mt-2.5 flex items-center justify-between text-sm text-gray-500">
            <div
              className="
                flex items-center flex-1
                overflow-hidden whitespace-nowrap
              "
            >
              <span className="text-gray-600">희망 과목 : </span>
              <span
                className="
                  inline-block
                  max-w-[180px]
                  ml-1
                  align-middle
                  overflow-hidden
                  whitespace-nowrap
                  text-ellipsis
                  font-bold text-gray-600
                "
              >
                {subjects.join(", ")}
              </span>
            </div>
            {/* 자세히 보기 버튼: isOwner에 따라 다른 화살표 아이콘 표시 */}
            {showDetail && (
              <span
                className="flex items-center font-semibold text-sm text-gray-600 hover:text-gray-800 cursor-pointer"
                onClick={() => onDetailClick && onDetailClick()}
              >
                자세히 보기
                {isOwner ? (
                  <ArrowLongRightIcon className="w-5 h-5 ml-1 text-gray-600 hover:text-gray-800" />
                ) : (
                  <ArrowDownIcon className="w-5 h-5 ml-1 text-gray-600 hover:text-gray-800" />
                )}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 구분선 + 하단 영역 (필요 시) */}
      {bottomVisible && (
        <>
          <div className="mt-4 mx-1 border-t border-gray-300" />
          <div className="mt-3 flex justify-between items-center">
            {/* 잔여 수업 횟수 (0이어도 표시) */}
            {showRemainLessons && (
              <span className="ml-2 text-sm text-gray-500 whitespace-nowrap">
                잔여 수업 횟수 :{" "}
                <span className="text-gray-600 font-bold">
                  {remainLessonsCnt}
                </span>
              </span>
            )}

            {/* 버튼들 (오른쪽 정렬) */}
            <div className="flex justify-end space-x-2 ml-auto">
              {/* 수업방 접속 */}
              {showClassroomButton && (
                <button className="whitespace-nowrap text-sm text-gray-700 font-semibold rounded px-3 py-2 border-2 border-gray-300 bg-white hover:bg-gray-300 mr-1">
                  수업방 접속
                </button>
              )}

              {/* 수락하기 */}
              {showAcceptButton && (
                <button className="whitespace-nowrap text-sm font-semibold rounded px-3 py-2 bg-blue-400 hover:bg-blue-500 text-white">
                  수락하기
                </button>
              )}

              {/* 거절하기 */}
              {showRejectButton && (
                <button className="whitespace-nowrap text-sm font-semibold rounded px-3 py-2 bg-gray-400 hover:bg-gray-600 text-white">
                  거절하기
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default StudentCard;
