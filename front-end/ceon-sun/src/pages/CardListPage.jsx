import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import Filter from "../components/Filter";
import TopBar from "../components/TopBar";
import CardList from "../components/CardList";
import { memberAPI } from "../api/services/member";

function CardListPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const role = user.role;

  // TopBar 메뉴 항목 (학생이 "선생님 리스트" 볼 때만 사용)
  const topBarItems = ["선생님 목록", "찜한 선생님", "선생님 랭킹"];
  const [selectedMenu, setSelectedMenu] = useState(0);

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

  // API 호출 함수
  const fetchCardList = async () => {
    setLoading(true);
    try {
      const response = await memberAPI.searchMembers({
        userId: user.id,
        categories: filterState.categories,
        gender: filterState.gender,
        ageRange: filterState.ageRange,
        page: 0,
        size: 10,
      });

      setCardList(response.members);
    } catch (err) {
      setError(err.message);
      console.error("카드 목록을 불러오는데 실패했습니다:", err);
    } finally {
      setLoading(false);
    }
  };

  // 필터 변경시 API 재호출
  useEffect(() => {
    fetchCardList();
  }, [filterState]);

  // 필터 적용 핸들러
  const handleFilterChange = (newFilter) => {
    setFilterState((prev) => ({ ...prev, ...newFilter }));
  };

  // 실제 렌더링할 카드 목록과 카드 타입 결정
  let cardType = role === "STUDENT" ? "teacher" : "student";
  let showTopBar = role === "STUDENT";

  // 1) 선생님 카드 리스트 예시 데이터
  const allTeachers = [
    {
      profileImage: "",
      nickname: "선선선",
      age: 29,
      gender: "남자",
      subjects: ["Python", "Java", "JavaScript"],
      // 선생 카드에서 표시할 추가 props
      showDetail: true,
      showAge: true,
      showGender: true,
      showRemainLessons: false,
      remainLessonsCnt: 0,
      showClassroomButton: false,
      classroomButtonOnTop: false,
      showPaymentButton: false,
    },
  ];
  const favoriteTeachers = [
    {
      profileImage: "",
      nickname: "선생님Z",
      age: 33,
      gender: "여자",
      subjects: ["Go", "Rust"],
      showDetail: true,
      showAge: true,
      showGender: true,
      showRemainLessons: false,
      remainLessonsCnt: 0,
      showClassroomButton: false,
      classroomButtonOnTop: false,
      showPaymentButton: false,
    },
  ];
  const rankingTeachers = [
    {
      profileImage: "",
      nickname: "선생님Rank1",
      age: 38,
      gender: "여자",
      subjects: ["Python", "Flask", "Django"],
      showDetail: true,
      showAge: true,
      showGender: true,
      showRemainLessons: false,
      remainLessonsCnt: 0,
      showClassroomButton: false,
      classroomButtonOnTop: false,
      showPaymentButton: false,
    },
  ];

  // 2) 학생 카드 리스트 예시 데이터
  const studentList = [
    {
      nickname: "학생A",
      name: "학생A 이름",
      age: 20,
      gender: "여자",
      profileImage: "",
      subjects: ["Python", "Java"],
      introduction: "학생A 소개글 내용",
      // 추가 props (전체 목록 조회 시 사용)
      isOwner: false,
      cardPublic: true,
      isListDetail: true,
    },
    {
      nickname: "학생A",
      name: "학생A 이름",
      age: 20,
      gender: "여자",
      profileImage: "",
      subjects: ["Python", "Java"],
      introduction: "학생A 소개글 내용",
      // 추가 props (전체 목록 조회 시 사용)
      isOwner: false,
      cardPublic: true,
      isListDetail: true,
    },
    {
      nickname: "학생A",
      name: "학생A 이름",
      age: 20,
      gender: "여자",
      profileImage: "",
      subjects: ["Python", "Java"],
      introduction: "학생A 소개글 내용",
      // 추가 props (전체 목록 조회 시 사용)
      isOwner: false,
      cardPublic: true,
      isListDetail: true,
    },
  ];

  // 선생 카드에서 "자세히 보기" 클릭 시 TeacherDetail 페이지로 이동하는 함수
  const handleTeacherDetail = (cardData) => {
    navigate("/teacherdetailpage", { state: { teacher: cardData } });
  };

  // 학생 카드에서 "자세히 보기" 클릭 시 해당 카드가 확장되도록 처리하는 함수
  const [expandedStudentIndex, setExpandedStudentIndex] = useState(null);
  const handleStudentListDetail = (cardData, index) => {
    setExpandedStudentIndex((prevIndex) =>
      prevIndex === index ? null : index,
    );
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
                isBackArrow={false}
                isInquiryMode={cardType === "student"}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardListPage;
