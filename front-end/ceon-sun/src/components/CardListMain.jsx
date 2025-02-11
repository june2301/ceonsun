import React, { useState } from "react";
import TeacherCard from "../components/TeacherCard";
import StudentCard from "../components/StudentCard";
import { PlayIcon } from "@heroicons/react/24/solid";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

function CardListMain({
  userRole = "student", // "teacher" or "student"
  title = "내 목록",
  teacherCards = [], // 학생 역할일 때 표시할 선생님 카드 데이터
  studentCards = [], // 선생 역할일 때 표시할 학생 카드 데이터
  onClickMore,
}) {
  const PAGE_SIZE = 2;
  const [currentPage, setCurrentPage] = useState(0);

  // 사용자 역할에 맞게 "현재 보여줄 카드 배열" 결정
  const dataToShow = userRole === "teacher" ? studentCards : teacherCards;

  const totalPages = Math.ceil(dataToShow.length / PAGE_SIZE);
  const startIndex = currentPage * PAGE_SIZE;
  const pageData = dataToShow.slice(startIndex, startIndex + PAGE_SIZE);

  const goPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const goNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <section className="mb-8 max-w-[920px] mx-auto px-2">
      {/* 제목 + 이동하기 버튼 */}
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

      {/* 카드 리스트 + 좌우 버튼 + 하단 인디케이터 */}
      <div className="relative w-full">
        <button
          onClick={goPrevPage}
          className="
            absolute left-0
            top-1/2 -translate-y-1/2
            px-2 py-1
            text-gray-700
            z-10
          "
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>

        <button
          onClick={goNextPage}
          className="
            absolute right-0
            top-1/2 -translate-y-1/2
            px-2 py-1
            text-gray-700
            z-10
          "
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>

        <div className="overflow-hidden">
          <div className="flex flex-nowrap items-center justify-center gap-4 mt-2 mb-2">
            {pageData.map((item, idx) => (
              <div key={idx} className="flex-shrink-0 w-[410px]">
                {userRole === "teacher" ? (
                  // 선생이라면 StudentCard
                  <StudentCard {...item} />
                ) : (
                  // 학생이라면 TeacherCard
                  <TeacherCard {...item} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-3 flex justify-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i).map((pageIndex) => (
            <div
              key={pageIndex}
              onClick={() => setCurrentPage(pageIndex)}
              className={`
                w-3 h-3 rounded-full cursor-pointer
                ${
                  pageIndex === currentPage
                    ? "bg-blue-500"
                    : "bg-gray-300 hover:bg-gray-400"
                }
              `}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default CardListMain;
