import React, { useState } from "react";
import Header from "../components/Header";
import CardExistBar from "../components/CardExistBar";
import LeftBar from "../components/LeftBar";
import MyInfo from "../components/MyInfo";
import MyLecture from "../components/MyLecture"; // MyLecture 컴포넌트를 임포트

function MyPage() {
  // "student", "teacher", "none" 중 하나 (예제에서는 "none"으로 설정)
  const [userRole, setUserRole] = useState("none");
  // 좌측 메뉴 선택 상태 (초기값은 "내 정보")
  const [selectedMenu, setSelectedMenu] = useState("내 정보");

  const handleMenuSelect = (menu) => {
    setSelectedMenu(menu);
  };

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 w-[900px] mx-auto flex flex-col">
        <CardExistBar userRole={userRole} />
        <div className="flex flex-1">
          {/* 왼쪽 사이드바 */}
          <div className="w-[200px] flex-none">
            <LeftBar
              userRole={userRole}
              selectedMenu={selectedMenu}
              onMenuSelect={handleMenuSelect}
            />
          </div>
          <div className="w-[2px] bg-gray-300"></div>
          {/* 오른쪽 메인 컨텐츠 영역 (overflow-y-auto 제거) */}
          <div className="flex-1">
            {selectedMenu === "내 정보" && (
              <div className="p-6">
                <MyInfo
                  userRole={userRole}
                  teacherLessonCount={5}
                  name="김싸피"
                  nickname="김김김"
                  age="00"
                  birthdate="0000.00.00"
                  gender="남"
                  profileImage=""
                  isLarge={true}
                />
              </div>
            )}
            {selectedMenu === "수강 정보" && (
              // 상대 위치 컨테이너를 만들고, 그 안에 절대 위치로 스크롤 영역을 구성합니다.
              <div className="relative h-full">
                <div className="absolute inset-0 overflow-y-auto custom-scrollbar pl-6 pr-4 py-6">
                  <MyLecture />
                </div>
              </div>
            )}
            {/* 추후 다른 메뉴("수업 정보", "내 학생 목록" 등)도 추가 가능 */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyPage;
