import React, { useState } from "react";
import TeacherCard from "../components/TeacherCard";
import { PlayIcon } from "@heroicons/react/24/solid";

function RecentCardList({
  title = "최근 등록된 수업",
  teacherCards = [],
  onClickMore,
}) {
  const PAGE_SIZE = 4; // 2줄 x 2칸
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(teacherCards.length / PAGE_SIZE);
  const startIndex = currentPage * PAGE_SIZE;
  const pageData = teacherCards.slice(startIndex, startIndex + PAGE_SIZE);

  const handlePageClick = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  return (
    <section className="mb-8 max-w-[920px] mx-auto px-2">
      {/* 타이틀 + 이동하기 버튼 */}
      <div className="flex items-center mb-3">
        <h2 className="text-lg font-semibold mr-2">{title}</h2>
        {onClickMore && (
          <button
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
            onClick={onClickMore}
          >
            이동하기
            <PlayIcon className="w-3.5 h-3.5 ml-0.5" />
          </button>
        )}
      </div>

      {/* 그리드 구성: 2줄x2칸, 각 칸은 카드 폭만큼 auto, gap을 10px로 */}
      <div
        className="
          grid
          gap-[10px]
          place-content-center 
          justify-items-center 
        "
        style={{
          gridTemplateColumns: "repeat(2, auto)", // 2칸을 '내용물에 맞게'
          gridTemplateRows: "repeat(2, auto)", // 2줄을 '내용물에 맞게'
        }}
      >
        {pageData.map((card, idx) => (
          <div key={idx} className="w-[420px]">
            <TeacherCard {...card} />
          </div>
        ))}

        {/* 카드가 4개보다 적어도 2줄 × 2칸 레이아웃을 유지하기 위해 "빈칸" 채우기 */}
        {pageData.length < PAGE_SIZE &&
          Array.from({ length: PAGE_SIZE - pageData.length }).map((_, i) => (
            <div key={`empty-${i}`} className="w-[420px]" />
          ))}
      </div>

      {/* 페이지 번호 */}
      {totalPages > 1 && (
        <div className="mt-5 flex justify-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i).map((pIdx) => (
            <button
              key={pIdx}
              onClick={() => handlePageClick(pIdx)}
              className={`
                w-8 h-8 border border-gray-300 rounded
                ${
                  pIdx === currentPage
                    ? "bg-gray-300"
                    : "bg-white hover:bg-gray-100"
                }
              `}
            >
              {pIdx + 1}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

export default RecentCardList;
