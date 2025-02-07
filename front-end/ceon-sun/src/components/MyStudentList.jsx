import React, { useState } from "react";
import TopBar from "./TopBar";
import CardList from "./CardList";

function MyStudentList() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [expandedStudentIndex, setExpandedStudentIndex] = useState(null);
  const menuItems = ["신청 학생", "과외 학생", "종료 학생"];

  // 예시 데이터
  const studentLists = {
    pending: [
      {
        nickname: "학생1",
        name: "학생1",
        age: "20",
        gender: "남",
        subjects: ["Python", "Java"],
        profileImage: "",
        introduction: "안녕하세요\n열심히 하겠습니다.",
        studentStatus: "신청중",
        showDetail: true,
        showAcceptButton: true,
        showRejectButton: true,
      },
      {
        nickname: "학생1",
        name: "학생1",
        age: "20",
        gender: "남",
        subjects: ["Python", "Java"],
        profileImage: "",
        introduction: "안녕하세요\n열심히 하겠습니다.",
        studentStatus: "신청중",
        showDetail: true,
        showAcceptButton: true,
        showRejectButton: true,
      },
      {
        nickname: "학생1",
        name: "학생1",
        age: "20",
        gender: "남",
        subjects: ["Python", "Java"],
        profileImage: "",
        introduction: "안녕하세요\n열심히 하겠습니다.",
        studentStatus: "신청중",
        showDetail: true,
        showAcceptButton: true,
        showRejectButton: true,
      },
    ],
    active: [
      {
        nickname: "학생3",
        name: "학생3",
        age: "22",
        gender: "여",
        subjects: ["Python", "JavaScript"],
        profileImage: "",
        introduction: "열심히 공부중입니다.",
        studentStatus: "과외중",
        showDetail: true,
        showRemainLessons: true,
        remainLessonsCnt: 5,
        showClassroomButton: true,
      },
    ],
    completed: [
      {
        nickname: "학생5",
        name: "학생5",
        age: "25",
        gender: "남",
        subjects: ["C++"],
        profileImage: "",
        introduction: "감사했습니다.",
        studentStatus: "과외 종료",
        showDetail: true,
      },
    ],
  };

  const getStudentList = () => {
    switch (selectedTab) {
      case 0:
        return studentLists.pending;
      case 1:
        return studentLists.active;
      case 2:
        return studentLists.completed;
      default:
        return [];
    }
  };

  // 자세히 보기 처리
  const handleStudentDetail = (student, index) => {
    setExpandedStudentIndex((prevIndex) =>
      prevIndex === index ? null : index,
    );
  };

  // 버튼 클릭 핸들러들
  const handleAccept = (student) => {
    console.log("수락:", student);
    // TODO: 수락 처리 로직
  };

  const handleReject = (student) => {
    console.log("거절:", student);
    // TODO: 거절 처리 로직
  };

  const handleClassEnter = (student) => {
    console.log("수업방 입장:", student);
    // TODO: 수업방 입장 처리 로직
  };

  const handleEndClass = (student) => {
    console.log("과외 종료:", student);
    // TODO: 과외 종료 처리 로직
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none p-4 pb-0">
        <TopBar
          menuItems={menuItems}
          selectedIndex={selectedTab}
          onSelectItem={setSelectedTab}
        />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        <CardList
          cards={getStudentList()}
          type="student"
          showDetail={true}
          onDetailClick={handleStudentDetail}
          expandedStudentIndex={expandedStudentIndex}
          onAccept={handleAccept}
          onReject={handleReject}
          onClassEnter={handleClassEnter}
          onEndClass={handleEndClass}
          isBackArrow={false}
          isMyDetail={false}
          isInquiryMode={false}
        />
      </div>
    </div>
  );
}

export default MyStudentList;
