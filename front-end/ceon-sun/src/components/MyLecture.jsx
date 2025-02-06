import React, { useState, useEffect } from "react";
import StudentCardCreate from "./StudentCardCreate";
import StudentCard from "./StudentCard";
import CardList from "./CardList"; // 재사용 가능한 리스트 컴포넌트 (선생님 카드 목록용)
import StudentCardDetail from "./StudentCardDetail";

function MyLecture() {
  // DB에서 학생 카드가 존재하는지 여부 (임시 시뮬레이션)
  const [studentCardExists, setStudentCardExists] = useState(false);
  // 내 학생 카드 Detail 모드 여부 (내 학생 카드의 "자세히 보기" 클릭 시 전환)
  const [isMyDetailMode, setIsMyDetailMode] = useState(false);
  // 내 학생 카드 업데이트(수정) 모드 여부 (Detail 모드에서 수정하기 버튼 클릭 시 전환)
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  // DB에서 가져온 내 학생 카드 데이터 (존재할 경우)
  const myStudentCard = {
    nickname: "나의닉네임",
    name: "나의 이름",
    age: 25,
    gender: "남",
    profileImage: "",
    subjects: ["Python", "JavaScript"],
    introduction: "내 소개글 내용",
    cardPublic: true,
  };

  // DB에서 가져온 선생님 카드 리스트 데이터 (예시 데이터)
  const teacherList = [
    {
      id: 1,
      nickname: "Teacher1",
      subjects: ["Java", "C++"],
      profileImage: "",
      showDetail: true,
      showAge: true,
      age: 35,
      showGender: true,
      gender: "여성",
      showRemainLessons: true,
      remainLessonsCnt: 5,
      showClassroomButton: true,
      classroomButtonOnTop: true,
      showPaymentButton: true,
      onDetailClick: () => console.log("Teacher1 자세히 보기 클릭"),
    },
    {
      id: 2,
      nickname: "Teacher2",
      subjects: ["Python", "JavaScript"],
      profileImage: "",
      showDetail: true,
      showAge: true,
      age: 40,
      showGender: true,
      gender: "남성",
      showRemainLessons: true,
      remainLessonsCnt: 3,
      showClassroomButton: true,
      classroomButtonOnTop: true,
      showPaymentButton: true,
      onDetailClick: () => console.log("Teacher2 자세히 보기 클릭"),
    },
    // 추가 데이터가 있을 경우 목록이 길어집니다.
  ];

  useEffect(() => {
    // TODO: 실제 API 호출 후 setStudentCardExists(true/false)
    // 현재는 임시로 학생 카드가 존재하는 경우로 설정합니다.
    setStudentCardExists(true);
  }, []);

  // 2번: 내 학생 카드 영역에서 "자세히 보기" 클릭 시 Detail 모드로 전환
  const handleStudentMyDetail = () => {
    setIsMyDetailMode(true);
  };

  // Detail 모드에서 닫기(뒤로가기) 클릭 시 Detail 모드 종료 및 업데이트 모드 초기화
  const handleMyDetailClose = () => {
    setIsMyDetailMode(false);
    setIsUpdateMode(false);
  };

  // Detail 모드에서 수정하기 버튼 클릭 시 업데이트(수정) 모드 전환
  const handleStudentUpdate = () => {
    setIsUpdateMode(true);
  };

  return (
    <div className="space-y-8">
      {!studentCardExists ? (
        // 학생 카드가 없으면 StudentCardCreate 컴포넌트를 보여줌
        <StudentCardCreate
          name="홍길동"
          nickname="홍길동"
          age="25"
          birthdate="1998.01.01"
          gender="남"
          profileImage=""
        />
      ) : isMyDetailMode ? (
        // Detail 모드: 내 학생 카드 Detail 또는 업데이트 모드 전환
        isUpdateMode ? (
          // 업데이트(수정) 모드: StudentCardCreate 컴포넌트를 updateMode로 전환하여 사용
          <StudentCardCreate
            name={myStudentCard.name}
            nickname={myStudentCard.nickname}
            age={myStudentCard.age}
            gender={myStudentCard.gender}
            profileImage={myStudentCard.profileImage}
            subjects={myStudentCard.subjects}
            introduction={myStudentCard.introduction}
            updateMode={true} // 업데이트 모드임을 표시
            onClose={() => {
              // 수정 모드 종료 후 Detail 모드로 돌아가려면:
              setIsUpdateMode(false);
            }}
          />
        ) : (
          // Detail 모드: 내 학생 카드 Detail만 보여줌
          <StudentCardDetail
            nickname={myStudentCard.nickname}
            name={myStudentCard.name}
            age={myStudentCard.age}
            gender={myStudentCard.gender}
            profileImage={myStudentCard.profileImage}
            subjects={myStudentCard.subjects}
            introduction={myStudentCard.introduction}
            isMyDetail={true}
            onClose={handleMyDetailClose}
            onUpdate={handleStudentUpdate}
            cardPublic={myStudentCard.cardPublic}
          />
        )
      ) : (
        // 기본 상태: 내 학생 카드와 수강 정보(CardList) 영역을 보여줌
        <>
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">나의 학생 카드</h2>
            <StudentCard
              nickname={myStudentCard.nickname}
              subjects={myStudentCard.subjects}
              profileImage={myStudentCard.profileImage}
              isOwner={true}
              cardPublic={myStudentCard.cardPublic}
              showDetail={true}
              onDetailClick={handleStudentMyDetail}
            />
          </div>
          <hr className="my-8 border-t border-gray-300" />
          <div>
            <h2 className="text-xl font-bold mb-4">수강 정보</h2>
            <CardList
              cards={teacherList}
              type="teacher"
              showDetail={true}
              onDetailClick={(card) =>
                console.log("Teacher detail clicked", card)
              }
            />
          </div>
        </>
      )}
    </div>
  );
}

export default MyLecture;
