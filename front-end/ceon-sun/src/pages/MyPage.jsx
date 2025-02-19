import React, { useState, useEffect } from "react";
import useAuthStore from "../stores/authStore";
import { memberAPI } from "../api/services/member";
import CardExistBar from "../components/CardExistBar";
import LeftBar from "../components/LeftBar";
import MyInfo from "../components/MyInfo";
import MyLecture from "../components/MyLecture";
import MyClass from "../components/MyClass";
import MyStudentList from "../components/MyStudentList";
import { useLocation } from "react-router-dom";

function MyPage() {
  const { user } = useAuthStore();
  const role = user.role; // store에서 role 가져오기
  const location = useLocation();
  const [selectedMenu, setSelectedMenu] = useState(
    location.state?.selectedMenu || "내 정보",
  );
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await memberAPI.getUserInfo(user.userId);
        setUserInfo(data);
      } catch (error) {
        console.error("사용자 정보 조회 실패:", error);
      }
    };

    if (selectedMenu === "내 정보") {
      fetchUserInfo();
    }
  }, [selectedMenu, user.userId]);

  const handleMenuSelect = (menu) => {
    setSelectedMenu(menu);
  };

  const handleProfileUpdate = (updatedData) => {
    setUserInfo({
      ...userInfo,
      nickname: updatedData.nickname,
      profileImage: updatedData.profileImage,
    });
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case "수강 정보":
        return <MyLecture role={role} />;
      case "수업 정보":
        return <MyClass role={role} />;
      case "내 학생 목록":
        return <MyStudentList />;
      default:
        return null;
    }
  };

  return (
    <div className="h-[calc(100vh-96px)] w-full flex flex-col overflow-hidden">
      <div className="flex-1 w-[900px] mx-auto flex flex-col overflow-hidden">
        <CardExistBar role={role} onMenuSelect={handleMenuSelect} />
        <div className="flex flex-1 overflow-hidden">
          <div className="w-[200px] flex-none">
            <LeftBar
              role={role}
              selectedMenu={selectedMenu}
              onMenuSelect={handleMenuSelect}
            />
          </div>
          <div className="w-[2px] bg-gray-300"></div>
          <div className="flex-1 overflow-hidden">
            {selectedMenu === "내 정보" && userInfo ? (
              <div className="p-6">
                <MyInfo
                  role={role}
                  teacherLessonCount={5}
                  userInfo={userInfo}
                  isLarge={true}
                  onProfileUpdate={handleProfileUpdate}
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
