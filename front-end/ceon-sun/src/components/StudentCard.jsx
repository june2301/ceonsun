import React from "react";

function StudentCard({
  // 항상 표시될 정보
  nickname,
  subjects = [],
  profileImageUrl = "",

  // 상태: "신청중", "과외중", "과외 종료"
  studentStatus = "",

  // "자세히 보기" 표시 여부
  showDetail = false,

  // 하단 영역 표시 여부들
  showRemainingLessons = false,
  remainingLessonsCount = 0,
  showEnterClassroomButton = false, // "수업방 접속"
  showAcceptButton = false, // "수락하기"
  showRejectButton = false, // "거절하기"
}) {
  // 하단 영역(구분선 아래)을 표시해야 하는지 여부
  const isBottomAreaVisible =
    showRemainingLessons ||
    showEnterClassroomButton ||
    showAcceptButton ||
    showRejectButton;

  // studentStatus 상태에 따른 스타일
  const statusStyle = (() => {
    switch (studentStatus) {
      case "신청중":
        return { color: "#FFA500" }; // 주황색
      case "과외중":
        return { color: "#007BFF" }; // 파란색
      case "과외 종료":
        return { color: "#A89F91" }; // 회갈색
      default:
        return { color: "#B0B0B0" }; // 기본 회색
    }
  })();

  return (
    <div
      className="
        bg-white
        rounded-md
        p-4
        shadow-[0_2px_8px_rgba(0,0,0,0.1)]
        w-[450px]
      "
    >
      {/* 상단 영역 */}
      <div className="flex items-start">
        {/* 프로필 이미지 */}
        <div
          className="
            w-16 h-16
            bg-gray-100
            rounded-md
            mr-4
            flex-shrink-0
            overflow-hidden
          "
        >
          {profileImageUrl && (
            <img
              src={profileImageUrl}
              alt="profile"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="flex flex-col w-full">
          {/* 1) [닉네임 : xxx] + [상태] 같은 줄 */}
          <div className="mt-1 flex items-center justify-between">
            {/* 닉네임 영역 */}
            <div>
              <span className="text-gray-600">닉네임 : </span>
              <span className="font-bold text-gray-600">{nickname}</span>
            </div>
            {/* 우측 상태 표시 */}
            {studentStatus && (
              <span className="text-sm font-semibold" style={statusStyle}>
                {studentStatus}
              </span>
            )}
          </div>

          {/* 2) [희망 과목 : xxx] + [자세히 보기] 같은 줄 */}
          <div className="mt-2.5 flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center flex-1 overflow-hidden whitespace-nowrap">
              <span className="text-gray-600">희망 과목 : </span>
              <span
                className="
                  font-bold
                  text-gray-600
                  overflow-hidden
                  text-ellipsis
                  whitespace-nowrap
                  ml-1
                "
              >
                {subjects.join(", ")}
              </span>
            </div>
            {/* 자세히 보기 버튼 */}
            {showDetail && (
              <span className="font-semibold text-sm text-gray-600 cursor-pointer">
                자세히 보기
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 구분선 + 하단 영역 (필요 시) */}
      {isBottomAreaVisible && (
        <>
          <div className="mt-4 mx-1 border-t border-gray-300" />
          <div className="mt-3 flex justify-between items-center">
            {/* 잔여 수업 횟수 (0이어도 표시) */}
            {showRemainingLessons && (
              <span className="text-sm text-gray-500 whitespace-nowrap">
                잔여 수업 횟수 :{" "}
                <span className="text-gray-600 font-bold">
                  {remainingLessonsCount}
                </span>
              </span>
            )}

            {/* 버튼들 (오른쪽 정렬) */}
            <div className="flex space-x-2">
              {/* 수업방 접속 */}
              {showEnterClassroomButton && (
                <button
                  className="
                    whitespace-nowrap
                    min-w-[90px]
                    py-1 px-2
                    bg-white-200 hover:bg-gray-200
                    text-sm text-gray-600
                    font-semibold
                    shadow-[0_2px_5px_rgba(0,0,0,0.2)]
                    rounded
                  "
                >
                  수업방 접속
                </button>
              )}

              {/* 수락하기 */}
              {showAcceptButton && (
                <button
                  className="
                    whitespace-nowrap
                    min-w-[70px]
                    py-1 px-2
                    bg-blue-400 hover:bg-blue-500
                    text-white text-sm
                    font-semibold
                    rounded
                  "
                >
                  수락하기
                </button>
              )}

              {/* 거절하기 */}
              {showRejectButton && (
                <button
                  className="
                    whitespace-nowrap
                    min-w-[70px]
                    py-1 px-2
                    bg-gray-400 hover:bg-gray-600
                    text-white text-sm
                    font-semibold
                    rounded
                  "
                >
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
