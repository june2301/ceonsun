import React from "react";
import TeacherCard from "./TeacherCard";
import StudentCard from "./StudentCard";

function CardList({
  cards = [],
  type = "teacher", // "teacher" | "student"
  showDetail = true,
}) {
  return (
    <div className="flex flex-col gap-4 w-[600px]">
      {cards.map((card, idx) => {
        if (type === "teacher") {
          // TeacherCard 렌더링
          return (
            <TeacherCard
              key={idx}
              nickname={card.nickname}
              age={card.age}
              gender={card.gender}
              subjects={card.subjects}
              showDetail={showDetail}
              showAge
              showGender
            />
          );
        } else {
          // StudentCard 렌더링
          return (
            <StudentCard
              key={idx}
              nickname={card.nickname}
              subjects={card.subjects}
              profileImage={card.profileImage}
              showDetail={showDetail}
            />
          );
        }
      })}
    </div>
  );
}

export default CardList;
