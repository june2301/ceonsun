import React, { useState, useEffect } from "react";
import StudentCardCreate from "./StudentCardCreate";
import StudentCard from "./StudentCard";
import CardList from "./CardList"; // 재사용 가능한 리스트 컴포넌트 (선생님 카드 목록용)
import StudentCardDetail from "./StudentCardDetail";
import TeacherDetail from "./TeacherDetail";
import { ArrowLongLeftIcon } from "@heroicons/react/24/solid";

function MyLecture() {
  // DB에서 학생 카드가 존재하는지 여부 (임시 시뮬레이션)
  const [studentCardExists, setStudentCardExists] = useState(false);
  // 내 학생 카드 Detail 모드 여부 (내 학생 카드의 "자세히 보기" 클릭 시 전환)
  const [isMyDetailMode, setIsMyDetailMode] = useState(false);
  // 내 학생 카드 업데이트(수정) 모드 여부 (Detail 모드에서 수정하기 버튼 클릭 시 전환)
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  // 선생님 상세 보기 모드
  const [teacherDetailMode, setTeacherDetailMode] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

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
      name: "Teacher One",
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
      introduction:
        "안녕하세요, 저는 Teacher1입니다. 열정적으로 학생들을 지도하고 있습니다.",
      experience: "2010 ~ 2015: Company A\n2015 ~ 2020: Company B",
      lessonFee: 50000,
      lessonInfo: "주 3회, 1시간 수업 진행, 온라인/오프라인 가능",
      materials: [
        { date: "2023.04.01(토)", fileUrl: "/files/teacher1_lesson1.pdf" },
        { date: "2023.04.08(토)", fileUrl: "/files/teacher1_lesson2.pdf" },
      ],
      onDetailClick: () => console.log("Teacher1 자세히 보기 클릭"),
    },
    {
      id: 2,
      nickname: "Teacher2",
      name: "Teacher Two",
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
      introduction:
        "안녕하세요, 저는 Teacher2입니다. 다양한 프로젝트 경험을 바탕으로 수업을 진행합니다.",
      experience: "2005 ~ 2010: Company C\n2010 ~ 2018: Company D",
      lessonFee: 60000,
      lessonInfo: "주 2회, 90분 수업 진행, 커리큘럼 맞춤형 수업",
      materials: [
        { date: "2023.04.02(일)", fileUrl: "/files/teacher2_lessonA.pdf" },
        { date: "2023.04.09(일)", fileUrl: "/files/teacher2_lessonB.pdf" },
      ],
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

  // 선생님 상세 보기 모드 전환 (시나리오 2: MyLecture 내에서 선생님 "자세히 보기" 버튼 클릭 시)
  const handleTeacherDetail = (card) => {
    setSelectedTeacher(card);
    setTeacherDetailMode(true);
  };

  // 선생님 상세 보기 모드 종료
  const handleTeacherDetailClose = () => {
    setTeacherDetailMode(false);
    setSelectedTeacher(null);
  };

  // 렌더링 분기
  if (teacherDetailMode) {
    // 시나리오 2: 선생님 상세 보기 모드가 활성화되면 MyLecture 전체를 TeacherDetail로 전환
    // TeacherDetail 컴포넌트는 내부 TopBar 탭 전환으로 TeacherInfoA, TeacherInfoB, TeacherInfoC를 표시합니다.
    const topBarItems = ["선생님 소개", "수업 설명", "수업 자료"];
    return (
      <div className="">
        <div className="ml-4 my-3 flex items-center justify-between">
          <button
            onClick={handleTeacherDetailClose}
            className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
          >
            <ArrowLongLeftIcon className="w-7 h-7" />
            <span className="font-bold">수강 정보</span>
          </button>
          <span>
            <span className="font-semibold text-gray-500 pr-2">
              잔여 수업 횟수 :
            </span>
            <span className="font-bold text-gray-600 pr-4">
              {selectedTeacher.remainLessonsCnt}
            </span>
            <button className="px-3 py-1.5 border-2 border-purple-600 bg-purple-500 hover:bg-purple-600 font-bold text-white rounded">
              수강료 결제하기
            </button>
          </span>
        </div>
        {/* 뒤로가기 영역 하단에 전체 너비 가로선 추가 */}
        <hr className="w-full mt-2 border-t-2 border-gray-300" />
        {/* TeacherDetail 컴포넌트 */}
        <TeacherDetail
          teacher={selectedTeacher}
          topBarItems={topBarItems}
          onBack={handleTeacherDetailClose}
        />
        <div className="flex justify-end pt-4">
          <button className="px-4 py-2 border-2 border-gray-300 bg-white hover:bg-gray-300 font-bold text-gray-700 rounded">
            수업방 접속
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pl-6 pr-4 py-6">
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
              onDetailClick={(card) => handleTeacherDetail(card)}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default MyLecture;
