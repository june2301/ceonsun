import React, { useState } from "react";
import Header from "../components/Header";
import CardExistBar from "../components/CardExistBar";
import LeftBar from "../components/LeftBar";
import MyInfo from "../components/MyInfo";

function MyPage() {
  // "student", "teacher", "none" 중 하나 (예제에서는 teacher로 설정)
  const userRole = useState("none");
  // 좌측 메뉴 선택 상태 (초기값은 "내 정보")
  const [selectedMenu, setSelectedMenu] = useState("내 정보");

  // 임시 데이터: 강사의 과외 체결 횟수
  const teacherLessonCount = 5;

  const handleMenuSelect = (menu) => {
    setSelectedMenu(menu);
  };

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 w-[900px] mx-auto flex flex-col">
        <CardExistBar userRole={userRole} />
        <div className="flex flex-1">
          <div className="w-[200px] flex-none">
            <LeftBar
              userRole={userRole}
              selectedMenu={selectedMenu}
              onMenuSelect={handleMenuSelect}
            />
          </div>
          <div className="w-[2px] bg-gray-300 h-full"></div>
          <div className="flex-1 p-6">
            {selectedMenu === "내 정보" && (
              <MyInfo
                userRole={userRole}
                teacherLessonCount={teacherLessonCount}
                name="김싸피"
                nickname="김김김"
                age="00"
                birthdate="0000.00.00"
                gender="남"
                profileImage=""
                isLarge={true}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyPage;
