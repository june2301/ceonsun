import React, { useState } from "react";
import TopBar from "./TopBar";
import TeacherInfoA from "./TeacherInfoA";
import TeacherInfoB from "./TeacherInfoB";
import TeacherInfoC from "./TeacherInfoC";

function TeacherDetail({ teacher, topBarItems, showClassButton = false }) {
  // 기본 탭 배열 (3개 탭)
  const defaultTabs = ["선생님 소개", "수업 설명", "수업 자료"];
  // topBarItems가 전달되면 해당 배열을 사용, 없으면 기본 배열 사용
  const items = topBarItems || defaultTabs;
  const [selectedTab, setSelectedTab] = useState(0);

  let mainContent;
  if (items.length === 2) {
    // 탭이 2개인 경우: TeacherInfoA와 TeacherInfoB만 렌더링
    mainContent =
      selectedTab === 0 ? (
        <TeacherInfoA
          introduction={teacher.introduction}
          experience={teacher.experience}
        />
      ) : (
        <TeacherInfoB
          subjects={teacher.subjects}
          lessonFee={teacher.lessonFee}
          lessonInfo={teacher.lessonInfo}
        />
      );
  } else {
    // 기본: 3개의 탭 사용
    mainContent =
      selectedTab === 0 ? (
        <TeacherInfoA
          introduction={teacher.introduction}
          experience={teacher.experience}
          teacher={teacher}
          showProfile={true}
        />
      ) : selectedTab === 1 ? (
        <TeacherInfoB
          subjects={teacher.subjects}
          lessonFee={teacher.lessonFee}
          lessonInfo={teacher.lessonInfo}
        />
      ) : (
        <TeacherInfoC materials={teacher.materials} />
      );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none">
        <TopBar
          menuItems={items}
          selectedIndex={selectedTab}
          onSelectItem={setSelectedTab}
        />
      </div>
      <div className="flex-1 pt-4 min-h-0 overflow-y-auto custom-scrollbar">
        {mainContent}
        {showClassButton && (
          <div className="flex justify-end p-4">
            <button className="px-4 py-2 border-2 border-gray-300 bg-white hover:bg-gray-300 font-bold text-gray-700 rounded">
              수업방 접속
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherDetail;
