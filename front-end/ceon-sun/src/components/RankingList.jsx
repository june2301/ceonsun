import React, { useState } from "react";
import DefaultProfile from "@/assets/img/default-profile.png";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

function RankingList({ rankingData = [] }) {
  // 랭킹 설명 팝업 표시 여부
  const [showTooltip, setShowTooltip] = useState(false);

  // 6개 초과로 보여줄 경우 수정
  const leftList = rankingData.slice(0, 3);
  const rightList = rankingData.slice(3, 6);

  return (
    <section className="mb-8 max-w-[920px] mx-auto px-2 pb-12">
      {/* 제목 + 랭킹 설명 */}
      <div className="flex items-center mb-3">
        <h2 className="text-lg font-semibold mr-2">선생님 랭킹</h2>

        {/* 랭킹 설명 (마우스 오버 시 팝업) */}
        <div
          className="mt-1 text-sm text-gray-500 relative cursor-pointer flex items-center"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <InformationCircleIcon className="w-5 h-5" />
          랭킹 설명
          {showTooltip && (
            <div
              className="
                absolute top-6 left-0
                w-[250px] p-3
                bg-white border border-gray-300
                rounded shadow-lg
                text-xs text-gray-700
                z-20
              "
            >
              선생님 랭킹은 수업횟수, 후기, 평점 등을
              <br />
              종합하여 산출됩니다.
            </div>
          )}
        </div>
      </div>

      {/* 큰 박스 (6개 리스트가 들어갈 박스) */}
      <div
        className="
          shadow-[0_2px_8px_rgba(0,0,0,0.1)]
          rounded-md
          p-2
          relative
          bg-white
          w-[860px] mx-auto
        "
      >
        {/* 가운데 세로 구분선 */}
        <div
          className="
            absolute
            top-4 bottom-4
            left-1/2
            w-[1px]
            bg-gray-300
            -translate-x-1/2
            z-10
          "
        />

        {/* 좌우 3개씩 (그리드: 3행 × 2열) */}
        <div
          className="
            grid
            grid-cols-2
            grid-rows-3
            gap-y-2
            items-center
          "
        >
          {Array.from({ length: 3 }).map((_, row) => {
            const leftItem = leftList[row]; // row=0,1,2
            const rightItem = rightList[row]; // row=0,1,2

            return (
              <React.Fragment key={row}>
                {/* 왼쪽 랭킹 */}
                <div className="flex justify-center">
                  {leftItem && (
                    <RankingItem
                      rankNumber={row + 1}
                      profileImage={leftItem.profileImage}
                      nickname={leftItem.nickname}
                      rankScore={leftItem.rankScore}
                    />
                  )}
                </div>

                {/* 오른쪽 랭킹 */}
                <div className="flex justify-center">
                  {rightItem && (
                    <RankingItem
                      rankNumber={row + 4} // 4,5,6
                      profileImage={rightItem.profileImage}
                      nickname={rightItem.nickname}
                      rankScore={rightItem.rankScore}
                    />
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// 각 항목(프로필 + 닉네임 + 랭킹 수치)
function RankingItem({ rankNumber, profileImage, nickname, rankScore }) {
  return (
    <div className="w-[420px] flex items-center p-2 bg-white">
      {/* 랭킹 번호 */}
      <span className="text-sm text-gray-600 ml-4 mr-2">{rankNumber}.</span>

      {/* 프로필 */}
      <div className="w-10 h-10 bg-white border border-gray-300 rounded-md overflow-hidden mr-2 flex-shrink-0">
        <img
          src={profileImage || DefaultProfile}
          alt="profile"
          className="object-cover w-full h-full"
        />
      </div>

      {/* 닉네임 (가운데 정렬) */}
      <span className="font-semibold text-gray-800 mr-auto">{nickname}</span>

      {/* 랭킹 수치 */}
      <span className="text-gray-600 text-sm mr-4">{rankScore}</span>
    </div>
  );
}

export default RankingList;
