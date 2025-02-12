import React from "react";
import TeacherCard from "./TeacherCard";
import StudentCard from "./StudentCard";
import StudentCardDetail from "./StudentCardDetail";

function CardList({
  cards = [],
  type = "teacher", // "teacher" | "student"
  showDetail = true,
  onDetailClick,
  expandedStudentIndex = null,
  expandedStudentData = null,
  isBackArrow = false,
  isMyDetail = false,
  isInquiryMode = false,
  onAccept,
  onReject,
  onClassEnter,
  onInquiry,
  onEndClass,
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
                key={`detail-${idx}`}
                {...card}
                {...expandedStudentData}
                studentStatus={card.studentStatus}
                onClose={() => onDetailClick(card, idx)}
                isListDetail={isInquiryMode}
                isMyDetail={isMyDetail}
                onAccept={() => onAccept && onAccept(card)}
                onReject={() => onReject && onReject(card)}
                onClassEnter={() => onClassEnter && onClassEnter(card)}
                onInquiry={() => onInquiry && onInquiry(card)}
                onEndClass={() => onEndClass && onEndClass(card)}
              />
            );
          } else {
            return (
              <StudentCard
                key={idx}
                nickname={card.nickname}
                profileImage={card.profileImage}
                subjects={card.subjects}
                introduction={card.introduction}
                showDetail={showDetail}
                onDetailClick={() => onDetailClick(card, idx)}
                studentStatus={card.studentStatus}
                showRemainLessons={card.showRemainLessons}
                remainLessonsCnt={card.remainLessonsCnt}
                showClassroomButton={card.showClassroomButton}
                showAcceptButton={card.showAcceptButton}
                showRejectButton={card.showRejectButton}
                isOwner={card.isOwner}
                cardPublic={card.cardPublic}
                isListDetail={card.isListDetail}
                onAccept={() => onAccept && onAccept(card)}
                onReject={() => onReject && onReject(card)}
                onClassEnter={() => onClassEnter && onClassEnter(card)}
              />
            );
          }
        }
      })}
    </div>
  );
}

export default CardList;
