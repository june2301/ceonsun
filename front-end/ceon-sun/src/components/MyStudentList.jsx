import React, { useState, useEffect } from "react";
import TopBar from "./TopBar";
import CardList from "./CardList";
import { classAPI } from "../api/services/class";
import { memberAPI } from "../api/services/member";
import Modal from "./Modal";

function MyStudentList() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [expandedStudentIndex, setExpandedStudentIndex] = useState(null);
  const [expandedStudentData, setExpandedStudentData] = useState(null);
  const menuItems = ["신청 학생", "과외 학생", "종료 학생"];
  const [studentLists, setStudentLists] = useState({
    pending: [],
    progress: [],
    end: [],
  });
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    student: null,
    action: null, // 'accept' 또는 'reject'
  });

  // TopBar의 탭 선택 핸들러 추가
  const handleTabSelect = (index) => {
    // 탭이 변경될 때 expandedStudentIndex와 expandedStudentData 초기화
    setExpandedStudentIndex(null);
    setExpandedStudentData(null);
    setSelectedTab(index);
  };

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
      const response = await classAPI.getContractedMembers();

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
  const handleStudentDetail = async (student, index) => {
    try {
      if (expandedStudentIndex === index) {
        // 이미 열려있는 카드를 다시 클릭한 경우 닫기
        setExpandedStudentIndex(null);
        setExpandedStudentData(null);
      } else {
        // 학생 상세 정보 조회
        const detailData = await memberAPI.getStudentDetail(student.memberId);

        // 기존 student 데이터와 상세 정보 합치기
        const combinedData = {
          ...detailData,
          studentStatus: student.studentStatus,
          showAcceptButton: student.showAcceptButton,
          showRejectButton: student.showRejectButton,
          showRemainLessons: student.showRemainLessons,
          remainLessonsCnt: student.remainLessonsCnt,
          showClassroomButton: student.showClassroomButton,
        };

        setExpandedStudentData(combinedData);
        setExpandedStudentIndex(index);
      }
    } catch (error) {
      console.error("학생 상세 정보 조회 실패:", error);
    }
  };

  const handleModalClose = () => {
    setModalConfig({ isOpen: false, student: null, action: null });
  };

  const handleModalConfirm = async () => {
    const { student, action } = modalConfig;
    try {
      const response = await classAPI.respondToClassRequest(
        student.memberId,
        student.id,
        action === "accept" ? "ACCEPT" : "REJECT",
      );

      // 응답 상태 코드에 따른 alert 메시지
      if (response.status === 201) {
        alert("과외 신청이 수락되었습니다.");
      } else if (response.status === 204) {
        alert("과외 신청을 거절하였습니다.");
      }

      // 성공 후 목록 새로고침
      fetchPendingStudents();
      handleModalClose();
    } catch (error) {
      console.error("과외 신청 응답 실패:", error);
    }
  };

  // 수락 버튼 클릭 핸들러
  const handleAccept = (student) => {
    setModalConfig({
      isOpen: true,
      student,
      action: "accept",
    });
  };

  // 거절 버튼 클릭 핸들러
  const handleReject = (student) => {
    setModalConfig({
      isOpen: true,
      student,
      action: "reject",
    });
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
          onSelectItem={handleTabSelect}
        />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        <CardList
          cards={getStudentList()}
          type="student"
          showDetail={true}
          onDetailClick={handleStudentDetail}
          expandedStudentIndex={expandedStudentIndex}
          expandedStudentData={expandedStudentData}
          onAccept={handleAccept}
          onReject={handleReject}
          onClassEnter={handleClassEnter}
          onEndClass={handleEndClass}
          isBackArrow={false}
          isMyDetail={false}
          isInquiryMode={false}
        />
      </div>

      <Modal
        isOpen={modalConfig.isOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        nickname={modalConfig.student?.nickname || ""}
        who="학생의"
        what={`과외 신청을 ${
          modalConfig.action === "accept" ? "수락" : "거절"
        }하시겠습니까?`}
        notice=""
      />
    </div>
  );
}

export default MyStudentList;
