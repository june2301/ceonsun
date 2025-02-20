import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "./TopBar";
import CardList from "./CardList";
import { classAPI } from "../api/services/class";
import { memberAPI } from "../api/services/member";
import { openviduAPI } from "../api/services/openvidu";
import useAuthStore from "../stores/authStore";
import Modal from "./Modal";

function MyStudentList() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
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
  const [endClassModalConfig, setEndClassModalConfig] = useState({
    isOpen: false,
    student: null,
  });

  // 알림용 Modal state 추가
  const [notificationModal, setNotificationModal] = useState({
    isOpen: false,
    message: "",
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

  // 수업방 입장 핸들러
  const handleClassEnter = async (student) => {
    try {
      console.log("수업방 입장 요청된 학생 정보:", student);
      const response = await openviduAPI.createToken(student.id);
      // console.log("수업방 세션 생성 응답:", response.data.token);
      const token = new URL(response.data.token).searchParams.get("token");
      console.log("토큰 :", token);

      if (response.status === 201) {
        navigate("/openvidu", {
          state: {
            token: token,
            contractedClassId: student.id,
            nickname: user.nickname,
          },
        });
      }
    } catch (error) {
      console.error("수업방 입장 실패:", error);
      alert("수업방 입장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 과외 종료 버튼 클릭 핸들러
  const handleEndClass = (student) => {
    setEndClassModalConfig({
      isOpen: true,
      student: student,
    });
  };

  // 과외 종료 Modal 닫기
  const handleEndClassModalClose = () => {
    setEndClassModalConfig({
      isOpen: false,
      student: null,
    });
  };

  // 과외 종료 확인
  const handleEndClassConfirm = async () => {
    try {
      console.log("과외 종료 요청:", {
        studentNickname: endClassModalConfig.student?.nickname,
        contractedClassId: endClassModalConfig.student?.id,
      });

      const response = await classAPI.endClass(endClassModalConfig.student.id);

      if (response.status === 204) {
        handleEndClassModalClose();
        // 알림 Modal 열기
        setNotificationModal({
          isOpen: true,
          message: "과외가 종료되었습니다.",
        });
        // 목록 새로고침
        fetchContractedStudents();
      }
    } catch (error) {
      console.error("과외 종료 실패:", error);
      alert("과외 종료 처리 중 오류가 발생했습니다.");
    }
  };

  // 알림 Modal 닫기
  const handleNotificationClose = () => {
    setNotificationModal({
      isOpen: false,
      message: "",
    });
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

      <Modal
        isOpen={endClassModalConfig.isOpen}
        onClose={handleEndClassModalClose}
        onConfirm={handleEndClassConfirm}
        nickname={endClassModalConfig.student?.nickname || ""}
        who="학생과의"
        what="과외를 종료하시겠습니까?"
        notice={
          "*과외 종료 후 다시 과외를 시작하려면\n과외 신청 과정이 필요합니다."
        }
      />

      {/* 알림용 Modal 추가 */}
      <Modal
        isOpen={notificationModal.isOpen}
        onClose={handleNotificationClose}
        onConfirm={handleNotificationClose}
        what={notificationModal.message}
        showCancelButton={false} // 확인 버튼만 표시
      />
    </div>
  );
}

export default MyStudentList;
