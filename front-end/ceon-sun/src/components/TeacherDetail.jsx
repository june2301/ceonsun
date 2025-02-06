import React, { useState } from "react";
import TopBar from "./TopBar";
import TeacherInfoA from "./TeacherInfoA";
import TeacherInfoB from "./TeacherInfoB";
import TeacherInfoC from "./TeacherInfoC";

function TeacherDetail({ teacher, topBarItems }) {
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
    <div className="flex flex-col px-4 w-full">
      <div className="mt-2">
        <TopBar
          menuItems={items}
          selectedIndex={selectedTab}
          onSelectItem={(idx) => setSelectedTab(idx)}
        />
      </div>
      <div className="mt-2 flex-1 overflow-auto">{mainContent}</div>
    </div>
  );
}

export default TeacherDetail;
