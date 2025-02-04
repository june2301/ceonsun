import React from "react";

function CardExistBar({ userRole }) {
  // userRole이 "none"일 때만 카드 작성 안내 바를 보여줍니다.
  if (userRole !== "none") return null;

  return (
    <div className="w-full py-5 bg-white flex justify-center border-b-2 border-gray-300">
      <div className="flex space-x-28">
        <button className="text-black-500 font-bold">학생 카드 작성하기</button>
        <button className="text-black-500 font-bold">
          선생 & 수업 등록하기
        </button>
      </div>
    </div>
  );
}

export default CardExistBar;
