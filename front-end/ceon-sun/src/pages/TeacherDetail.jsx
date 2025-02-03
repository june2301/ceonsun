import React, { useState } from "react";
import Header from "../components/Header";
import TeacherAction from "../components/TeacherAction";
import TopBar from "../components/TopBar";
import TeacherInfoA from "../components/TeacherInfoA";
import TeacherInfoB from "../components/TeacherInfoB";

function TeacherDetail() {
  // 예시 Teacher 데이터 (실제 환경에서는 백엔드나 props로 받아올 수 있음)
  const teacher = {
    nickname: "김싸피",
    age: 34,
    gender: "남자",
    subjects: ["Python", "JavaScript", "Java"],
    lessonFee: 40000,
    introduction: `안녕하세요
저는 10년째 개발분야에 종사하고 있는 김싸피입니다.
다양한 분야를 다루어 봤으며 학습 효율이 높은 과외를 진행하고 있습니다.
...`,
    experience: `2015 ~ 2019 네이버 서비스 개발팀
...
...`,
    lessonInfo: `주 2회, 1회 2시간 정도 수업을 진행합니다.
온라인 / 오프라인 모두 가능합니다.
학생 수준에 맞춰 커리큘럼을 조정해드립니다.
...`,
  };

  // TopBar 메뉴 (두 탭)
  const topBarItems = ["선생님 소개", "수업설명"];
  const [selectedTab, setSelectedTab] = useState(0);

  // 탭 선택에 따른 메인 컨텐츠
  const mainContent =
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

  // 뒤로가기 핸들러 (예시)
  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden">
      {/* 상단 헤더 */}
      <Header />

      {/* 중앙 영역을 flex 컨테이너로 만들고 중앙 정렬 */}
      <div className="flex-1 flex justify-center overflow-hidden">
        {/* 고정 폭 컨테이너 (TeacherAction + 오른쪽 영역) */}
        <div className="flex w-[860px]">
          {/* 왼쪽: TeacherAction */}
          <TeacherAction teacher={teacher} onBack={handleBack} />

          {/* 오른쪽: TopBar와 Info 영역 */}
          <div className="flex flex-col pl-4 w-[600px]">
            {/* TopBar는 오른쪽 영역 상단에 위치하며 고정 폭 유지 */}
            <div className="mt-2">
              <TopBar
                menuItems={topBarItems}
                selectedIndex={selectedTab}
                onSelectItem={(idx) => setSelectedTab(idx)}
              />
            </div>
            {/* TeacherInfo 영역은 TopBar 아래, 오른쪽 영역의 폭과 동일하게 */}
            <div className="mt-2 flex-1 overflow-auto">{mainContent}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherDetail;
