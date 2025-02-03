import React from "react";
import TeacherCard from "./TeacherCard";
import StudentCard from "./StudentCard";
import StudentCardDetail from "./StudentCardDetail";

function CardList({
  cards = [],
  type = "teacher", // "teacher" | "student"
  showDetail = true,
  // onDetailClick: 공통 콜백 (teacher의 경우 단순 호출, student의 경우 (cardData, index)를 인자로)
  onDetailClick,
  // 학생 카드에서 확장된 카드의 인덱스 (type이 "student"일 때만 사용)
  expandedStudentIndex = null,
}) {
  return (
    <div className="flex flex-col gap-4 w-[600px]">
      {cards.map((card, idx) => {
        if (type === "teacher") {
          return (
            <TeacherCard
              key={idx}
              nickname={card.nickname}
              profileImage={card.profileImage}
              age={card.age}
              gender={card.gender}
              subjects={card.subjects}
              showDetail={showDetail}
              showAge
              showGender
              onDetailClick={() => onDetailClick && onDetailClick(card)}
            />
          );
        } else {
          // type === "student"
          if (expandedStudentIndex === idx) {
            return (
              <StudentCardDetail
                key={idx}
                nickname={card.nickname}
                profileImage={card.profileImage}
                subjects={card.subjects}
                onDetailClick={() => onDetailClick && onDetailClick(card, idx)}
              />
            );
          } else {
            return (
              <StudentCard
                key={idx}
                nickname={card.nickname}
                subjects={card.subjects}
                profileImage={card.profileImage}
                showDetail={showDetail}
                onDetailClick={() => onDetailClick && onDetailClick(card, idx)}
              />
            );
          }
        }
      })}
    </div>
  );
}

export default CardList;
