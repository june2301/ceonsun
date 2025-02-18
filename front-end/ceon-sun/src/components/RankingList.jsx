import React, { useState } from "react";
import DefaultProfile from "@/assets/img/default-profile.png";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { TrophyIcon, StarIcon } from "@heroicons/react/24/solid";

function RankingList({ rankingData = [] }) {
  // 랭킹 설명 팝업 표시 여부
  const [showTooltip, setShowTooltip] = useState(false);

  // 상위 3개만 사용
  const top3List = rankingData.slice(0, 3);

  // 순위별 아이콘 및 스타일
  const getRankingStyle = (rank) => {
    switch (rank) {
      case 0: // 1등
        return {
          icon: <TrophyIcon className="w-8 h-8 text-yellow-400" />,
          containerClass: "w-[200px]",
          imageClass: "w-36 h-36",
          textClass: "text-xl",
        };
      case 1: // 2등
        return {
          icon: <StarIcon className="w-7 h-7 text-gray-400" />,
          containerClass: "w-[160px]",
          imageClass: "w-28 h-28",
          textClass: "text-lg",
        };
      case 2: // 3등
        return {
          icon: <StarIcon className="w-6 h-6 text-amber-600" />,
          containerClass: "w-[160px]",
          imageClass: "w-28 h-28",
          textClass: "text-lg",
        };
      default:
        return {};
    }
  };

  return (
    <section className="mb-12 max-w-[920px] mx-auto px-2">
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
                absolute bottom-6 left-0
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

      {/* 랭킹 컨테이너 - 컨테이너만 너비 줄이고 가운데 정렬 */}
      <div className="flex justify-center">
        <div className="w-[860px] shadow-[0_2px_8px_rgba(0,0,0,0.1)] rounded-md p-6 relative bg-white">
          <div className="flex justify-center items-end gap-24">
            {top3List.map((item, index) => {
              const style = getRankingStyle(index);
              return (
                <div
                  key={index}
                  className={`flex flex-col items-center ${style.containerClass}`}
                >
                  {/* 순위 아이콘 */}
                  <div className="mb-2">{style.icon}</div>

                  {/* 프로필 이미지 */}
                  <div
                    className={`${style.imageClass} bg-white border-2 border-gray-300 rounded overflow-hidden mb-2`}
                  >
                    <img
                      src={item.profileImage || DefaultProfile}
                      alt={`${index + 1}등`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* 닉네임 */}
                  <div
                    className={`${style.textClass} font-bold text-gray-800 flex gap-2`}
                  >
                    <span className="text-gray-500 font-normal">닉네임 :</span>
                    <span>{item.nickname}</span>
                  </div>

                  {/* 랭킹 점수 */}
                  <div className="text-gray-600 mt-1 flex gap-2">
                    <span className="text-gray-500 font-normal">점수 :</span>
                    <span>{item.score}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default RankingList;
