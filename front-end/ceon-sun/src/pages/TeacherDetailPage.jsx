import React from "react";
import Header from "../components/Header";
import TeacherAction from "../components/TeacherAction";
import TeacherDetail from "../components/TeacherDetail";

function TeacherDetailPage() {
  // 예시 Teacher 데이터 (실제 환경에서는 백엔드나 props 등으로 받아올 수 있음)
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
    additionalInfo: "추가 정보 예시",
  };

  // 뒤로가기 핸들러 (예시)
  const handleBack = () => {
    window.history.back();
  };

  // TeacherDetailPage에서는 TopBar 탭을 2개만 사용하도록 배열을 전달합니다.
  const topBarItems = ["선생님 소개", "수업 설명"];

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 flex justify-center overflow-hidden">
        <div className="flex w-[860px]">
          {/* 왼쪽: TeacherAction */}
          <TeacherAction teacher={teacher} onBack={handleBack} />
          {/* 오른쪽: TeacherDetail 컴포넌트 */}
          <div className="flex flex-col pl-2 w-full">
            <TeacherDetail teacher={teacher} topBarItems={topBarItems} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherDetailPage;
