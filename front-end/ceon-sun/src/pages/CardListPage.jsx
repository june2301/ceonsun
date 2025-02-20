import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import Filter from "../components/Filter";
import TopBar from "../components/TopBar";
import CardList from "../components/CardList";
import { memberAPI } from "../api/services/member";
import { chatAPI } from "../api/services/chat";
import Modal from "../components/Modal";

function CardListPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const role = user.role;

  // TopBar 메뉴 항목 (학생이 "선생님 리스트" 볼 때만 사용)
  const topBarItems = ["선생님 목록", "찜한 선생님", "선생님 랭킹"];
  const [selectedMenu, setSelectedMenu] = useState(
    location.state?.selectedMenu || 0,
  );

  // 카드 리스트 상태 관리
  const [cardList, setCardList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 필터 상태 관리
  const [filterState, setFilterState] = useState({
    categories: [],
    gender: "all",
    ageRange: { start: null, end: null },
  });

  // 페이지네이션 상태
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // 학생 카드 상세 정보를 저장할 상태
  const [expandedStudentData, setExpandedStudentData] = useState(null);

  // 모달 상태 관리 추가
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // API 호출 함수
  const fetchCardList = async () => {
    setLoading(true);
    try {
      // 학생이고 "선생님 랭킹" 메뉴 선택 시
      if (role === "STUDENT" && selectedMenu === 2) {
        const response = await memberAPI.getRankingList();
        setCardList(response);
        setTotalPages(1); // 랭킹은 페이지네이션 없음
      } else {
        // 기존 searchMembers API 호출
        const response = await memberAPI.searchMembers({
          userId: user.userId,
          categories: filterState.categories,
          gender: filterState.gender,
          ageRange: filterState.ageRange,
          page,
          size: 10,
        });

        setCardList(response.members);
        setTotalPages(response.pagination.totalPages);
      }
    } catch (err) {
      setError(err.message);
      console.error("카드 목록을 불러오는데 실패했습니다:", err);
    } finally {
      setLoading(false);
    }
  };

  // 필터 변경시 API 재호출
  useEffect(() => {
    // 랭킹 목록 조회 시에는 필터 변경 무시
    if (!(role === "STUDENT" && selectedMenu === 2)) {
      fetchCardList();
    }
  }, [filterState, page]);

  // 메뉴 선택 시 API 호출
  useEffect(() => {
    setPage(0); // 메뉴 변경 시 페이지 초기화
    fetchCardList();
  }, [selectedMenu]);

  // 필터 적용 핸들러
  const handleFilterChange = (newFilter) => {
    console.log("새로운 필터:", newFilter);
    setFilterState((prev) => ({ ...prev, ...newFilter }));
    // 필터 변경 시 페이지 초기화
    setPage(0);
  };

  // 실제 렌더링할 카드 목록과 카드 타입 결정
  let cardType = role === "STUDENT" ? "teacher" : "student";
  let showTopBar = role === "STUDENT";

  // 선생 카드에서 "자세히 보기" 클릭 시 TeacherDetail 페이지로 이동하는 함수
  const handleTeacherDetail = (cardData) => {
    navigate("/teacherdetailpage", {
      state: {
        teacher: cardData,
        previousTab: selectedMenu,
      },
    });
  };

  // 학생 카드에서 "자세히 보기" 클릭 시 해당 카드가 확장되도록 처리하는 함수
  const [expandedStudentIndex, setExpandedStudentIndex] = useState(null);
  const handleStudentListDetail = async (cardData, index) => {
    try {
      if (expandedStudentIndex === index) {
        // 이미 확장된 카드를 다시 클릭한 경우 닫기
        setExpandedStudentIndex(null);
        setExpandedStudentData(null);
      } else {
        // 새로운 카드를 클릭한 경우 상세 정보 가져오기
        const studentDetail = await memberAPI.getStudentDetail(cardData.id);
        setExpandedStudentIndex(index);
        setExpandedStudentData(studentDetail);
      }
    } catch (error) {
      console.error("학생 상세 정보를 불러오는데 실패했습니다:", error);
      // 에러 처리 (필요한 경우 사용자에게 알림)
    }
  };

  // 문의하기 버튼 클릭 시 모달 표시
  const handleInquiryClick = (studentData) => {
    setSelectedStudent(studentData);
    setIsModalOpen(true);
  };

  // 모달 확인 버튼 클릭 시 채팅방 생성
  const handleInquiryConfirm = async () => {
    try {
      const response = await chatAPI.createChatRoom(selectedStudent.id);
      console.log("채팅방 생성 성공:", response);
      setIsModalOpen(false);
      // 추가 처리 (예: 채팅방으로 이동)
    } catch (error) {
      console.error("채팅방 생성 실패:", error);
      alert("문의하기 기능 실행 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="h-[calc(100vh-96px)] w-full flex flex-col overflow-hidden">
      <div className="flex-1 flex justify-center overflow-hidden pt-5">
        {/* 왼쪽: 필터 */}
        <div className="flex-none w-[280px] h-full overflow-auto mr-2 pb-4 list-scrollbar">
          <Filter
            filterState={filterState}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* 오른쪽: 카드 리스트 영역 */}
        <div className="flex-none w-[620px] flex flex-col overflow-hidden">
          {showTopBar && (
            <div className="flex-none px-2">
              <TopBar
                menuItems={topBarItems}
                selectedIndex={selectedMenu}
                onSelectItem={(idx) => setSelectedMenu(idx)}
              />
            </div>
          )}

          {/* CardList */}
          <div className="flex-1 overflow-y-auto pt-2 pb-6 px-2 list-scrollbar">
            {loading ? (
              <div className="text-center py-4">로딩 중...</div>
            ) : error ? (
              <div className="text-center py-4 text-red-500">
                에러가 발생했습니다: {error}
              </div>
            ) : (
              <CardList
                type={cardType}
                cards={cardList}
                onDetailClick={
                  cardType === "teacher"
                    ? handleTeacherDetail
                    : handleStudentListDetail
                }
                expandedStudentIndex={expandedStudentIndex}
                expandedStudentData={expandedStudentData}
                isBackArrow={false}
                isInquiryMode={cardType === "student"}
                isRanking={role === "STUDENT" && selectedMenu === 2}
                onInquiry={handleInquiryClick} // 모달 표시 함수로 변경
              />
            )}
          </div>
        </div>
      </div>

      {/* 모달 추가 */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleInquiryConfirm}
        nickname={selectedStudent?.nickname}
        who="학생과"
        what="문의 채팅방을 생성하겠습니까?"
        notice="*문의 채팅방을 생성하면 생성 메시지가 전송됩니다."
      />
    </div>
  );
}

export default CardListPage;
