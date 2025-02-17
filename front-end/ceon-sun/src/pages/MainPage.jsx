import React, { useState, useEffect } from "react";
import PromotionLink from "../components/PromotionLink";
import CardListMain from "../components/CardListMain";
import RecentCardList from "../components/RecentCardList";
import RankingList from "../components/RankingList";
import { memberAPI } from "../api/services/member";
import { chatAPI } from "@/api/services/chat"; // 채팅방 목록 조회
import useAuthStore from "../stores/authStore";
import useWebSocketStore from "../stores/websocketStore";

// 예시 데이터 (임시)
const myTeacherCards = [
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

  // 소켓 + 구독 관련
  const stompClient = useWebSocketStore((state) => state.stompClient);
  const connected = useWebSocketStore((state) => state.connected);
  const addSubscription = useWebSocketStore((state) => state.addSubscription);
  const checkSubscriptions = useWebSocketStore(
    (state) => state.checkSubscriptions,
  );

  // 이미 구독을 했는지 여부
  const [hasSubscribed, setHasSubscribed] = useState(false);

  // 1) 메인페이지 마운트 시점: 채팅방 구독 (중복 방지)
  useEffect(() => {
    // connected && stompClient가 준비된 상태이고, 아직 구독이 안 됐다면
    if (connected && stompClient && !hasSubscribed) {
      (async () => {
        try {
          const rooms = await chatAPI.getChatRooms();
          console.log("[MainPage] Fetched rooms:", rooms);

          if (!rooms || rooms.length === 0) {
            console.log("[MainPage] 채팅방 목록이 없습니다.");
          } else {
            rooms.forEach((room) => {
              console.log(`[MainPage] Subscribing to room ${room.id}`);
              const subscription = stompClient.subscribe(
                `/queue/chat/${room.id}`,
                (frame) => {
                  console.log(
                    `[MainPage] 새 메시지 도착 - roomId: ${room.id}, 내용: `,
                    frame.body,
                  );
                },
              );
              addSubscription(room.id, subscription);
            });
          }

          // 구독 현황 확인
          checkSubscriptions();

          // 한 번 구독한 후에는 true로 바꿔서 재실행 방지
          setHasSubscribed(true);
        } catch (error) {
          console.error("[MainPage] 채팅방 목록 조회 중 오류:", error);
        }
      })();
    }
  }, [connected, stompClient, hasSubscribed]);
  // addSubscription, checkSubscriptions는 의존성에서 제외

  // 2) 최근 등록된 카드 목록 로딩
  useEffect(() => {
    // (옵션) 현재 구독 상태 확인 로그
    checkSubscriptions();

    const fetchRecentCards = async () => {
      try {
        const response = await memberAPI.searchMembers({
          userId,
          page: 0,
          size: 8,
        });

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
  }, [role, userId, checkSubscriptions]);

  // 3) 랭킹 데이터 로딩
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

  // 렌더링
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
