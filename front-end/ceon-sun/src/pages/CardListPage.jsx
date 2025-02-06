import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Filter from "../components/Filter";
import TopBar from "../components/TopBar";
import CardList from "../components/CardList";

function CardListPage() {
  const navigate = useNavigate();
  const userRole = "teacher"; // "student" 또는 "teacher"

  // TopBar 메뉴 항목 (학생이 "선생님 리스트" 볼 때만 사용)
  const topBarItems = ["선생님 목록", "찜한 선생님", "선생님 랭킹"];
  const [selectedMenu, setSelectedMenu] = useState(0);

  // 1) 선생님 카드 리스트 예시 데이터
  const allTeachers = [
    {
      profileImage: "",
      nickname: "선선선",
      age: 29,
      gender: "남자",
      subjects: ["Python", "Java", "JavaScript"],
      // 선생 카드에서 표시할 추가 props
      showDetail: true,
      showAge: true,
      showGender: true,
      showRemainLessons: false,
      remainLessonsCnt: 0,
      showClassroomButton: false,
      classroomButtonOnTop: false,
      showPaymentButton: false,
    },
  ];
  const favoriteTeachers = [
    {
      profileImage: "",
      nickname: "선생님Z",
      age: 33,
      gender: "여자",
      subjects: ["Go", "Rust"],
      showDetail: true,
      showAge: true,
      showGender: true,
      showRemainLessons: false,
      remainLessonsCnt: 0,
      showClassroomButton: false,
      classroomButtonOnTop: false,
      showPaymentButton: false,
    },
  ];
  const rankingTeachers = [
    {
      profileImage: "",
      nickname: "선생님Rank1",
      age: 38,
      gender: "여자",
      subjects: ["Python", "Flask", "Django"],
      showDetail: true,
      showAge: true,
      showGender: true,
      showRemainLessons: false,
      remainLessonsCnt: 0,
      showClassroomButton: false,
      classroomButtonOnTop: false,
      showPaymentButton: false,
    },
  ];

  // 2) 학생 카드 리스트 예시 데이터
  const studentList = [
    {
      nickname: "학생A",
      name: "학생A 이름",
      age: 20,
      gender: "여자",
      profileImage: "",
      subjects: ["Python", "Java"],
      introduction: "학생A 소개글 내용",
      // 추가 props (전체 목록 조회 시 사용)
      isOwner: false,
      cardPublic: true,
      isListDetail: true,
    },
    {
      nickname: "학생A",
      name: "학생A 이름",
      age: 20,
      gender: "여자",
      profileImage: "",
      subjects: ["Python", "Java"],
      introduction: "학생A 소개글 내용",
      // 추가 props (전체 목록 조회 시 사용)
      isOwner: false,
      cardPublic: true,
      isListDetail: true,
    },
    {
      nickname: "학생A",
      name: "학생A 이름",
      age: 20,
      gender: "여자",
      profileImage: "",
      subjects: ["Python", "Java"],
      introduction: "학생A 소개글 내용",
      // 추가 props (전체 목록 조회 시 사용)
      isOwner: false,
      cardPublic: true,
      isListDetail: true,
    },
  ];

  // 실제 렌더링할 카드 목록과 카드 타입 결정
  let currentList = [];
  let cardType = "";
  let showTopBar = false;

  if (userRole === "student") {
    // 학생 → 선생님 카드 리스트 보여주기
    showTopBar = true;
    cardType = "teacher";
    if (selectedMenu === 0) currentList = allTeachers;
    else if (selectedMenu === 1) currentList = favoriteTeachers;
    else currentList = rankingTeachers;
  } else {
    // 선생 → 학생 카드 리스트 보여주기
    showTopBar = false;
    cardType = "student";
    currentList = studentList;
  }

  // 선생 카드에서 "자세히 보기" 클릭 시 TeacherDetail 페이지로 이동하는 함수
  const handleTeacherDetail = (cardData) => {
    navigate("/teacherdetail", { state: { teacher: cardData } });
  };

  // 학생 카드에서 "자세히 보기" 클릭 시 해당 카드가 확장되도록 처리하는 함수
  const [expandedStudentIndex, setExpandedStudentIndex] = useState(null);
  const handleStudentListDetail = (cardData, index) => {
    setExpandedStudentIndex((prevIndex) =>
      prevIndex === index ? null : index,
    );
  };

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden">
      <Header />

      {/* 메인 영역: 중앙 정렬 + 좌측 필터, 우측 카드 리스트 */}
      <div className="flex-1 flex justify-center overflow-hidden pt-5">
        {/* 왼쪽: 필터 */}
        <div className="flex-none w-[280px] h-full overflow-auto mr-2 pb-4 list-scrollbar">
          <Filter />
        </div>

        {/* 오른쪽: 카드 리스트 영역 */}
        <div className="flex-none w-[620px] flex flex-col overflow-hidden">
          {/* TopBar (학생 시점일 때만) */}
          {showTopBar && (
            <div className="flex-none px-2">
              <TopBar
                menuItems={topBarItems}
                selectedIndex={selectedMenu}
                onSelectItem={(idx) => setSelectedMenu(idx)}
              />
            </div>
          )}

          {/* CardList */}
          <div className="flex-1 overflow-y-auto pt-2 pb-6 px-2 list-scrollbar">
            {cardType === "teacher" ? (
              <CardList
                type={cardType}
                cards={currentList}
                onDetailClick={handleTeacherDetail}
              />
            ) : (
              <CardList
                type={cardType}
                cards={currentList}
                onDetailClick={handleStudentListDetail}
                expandedStudentIndex={expandedStudentIndex}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardListPage;
