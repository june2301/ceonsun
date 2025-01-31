import React from "react";

function TeacherCard({
  // 항상 표시될 정보
  nickname,
  subjects = [],
  profileImage = "",

  // 선택적으로 표시할 정보들
  showDetail = false, // "자세히 보기" 텍스트 표시 여부
  showAge = false,
  age = null,
  showGender = false,
  gender = "",
  showRemainLessons = false,
  remainLessonsCnt = 0,
  showClassroomButton = false,
  classroomButtonOnTop = false, // true면 상단, false면 하단
  showPaymentButton = false,
}) {
  // 하단 영역(구분선 아래)을 표시해야 하는지 여부
  const bottomVisible =
    showRemainLessons ||
    (showClassroomButton && !classroomButtonOnTop) ||
    showPaymentButton;

  // 나이+성별이 둘 다 공개된 경우 => w-16 h-16, 그렇지 않으면 기본 w-20 h-20
  const profileSizeClass =
    showAge && age !== null && showGender && gender !== ""
      ? "w-20 h-20"
      : "w-16 h-16";

  return (
    <div
      className="
        bg-white
        rounded-md
        p-4
        shadow-[0_2px_8px_rgba(0,0,0,0.1)]
      "
    >
      {/* 상단 영역 */}
      <div className="flex items-start">
        {/* 프로필 이미지 */}
        <div
          className={`
            ${profileSizeClass}
            bg-gray-100
            rounded-md
            mr-4
            flex-shrink-0
            overflow-hidden
          `}
        >
          {profileImage && (
            <img
              src={profileImage}
              alt="profile"
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="flex flex-col w-full">
          {/* 1) 닉네임 & 자세히 보기 */}
          <div className="mt-0.5 mb-1 flex items-center justify-between">
            <div>
              <span className="text-gray-600">닉네임 : </span>
              <span className="font-bold text-gray-600">{nickname}</span>
            </div>
            {showDetail && (
              <span className="font-semibold text-sm text-gray-600 cursor-pointer">
                자세히 보기
              </span>
            )}
          </div>

          {/* 2) 나이 / 성별 (옵션) */}
          {(showAge || showGender) && (
            <div className="mt-0.5 text-sm text-gray-500 mb-1">
              {showAge && age !== null && (
                <span className="mr-4">
                  <span className="text-gray-600">나이 : </span>
                  {/* 실제 나이만 진한 글씨 */}
                  <span className="text-gray-600 font-bold">{age}</span>
                </span>
              )}
              {showGender && gender && (
                <span>
                  <span className="text-gray-600">성별 : </span>
                  {/* 실제 성별만 진한 글씨 */}
                  <span className="text-gray-600 font-bold">{gender}</span>
                </span>
              )}
            </div>
          )}

          {/* 3) 수업 과목 & 상단 "수업방 접속" (옵션) 같은 라인 */}
          <div className="mt-0.5 flex items-center justify-between text-sm text-gray-500">
            {/* 과목 영역 */}
            <div className="overflow-hidden whitespace-nowrap text-ellipsis flex-1 mr-2">
              <span className="text-gray-600 align-middle">수업 과목 : </span>
              <span
                className="
                  inline-block
                  max-w-[180px]
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
            {/* 상단 수업방 버튼 (옵션) */}
            {classroomButtonOnTop && showClassroomButton && (
              <button
                className="
                  whitespace-nowrap
                  min-w-[90px]
                  py-1 px-2
                  bg-white-200 hover:bg-gray-300
                  text-sm text-gray-600
                  font-semibold
                  shadow-[0_2px_5px_rgba(0,0,0,0.2)]
                  rounded
                "
              >
                수업방 접속
              </button>
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
              <span className="text-sm text-gray-500 whitespace-nowrap">
                잔여 수업 횟수 :{" "}
                <span className="text-gray-600 font-bold">
                  {remainLessonsCnt}
                </span>
              </span>
            )}
            <div className="flex space-x-2">
              {/* 하단 수업방 접속 버튼 */}
              {!classroomButtonOnTop && showClassroomButton && (
                <button
                  className="
                    whitespace-nowrap
                    min-w-[90px]
                    py-1 px-2
                    bg-white-200 hover:bg-gray-300
                    text-sm text-gray-600
                    font-semibold
                    shadow-[0_2px_5px_rgba(0,0,0,0.2)]
                    rounded
                  "
                >
                  수업방 접속
                </button>
              )}
              {/* 수강료 결제하기 버튼 */}
              {showPaymentButton && (
                <button
                  className="
                    whitespace-nowrap
                    min-w-[100px]
                    py-1 px-2
                    bg-purple-500 hover:bg-purple-600
                    text-white text-sm
                    font-semibold
                    rounded
                  "
                >
                  수강료 결제하기
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default TeacherCard;
