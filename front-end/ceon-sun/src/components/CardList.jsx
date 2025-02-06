import React from "react";
import TeacherCard from "./TeacherCard";
import StudentCard from "./StudentCard";
import StudentCardDetail from "./StudentCardDetail";

function CardList({
  cards = [],
  type = "teacher", // "teacher" | "student"
  showDetail = true,
  onDetailClick,
  // 학생 카드에서 확장된 카드의 인덱스 (type이 "student"일 때만 사용)
  expandedStudentIndex = null,
}) {
  return (
    <div className="flex flex-col gap-4">
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
              onDetailClick={() => onDetailClick && onDetailClick(card)}
              showAge={card.showAge}
              showGender={card.showGender}
              showRemainLessons={card.showRemainLessons}
              remainLessonsCnt={card.remainLessonsCnt}
              showClassroomButton={card.showClassroomButton}
              classroomButtonOnTop={card.classroomButtonOnTop}
              showPaymentButton={card.showPaymentButton}
            />
          );
        } else {
          // type === "student"
          if (expandedStudentIndex === idx) {
            return (
              <StudentCardDetail
                key={idx}
                nickname={card.nickname}
                name={card.name}
                age={card.age}
                gender={card.gender}
                profileImage={card.profileImage}
                subjects={card.subjects}
                introduction={card.introduction}
                showDetail={showDetail}
                onClose={() => onDetailClick && onDetailClick(card, idx)} // 변경: onDetailClick 대신 onClose로 전달
                isListDetail={true}
              />
            );
          } else {
            return (
              <StudentCard
                key={idx}
                nickname={card.nickname}
                profileImage={card.profileImage}
                subjects={card.subjects}
                showDetail={showDetail}
                onDetailClick={() => onDetailClick && onDetailClick(card, idx)}
                isOwner={card.isOwner}
                cardPublic={card.cardPublic}
                isListDetail={card.isListDetail}
              />
            );
          }
        }
      })}
    </div>
  );
}

export default CardList;
