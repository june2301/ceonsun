import React, { useState } from "react";
import Header from "../components/Header";
import Filter from "../components/Filter";
import TopBar from "../components/TopBar";
import CardList from "../components/CardList";

function CardListPage() {
  const userRole = "student"; // "student" 또는 "teacher"

  // TopBar 메뉴 항목 (학생이 "선생님 리스트" 볼 때만 사용)
  const topBarItems = ["선생님 목록", "찜한 선생님", "선생님 랭킹"];
  const [selectedMenu, setSelectedMenu] = useState(0);

  // 1) 선생님 카드 리스트를 보여줄 때 쓸 예시 데이터들
  const allTeachers = [
    {
      nickname: "선선선",
      age: 29,
      gender: "남자",
      subjects: ["Python", "Java", "JavaScript"],
    },
    {
      nickname: "선생님B",
      age: 35,
      gender: "여자",
      subjects: ["C++", "JavaScript"],
    },
    {
      nickname: "선생님C",
      age: 35,
      gender: "여자",
      subjects: ["C++", "JavaScript"],
    },
  ];
  const favoriteTeachers = [
    {
      nickname: "선생님Z",
      age: 33,
      gender: "여자",
      subjects: ["Go", "Rust"],
    },
  ];
  const rankingTeachers = [
    {
      nickname: "선생님Rank1",
      age: 38,
      gender: "여자",
      subjects: ["Python", "Flask", "Django"],
    },
    {
      nickname: "선생님Rank2",
      age: 50,
      gender: "남자",
      subjects: ["Java", "Spring Boot"],
    },
  ];

  // 2) 학생 카드 리스트를 보여줄 때 쓸 예시 데이터들
  const studentList = [
    {
      nickname: "학생A",
      profileImage: "",
      subjects: ["Python", "Java"],
    },
    {
      nickname: "학생B",
      profileImage: "",
      subjects: ["C++", "JavaScript"],
    },
    {
      nickname: "학생C",
      profileImage: "",
      subjects: ["Python", "Rust"],
    },
  ];

  // 실제로 렌더링할 카드 목록과 카드 종류("teacher" vs "student")
  let currentList = [];
  let cardType = "teacher";
  let showTopBar = false;

  if (userRole === "student") {
    // 학생 → 선생님 카드 리스트 보여주기
    showTopBar = true; // TopBar 보이기
    cardType = "teacher";
    // TopBar의 메뉴 선택값에 따라 선생님 목록 분기
    if (selectedMenu === 0) currentList = allTeachers;
    else if (selectedMenu === 1) currentList = favoriteTeachers;
    else currentList = rankingTeachers;
  } else {
    // 선생 → 학생 카드 리스트 보여주기
    showTopBar = false; // TopBar 숨기기
    cardType = "student";
    currentList = studentList;
  }

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden">
      <Header />

      {/* 메인 영역: 중앙 정렬 + 세로/가로 분할 */}
      <div className="flex-1 flex justify-center overflow-hidden pt-5">
        {/* 왼쪽: 필터 (280px 고정) */}
        <div className="flex-none w-[280px] h-full overflow-auto mr-2 pb-4 list-scrollbar">
          <Filter />
        </div>

        {/* 오른쪽: (선생님 / 학생) 카드 리스트 영역 */}
        <div className="flex-none w-[620px] flex flex-col overflow-hidden">
          {/* TopBar (학생시점일 때만) */}
          {showTopBar && (
            <div className="flex-none px-2">
              <TopBar
                menuItems={topBarItems}
                selectedIndex={selectedMenu}
                onSelectItem={(idx) => setSelectedMenu(idx)}
              />
            </div>
          )}

          {/* CardList (세로 스크롤) */}
          <div className="flex-1 overflow-y-auto pt-2 pb-6 px-2 list-scrollbar">
            {/* type="teacher" 또는 "student"로 카드 종류를 구분 */}
            <CardList type={cardType} cards={currentList} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardListPage;
