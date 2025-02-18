import React, { useState, useEffect } from "react";
import TopBar from "./TopBar";
import CardList from "./CardList";
import { classAPI } from "../api/services/class";

function MyStudentList() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [expandedStudentIndex, setExpandedStudentIndex] = useState(null);
  const menuItems = ["신청 학생", "과외 학생", "종료 학생"];
  const [studentLists, setStudentLists] = useState({
    pending: [],
    progress: [],
    end: [],
  });

  // 신청 학생 리스트 조회
  const fetchPendingStudents = async () => {
    try {
      const response = await classAPI.getPendingStudents();
      const formattedStudents = response.content.map((student) => ({
        id: student.id,
        memberId: student.memberId,
        nickname: student.nickname,
        age: student.age,
        gender: student.gender === "MALE" ? "남" : "여",
        subjects: student.categories,
        profileImage: student.profileImageUrl,
        introduction: "", // API에서 제공하지 않는 정보
        studentStatus: "신청중",
        showDetail: true,
        showAcceptButton: true,
        showRejectButton: true,
      }));

      setStudentLists((prev) => ({
        ...prev,
        pending: formattedStudents,
      }));
    } catch (error) {
      console.error("신청 학생 목록 조회 실패:", error);
    }
  };

  // 과외/종료 학생 리스트 조회
  const fetchContractedStudents = async () => {
    try {
      const response = await classAPI.getContractedStudents();

      // PROGRESS와 END 상태에 따라 학생 데이터 분리
      const progressStudents = [];
      const endStudents = [];

      response.content.forEach((student) => {
        const baseStudent = {
          id: student.id,
          memberId: student.memberId,
          nickname: student.nickname,
          age: student.age,
          gender: student.gender === "MALE" ? "남" : "여",
          subjects: student.categories,
          profileImage: student.profileImageUrl,
          introduction: "",
          showDetail: true,
        };

        if (student.status === "PROGRESS") {
          progressStudents.push({
            ...baseStudent,
            studentStatus: "과외중",
            showRemainLessons: true,
            remainLessonsCnt: student.count,
            showClassroomButton: true,
          });
        } else if (student.status === "END") {
          endStudents.push({
            ...baseStudent,
            studentStatus: "과외 종료",
          });
        }
      });

      setStudentLists((prev) => ({
        ...prev,
        progress: progressStudents,
        end: endStudents,
      }));
    } catch (error) {
      console.error("과외/종료 학생 목록 조회 실패:", error);
    }
  };

  useEffect(() => {
    if (selectedTab === 0) {
      fetchPendingStudents();
    } else if (selectedTab === 1 || selectedTab === 2) {
      fetchContractedStudents();
    }
  }, [selectedTab]);

  const getStudentList = () => {
    switch (selectedTab) {
      case 0:
        return studentLists.pending;
      case 1:
        return studentLists.progress;
      case 2:
        return studentLists.end;
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
