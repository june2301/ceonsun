import React from "react";
import PromotionLink from "../components/PromotionLink";
import CardListMain from "../components/CardListMain";
import RecentCardList from "../components/RecentCardList";
import RankingList from "../components/RankingList";

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

// 최근 등록된 수업(선생 카드) 예시 데이터
const recentLessonData = [
  { nickname: "선선선", subjects: ["Python", "JavaScript"] },
  { nickname: "선선선", subjects: ["Python", "JavaScript"] },
  { nickname: "선선선", subjects: ["Python", "JavaScript"] },
  { nickname: "선선선", subjects: ["Python", "JavaScript"] },
  { nickname: "선선선", subjects: ["Python", "JavaScript"] },
];

// 랭킹 컴포넌트 예시
const rankingData = [
  {
    id: 1,
    profileImage: "",
    nickname: "선생님1",
    rankScore: "랭킹 수치",
  },
  {
    id: 2,
    profileImage: "",
    nickname: "선생님2",
    rankScore: "랭킹 수치",
  },
  {
    id: 3,
    profileImage: "",
    nickname: "선생님3",
    rankScore: "랭킹 수치",
  },
  {
    id: 4,
    profileImage: "",
    nickname: "선생님4",
    rankScore: "랭킹 수치",
  },
  {
    id: 5,
    profileImage: "",
    nickname: "선생님5",
    rankScore: "랭킹 수치",
  },
  {
    id: 6,
    profileImage: "",
    nickname: "선생님6",
    rankScore: "랭킹 수치",
  },
];

function MainPage() {
  // 현재 사용자 역할 (임시로 teacher 로 해둠)
  // => "student" 일 경우, CardListMain은 teacherCards를 이용해 선생카드 렌더
  // => "teacher" 일 경우, CardListMain은 studentCards를 이용해 학생카드 렌더
  const userRole = "student"; // "student" or "teacher"

  return (
    <div className="w-full">
      <PromotionLink />

      {/* 내 수강 목록 or 내 학생 목록 */}
      <CardListMain
        userRole={userRole}
        // userRole이 teacher면 "내 학생 목록", student면 "내 수강 목록"
        title={userRole === "teacher" ? "내 학생 목록" : "내 수강 목록"}
        // (학생일 경우) 내가 수강 중인 선생카드 목록
        teacherCards={myTeacherCards}
        // (선생일 경우) 내가 가르치는 학생카드 목록
        studentCards={myStudentCards}
        onClickMore={() => console.log("목록 전체 이동")}
      />

      {/* 구분선 */}
      <hr className="mx-auto w-[900px] my-8 border-2 border-gray-300" />

      {/* 최근 등록된 수업 (TeacherCard) */}
      <RecentCardList
        title="최근 등록된 수업"
        teacherCards={recentLessonData}
        onClickMore={() => console.log("최근 등록된 수업 전체 이동")}
      />

      {/* 구분선 */}
      <hr className="mx-auto w-[900px] my-8 border-2 border-gray-300" />

      {/* 선생님 랭킹 */}
      <RankingList rankingData={rankingData} />
    </div>
  );
}

export default MainPage;
