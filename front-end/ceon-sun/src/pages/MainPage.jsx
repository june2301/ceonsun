import React, { useState, useEffect } from "react";
import PromotionLink from "../components/PromotionLink";
import CardListMain from "../components/CardListMain";
import RecentCardList from "../components/RecentCardList";
import RankingList from "../components/RankingList";
import { memberAPI } from "../api/services/member";
import useAuthStore from "../stores/authStore";

// 예시 데이터 (임시)
const myTeacherCards = [
  // 학생 입장에서 '내가 수강 중인 선생님들'
  {
    nickname: "선선선",
    subjects: ["Java", "Spring"],
    remainLessonsCnt: 6,
    showRemainLessons: true,
    showClassroomButton: true,
  },
  {
    nickname: "선선선",
    subjects: ["Java", "Spring", "Python", "Node.js", "Vue.js"],
    remainLessonsCnt: 2,
    showRemainLessons: true,
    showClassroomButton: true,
  },
  {
    nickname: "선선선",
    subjects: ["Java", "Spring"],
    remainLessonsCnt: 3,
    showRemainLessons: true,
    showClassroomButton: true,
  },
];

const myStudentCards = [
  // 선생 입장에서 '내가 가르치는 학생들' (예시)
  {
    nickname: "홍길동",
    subjects: ["Java", "Spring", "Python", "Node.js", "Vue.js"],
    showRemainLessons: true,
    remainLessonsCnt: 5,
    showClassroomButton: true,
  },
  {
    nickname: "김싸피",
    subjects: ["Java", "Spring"],
    showRemainLessons: true,
    remainLessonsCnt: 1,
    showClassroomButton: true,
  },
  {
    nickname: "이이이",
    subjects: ["Java", "Spring"],
    showRemainLessons: true,
    remainLessonsCnt: 2,
    showClassroomButton: true,
  },
];

function MainPage() {
  const {
    user: { userId, role },
  } = useAuthStore();
  const [recentCards, setRecentCards] = useState([]); // 최근 등록된 카드 목록
  const [rankingData, setRankingData] = useState([]);

  // 최근 등록된 카드 목록 로딩
  useEffect(() => {
    const fetchRecentCards = async () => {
      try {
        const response = await memberAPI.searchMembers({
          userId,
          page: 0,
          size: 8,
        });

        // 응답 데이터 가공
        const processedCards = response.members.map((member) => ({
          nickname: member.nickname,
          subjects: member.subjects,
          showDetail: false,
          showAge: false,
          showGender: false,
          age: member.age,
          gender: member.gender,
          profileImage: member.profileImage,
        }));

        setRecentCards(processedCards);
      } catch (error) {
        console.error("최근 카드 데이터 로딩 실패:", error);
        setRecentCards([]);
      }
    };

    if (role !== "GUEST") {
      fetchRecentCards();
    }
  }, [role, userId]);

  // 랭킹 데이터 로딩
  useEffect(() => {
    const fetchRankingData = async () => {
      try {
        const data = await memberAPI.getRankingList();
        setRankingData(data);
      } catch (error) {
        console.error("랭킹 데이터 로딩 실패:", error);
        setRankingData([]);
      }
    };

    fetchRankingData();
  }, []);

  return (
    <div className="w-full h-[calc(100vh-96px)] overflow-y-auto custom-scrollbar">
      <PromotionLink />

      {/* 내 수강 목록 or 내 학생 목록 */}
      <CardListMain
        userRole={role === "TEACHER" ? "teacher" : "student"}
        title={role === "TEACHER" ? "내 학생 목록" : "내 수강 목록"}
        teacherCards={role === "STUDENT" ? myTeacherCards : []}
        studentCards={role === "TEACHER" ? myStudentCards : []}
        onClickMore={() => console.log("목록 전체 이동")}
      />

      {/* 구분선 */}
      <hr className="mx-auto w-[900px] my-8 border-2 border-gray-300" />

      {/* 최근 등록된 수업/학생 카드 */}
      <RecentCardList
        title={role === "TEACHER" ? "최근 등록된 학생카드" : "최근 등록된 수업"}
        recentCards={recentCards}
        onClickMore={() => console.log("최근 등록된 수업/학생카드 전체 이동")}
      />

      {/* 구분선 */}
      <hr className="mx-auto w-[900px] my-8 border-2 border-gray-300" />

      {/* 선생님 랭킹 */}
      <RankingList rankingData={rankingData} />
    </div>
  );
}

export default MainPage;
