import React from "react";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import DefaultProfile from "@/assets/img/default-profile.png";

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
  onDetailClick, // "자세히 보기" 버튼 클릭 시 호출할 함수
}) {
  // 하단 영역(구분선 아래)을 표시해야 하는지 여부
  const bottomVisible =
    showRemainLessons ||
    (showClassroomButton && !classroomButtonOnTop) ||
    showPaymentButton;

  // 나이+성별이 둘 다 공개된 경우 => w-20 h-20, 그렇지 않으면 기본 w-16 h-16
  const profileSizeClass =
    showAge && age !== null && showGender && gender !== ""
      ? "w-20 h-20"
      : "w-16 h-16";

  // "2번째 줄(나이/성별) 표시 여부" => 사실상 3줄이 되는 조건
  // (showAge || showGender)가 true면 3줄, 둘 다 false면 2줄
  const isThreeLines = showAge || showGender;

  return (
    <div className="bg-white rounded-md p-4 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
      {/* 상단 영역 */}
      <div className="relative flex items-start">
        {/* 프로필 이미지 */}
        <div
          className={`
            ${profileSizeClass}
            bg-white
            rounded-md
            mr-4
            flex-shrink-0
            overflow-hidden
            border
            border-gray-300
          `}
        >
          <img
            src={profileImage || DefaultProfile}
            alt="profile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* 상단 텍스트 영역: 1,2,3번째 라인을 flex-col + gap-2 */}
        <div className="flex flex-col w-full gap-2">
          {/* 1번째 줄: 닉네임 & 자세히 보기 */}
          {/* 2줄일 때(나이/성별이 없음)만 닉네임 영역에 mt-1 추가 */}
          <div
            className={`flex items-center justify-between ${
              !isThreeLines ? "mt-1" : ""
            }`}
          >
            <div>
              <span className="text-gray-600">닉네임 : </span>
              <span className="font-bold text-gray-600">{nickname}</span>
            </div>
            {showDetail && (
              <span
                className="flex items-center font-semibold text-sm text-gray-600 cursor-pointer"
                onClick={onDetailClick}
              >
                자세히 보기
                <ArrowRightIcon className="w-4 h-4 ml-1" />
              </span>
            )}
          </div>

          {/* 2번째 줄: 나이 / 성별 (옵션) - 있으면 3줄, 없으면 2줄 */}
          {(showAge || showGender) && (
            <div className="text-sm text-gray-500 flex items-center gap-4">
              {showAge && age !== null && (
                <span>
                  <span className="text-gray-600">나이 : </span>
                  <span className="text-gray-600 font-bold">{age}</span>
                </span>
              )}
              {showGender && gender && (
                <span>
                  <span className="text-gray-600">성별 : </span>
                  <span className="text-gray-600 font-bold">{gender}</span>
                </span>
              )}
            </div>
          )}

          {/* 3번째 줄: 수업 과목 */}
          <div className="text-sm text-gray-500 flex items-center">
            <span className="text-gray-600 mr-1">수업 과목 : </span>
            <span
              className="
                inline-block
                max-w-[180px]
                overflow-hidden
                whitespace-nowrap
                text-ellipsis
                font-bold
                text-gray-600
              "
            >
              {subjects.join(", ")}
            </span>
          </div>
        </div>

        {/* 상단 "수업방 접속" 버튼 (옵션, 절대 배치) */}
        {classroomButtonOnTop && showClassroomButton && (
          <div className="absolute bottom-0 right-0">
            <button
              className="
                whitespace-nowrap
                text-sm 
                text-gray-700
                font-semibold
                rounded
                px-3
                py-2
                border-2 border-gray-300
                bg-white hover:bg-gray-300
              "
            >
              수업방 접속
            </button>
          </div>
        )}
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
                    text-sm 
                    text-gray-700
                    font-semibold
                    rounded
                    px-3
                    py-2
                    border-2 border-gray-300
                    bg-white hover:bg-gray-300
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
                    px-3 py-1.5
                    border-2 border-purple-600 bg-purple-500 hover:bg-purple-600
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
