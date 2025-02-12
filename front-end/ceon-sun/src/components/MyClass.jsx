import React, { useState, useEffect } from "react";
import TopBar from "../components/TopBar";
import TeacherInfoCreateA from "../components/TeacherInfoCreateA";
import TeacherInfoCreateB from "../components/TeacherInfoCreateB";
import TeacherInfoA from "../components/TeacherInfoA";
import TeacherInfoB from "../components/TeacherInfoB";
import useAuthStore from "../stores/authStore";
import { memberAPI } from "../api/services/member";

function MyClass({ role }) {
  const [teacherCardExists, setTeacherCardExists] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const { user } = useAuthStore();

  // 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await memberAPI.getUserInfo(user.userId);
        setUserInfo(data);
      } catch (error) {
        console.error("사용자 정보 조회 실패:", error);
      }
    };

    fetchUserInfo();
  }, [user.userId]);

  useEffect(() => {
    // role이 GUEST면 무조건 false, 아니면 API 호출하여 카드 존재 여부 확인
    if (role === "GUEST") {
      setTeacherCardExists(false);
    } else {
      // TODO: 실제 API 호출 후 setTeacherCardExists(true/false)
      setTeacherCardExists(true); // 임시로 true 설정
    }
  }, [role]);

  const handleTabSelect = (tabIndex) => {
    setSelectedTab(tabIndex);
  };

  // Detail 모드에서 수정하기 버튼 클릭 시 업데이트(수정) 모드 전환
  const handleTeacherUpdate = () => {
    setIsUpdateMode(true);
  };

  const menuItems = ["선생님 소개", "수업 설명"];

  // 예시 데이터 - 실제로는 API 응답으로 받아올 데이터
  const teacherInfo = {
    introduction:
      "안녕하세요, 저는 Teacher1입니다. 열정적으로 학생들을 지도하고 있습니다.",
    experience: "2010 ~ 2015: Company A\n2015 ~ 2020: Company B",
    subjects: ["Java", "C++", "Python"],
    lessonFee: 50000,
    lessonInfo: "주 3회, 1시간 수업 진행, 온라인/오프라인 가능",
    contactPublic: true,
  };

  if (!user?.userId) {
    return null; // 또는 로딩 컴포넌트
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="p-4 pb-0">
        <TopBar
          menuItems={menuItems}
          selectedIndex={selectedTab}
          onSelectItem={handleTabSelect}
        />
      </div>

      <div className="flex-1 relative">
        <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-4 pt-4">
          {!teacherCardExists ? (
            // 선생님 카드가 없을 때 TeacherInfoCreate 컴포넌트를 보여줌
            selectedTab === 0 ? (
              <TeacherInfoCreateA
                name={userInfo?.name}
                nickname={userInfo?.nickname}
                age={userInfo?.age}
                birthdate={userInfo?.birthdate}
                gender={userInfo?.gender}
                profileImage={userInfo?.profileImage}
              />
            ) : (
              <TeacherInfoCreateB />
            )
          ) : isUpdateMode ? (
            // 업데이트(수정) 모드
            selectedTab === 0 ? (
              <TeacherInfoCreateA
                name={userInfo?.name}
                nickname={userInfo?.nickname}
                age={userInfo?.age}
                birthdate={userInfo?.birthdate}
                gender={userInfo?.gender}
                profileImage={userInfo?.profileImage}
                introduction={teacherInfo.introduction}
                experience={teacherInfo.experience}
                contactPublic={teacherInfo.contactPublic}
                updateMode={true}
                onClose={() => setIsUpdateMode(false)}
              />
            ) : (
              <TeacherInfoCreateB
                subjects={teacherInfo.subjects}
                lessonInfo={teacherInfo.lessonInfo}
                lessonFee={teacherInfo.lessonFee}
                updateMode={true}
                onClose={() => setIsUpdateMode(false)}
              />
            )
          ) : (
            <div className="flex flex-col">
              {selectedTab === 0 ? (
                <TeacherInfoA
                  name={userInfo?.name}
                  nickname={userInfo?.nickname}
                  age={userInfo?.age}
                  birthdate={userInfo?.birthdate}
                  gender={userInfo?.gender}
                  profileImage={userInfo?.profileImage}
                  introduction={teacherInfo.introduction}
                  experience={teacherInfo.experience}
                  showProfile={true}
                  teacher={teacherInfo}
                />
              ) : (
                <TeacherInfoB
                  subjects={teacherInfo.subjects}
                  lessonFee={teacherInfo.lessonFee}
                  lessonInfo={teacherInfo.lessonInfo}
                />
              )}
              {/* 수정하기 버튼 */}
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleTeacherUpdate}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  수정하기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyClass;
