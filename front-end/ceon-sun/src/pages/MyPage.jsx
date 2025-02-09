import React, { useState } from "react";
import CardExistBar from "../components/CardExistBar";
import LeftBar from "../components/LeftBar";
import MyInfo from "../components/MyInfo";
import MyLecture from "../components/MyLecture";
import MyClass from "../components/MyClass";
import MyStudentList from "../components/MyStudentList";

function MyPage() {
  // "student", "teacher", "none" 중 하나 (예제에서는 "none"으로 설정)
  const [userRole, setUserRole] = useState("none");
  // 좌측 메뉴 선택 상태 (초기값은 "내 정보")
  const [selectedMenu, setSelectedMenu] = useState("내 정보");

  const handleMenuSelect = (menu) => {
    setSelectedMenu(menu);
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case "수강 정보":
        return <MyLecture />;
      case "수업 정보":
        return <MyClass />;
      case "내 학생 목록":
        return <MyStudentList />;
      default:
        return null;
    }
  };

  return (
    <div className="h-[calc(100vh-96px)] w-full flex flex-col overflow-hidden">
      <div className="flex-1 w-[900px] mx-auto flex flex-col overflow-hidden">
        <CardExistBar userRole={userRole} />
        <div className="flex flex-1 overflow-hidden">
          {/* 왼쪽 사이드바 */}
          <div className="w-[200px] flex-none">
            <LeftBar
              userRole={userRole}
              selectedMenu={selectedMenu}
              onMenuSelect={handleMenuSelect}
            />
          </div>
          <div className="w-[2px] bg-gray-300"></div>
          {/* 오른쪽 메인 컨텐츠 영역 */}
          <div className="flex-1 overflow-hidden">
            {selectedMenu === "내 정보" ? (
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
            ) : (
              <div className="h-full">{renderContent()}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyPage;
