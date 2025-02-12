import React, { useState, useEffect, useMemo } from "react";
import StudentCardCreate from "./StudentCardCreate";
import StudentCard from "./StudentCard";
import CardList from "./CardList"; // 재사용 가능한 리스트 컴포넌트 (선생님 카드 목록용)
import StudentCardDetail from "./StudentCardDetail";
import TeacherDetail from "./TeacherDetail";
import { ArrowLongLeftIcon } from "@heroicons/react/24/solid";
import useAuthStore from "../stores/authStore";
import { memberAPI } from "../api/services/member";

function MyLecture({ role }) {
  const [isMyDetailMode, setIsMyDetailMode] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [teacherDetailMode, setTeacherDetailMode] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [studentCard, setStudentCard] = useState(null);
  const { user } = useAuthStore();

  // DB에서 가져온 선생님 카드 리스트 데이터 (예시 데이터)
  const teacherList = [
    {
      id: 1,
      nickname: "Teacher1",
      name: "Teacher One",
      subjects: ["Java", "C++"],
      profileImage: "",
      showDetail: true,
      showAge: true,
      age: 35,
      showGender: true,
      gender: "여성",
      showRemainLessons: true,
      remainLessonsCnt: 5,
      showClassroomButton: true,
      classroomButtonOnTop: true,
      showPaymentButton: true,
      introduction:
        "안녕하세요, 저는 Teacher1입니다. 열정적으로 학생들을 지도하고 있습니다.",
      experience:
        "2010 ~ 2015: Company A\n2010 ~ 2015: Company A\n2010 ~ 2015: Company A\n2010 ~ 2015: Company A\n2010 ~ 2015: Company A\n2015 ~ 2020: Company B\n2015 ~ 2020: Company B\n2015 ~ 2020: Company B\n2015 ~ 2020: Company B\n2015 ~ 2020: Company B",
      lessonFee: 50000,
      lessonInfo: "주 3회, 1시간 수업 진행, 온라인/오프라인 가능",
      materials: [
        { date: "2023.04.01(토)", fileUrl: "/files/teacher1_lesson1.pdf" },
        { date: "2023.04.08(토)", fileUrl: "/files/teacher1_lesson2.pdf" },
      ],
      onDetailClick: () => console.log("Teacher1 자세히 보기 클릭"),
    },
    {
      id: 2,
      nickname: "Teacher2",
      name: "Teacher Two",
      subjects: ["Python", "JavaScript"],
      profileImage: "",
      showDetail: true,
      showAge: true,
      age: 40,
      showGender: true,
      gender: "남성",
      showRemainLessons: true,
      remainLessonsCnt: 3,
      showClassroomButton: true,
      classroomButtonOnTop: true,
      showPaymentButton: true,
      introduction:
        "안녕하세요, 저는 Teacher2입니다. 다양한 프로젝트 경험을 바탕으로 수업을 진행합니다.",
      experience: "2005 ~ 2010: Company C\n2010 ~ 2018: Company D",
      lessonFee: 60000,
      lessonInfo: "주 2회, 90분 수업 진행, 커리큘럼 맞춤형 수업",
      materials: [
        { date: "2023.04.02(일)", fileUrl: "/files/teacher2_lessonA.pdf" },
        { date: "2023.04.09(일)", fileUrl: "/files/teacher2_lessonB.pdf" },
      ],
      onDetailClick: () => console.log("Teacher2 자세히 보기 클릭"),
    },
    // 추가 데이터가 있을 경우 목록이 길어집니다.
  ];

  // userInfo와 studentCard 데이터 조회
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 사용자 기본 정보 조회
        const userInfoData = await memberAPI.getUserInfo(user.userId);
        setUserInfo(userInfoData);

        // role이 STUDENT일 때만 학생 카드 정보 조회
        if (role === "STUDENT") {
          const studentCardData = await memberAPI.getStudentCard(user.userId);
          setStudentCard(studentCardData);
          console.log("학생 카드 데이터:", studentCardData);
          console.log("카테고리 목록:", studentCardData.categories);
        }
      } catch (error) {
        console.error("데이터 조회 실패:", error);
      }
    };

    fetchData();
  }, [user.userId, role]);

  // 학생 카드 데이터 조합
  const myStudentCard = useMemo(() => {
    if (!userInfo || !studentCard) return null;

    return {
      nickname: userInfo.nickname,
      name: userInfo.name,
      age: userInfo.age,
      gender: userInfo.gender,
      profileImage: userInfo.profileImage,
      subjects: studentCard.categories.map((cat) => cat.name),
      introduction: studentCard.description,
      cardPublic: studentCard.isExposed,
      categoryIds: studentCard.categories.map((cat) => cat.id),
    };
  }, [userInfo, studentCard]);

  // 2번: 내 학생 카드 영역에서 "자세히 보기" 클릭 시 Detail 모드로 전환
  const handleStudentMyDetail = () => {
    setIsMyDetailMode(true);
  };

  // Detail 모드에서 닫기(뒤로가기) 클릭 시 Detail 모드 종료 및 업데이트 모드 초기화
  const handleMyDetailClose = () => {
    setIsMyDetailMode(false);
    setIsUpdateMode(false);
  };

  // Detail 모드에서 수정하기 버튼 클릭 시 업데이트(수정) 모드 전환
  const handleStudentUpdate = () => {
    setIsUpdateMode(true);
  };

  // 선생님 상세 보기 모드 전환 (시나리오 2: MyLecture 내에서 선생님 "자세히 보기" 버튼 클릭 시)
  const handleTeacherDetail = (card) => {
    setSelectedTeacher(card);
    setTeacherDetailMode(true);
  };

  // 선생님 상세 보기 모드 종료
  const handleTeacherDetailClose = () => {
    setTeacherDetailMode(false);
    setSelectedTeacher(null);
  };

  // 학생 카드 데이터 새로고침
  const refreshStudentCard = async () => {
    try {
      const studentCardData = await memberAPI.getStudentCard(user.userId);
      setStudentCard(studentCardData);
    } catch (error) {
      console.error("학생 카드 데이터 새로고침 실패:", error);
    }
  };

  // 수정 완료 핸들러
  const handleUpdateComplete = async () => {
    await refreshStudentCard();
    setIsUpdateMode(false); // 수정 모드 종료
  };

  // 렌더링 분기
  if (teacherDetailMode) {
    const topBarItems = ["선생님 소개", "수업 설명", "수업 자료"];
    return (
      <div className="h-full flex flex-col">
        <div className="flex-none ml-4 my-3 flex items-center justify-between">
          <button
            onClick={handleTeacherDetailClose}
            className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
          >
            <ArrowLongLeftIcon className="w-7 h-7" />
            <span className="font-bold">수강 정보</span>
          </button>
          <span>
            <span className="font-semibold text-gray-500 pr-2">
              잔여 수업 횟수 :
            </span>
            <span className="font-bold text-gray-600 pr-4">
              {selectedTeacher.remainLessonsCnt}
            </span>
            <button className="mr-2 px-3 py-1.5 border-2 border-purple-600 bg-purple-500 hover:bg-purple-600 font-bold text-white rounded">
              수강료 결제하기
            </button>
          </span>
        </div>
        <hr className="w-full border-t-2 border-gray-300" />

        {/* TeacherDetail 영역 */}
        <div className="flex-1 px-4 pt-2 min-h-0">
          <TeacherDetail
            teacher={selectedTeacher}
            topBarItems={topBarItems}
            showClassButton={true}
            onBack={handleTeacherDetailClose}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {role === "GUEST"
          ? // GUEST일 때는 StudentCardCreate 표시
            userInfo && (
              <div className="p-4 min-h-full">
                <StudentCardCreate
                  name={userInfo.name}
                  nickname={userInfo.nickname}
                  age={userInfo.age}
                  birthdate={userInfo.birthdate}
                  gender={userInfo.gender}
                  profileImage={userInfo.profileImage}
                />
              </div>
            )
          : // STUDENT일 때는 학생 카드와 수강 정보 표시
            myStudentCard &&
            (isMyDetailMode ? (
              <div className="p-4 min-h-full">
                {isUpdateMode ? (
                  <StudentCardCreate
                    name={myStudentCard.name}
                    nickname={myStudentCard.nickname}
                    age={myStudentCard.age}
                    gender={myStudentCard.gender}
                    profileImage={myStudentCard.profileImage}
                    categoryIds={myStudentCard.categoryIds}
                    introduction={myStudentCard.introduction}
                    cardPublic={myStudentCard.cardPublic}
                    updateMode={true}
                    onClose={() => setIsUpdateMode(false)}
                    onUpdate={handleUpdateComplete}
                  />
                ) : (
                  <StudentCardDetail
                    nickname={myStudentCard.nickname}
                    name={myStudentCard.name}
                    age={myStudentCard.age}
                    gender={myStudentCard.gender}
                    profileImage={myStudentCard.profileImage}
                    subjects={myStudentCard.subjects}
                    introduction={myStudentCard.introduction}
                    isMyDetail={true}
                    onClose={handleMyDetailClose}
                    onUpdate={handleStudentUpdate}
                    cardPublic={myStudentCard.cardPublic}
                  />
                )}
              </div>
            ) : (
              // 기본 상태 - 내 학생 카드와 선생님 카드 목록
              <div className="space-y-8 pl-6 pr-4 py-6">
                <div>
                  <h2 className="text-xl font-bold mb-4">나의 학생 카드</h2>
                  <StudentCard
                    nickname={myStudentCard.nickname}
                    subjects={myStudentCard.subjects}
                    profileImage={myStudentCard.profileImage}
                    isOwner={true}
                    cardPublic={myStudentCard.cardPublic}
                    showDetail={true}
                    onDetailClick={handleStudentMyDetail}
                  />
                </div>
                <hr className="border-t border-gray-300" />
                <div>
                  <h2 className="text-xl font-bold mb-4">수강 정보</h2>
                  <CardList
                    cards={teacherList}
                    type="teacher"
                    showDetail={true}
                    onDetailClick={handleTeacherDetail}
                  />
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}

export default MyLecture;
