import React, { useState, useEffect, useMemo } from "react";
import StudentCardCreate from "./StudentCardCreate";
import StudentCard from "./StudentCard";
import CardList from "./CardList"; // 재사용 가능한 리스트 컴포넌트 (선생님 카드 목록용)
import StudentCardDetail from "./StudentCardDetail";
import TeacherDetail from "./TeacherDetail";
import { ArrowLongLeftIcon } from "@heroicons/react/24/solid";
import useAuthStore from "../stores/authStore";
import { memberAPI } from "../api/services/member";
import { classAPI } from "../api/services/class";

function MyLecture({ role }) {
  const [isMyDetailMode, setIsMyDetailMode] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [teacherDetailMode, setTeacherDetailMode] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [studentCard, setStudentCard] = useState(null);
  const { user } = useAuthStore();
  const [teacherList, setTeacherList] = useState([]);

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

  // 과외 연결된 선생님 리스트 조회
  useEffect(() => {
    const fetchTeacherList = async () => {
      try {
        if (role === "STUDENT") {
          const response = await classAPI.getContractedMembers();
          // API 응답 데이터를 CardList 컴포넌트에 맞는 형식으로 변환
          const formattedTeachers = response.content.map((teacher) => ({
            id: teacher.id,
            memberId: teacher.memberId, // TeacherDetail 조회 시 필요
            nickname: teacher.nickname,
            profileImage: teacher.profileImageUrl,
            age: teacher.age,
            gender: teacher.gender === "MALE" ? "남" : "여",
            subjects: teacher.categories,
            remainLessonsCnt: teacher.count, // 남은 수업 횟수
            showDetail: true,
            showAge: true,
            showGender: true,
            showRemainLessons: true,
            showClassroomButton: true,
            classroomButtonOnTop: true,
            showPaymentButton: true,
          }));
          setTeacherList(formattedTeachers);
        }
      } catch (error) {
        console.error("선생님 목록 조회 실패:", error);
      }
    };

    fetchTeacherList();
  }, [role]);

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
      description: studentCard.description,
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

  // 선생님 상세 보기 모드 전환
  const handleTeacherDetail = async (card) => {
    try {
      // memberAPI를 통해 선생님 상세 정보 조회
      const teacherDetail = await memberAPI.getTeacherDetail(card.memberId);

      // 상세 정보에 remainLessonsCnt 추가 (getContractedMembers에서 가져온 count 값 사용)
      setSelectedTeacher({
        ...teacherDetail,
        remainLessonsCnt: card.remainLessonsCnt, // card에서 가져온 count 값
        showClassButton: true,
      });
      setTeacherDetailMode(true);
    } catch (error) {
      console.error("선생님 상세 정보 조회 실패:", error);
    }
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
                    introduction={myStudentCard.description}
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
                    description={myStudentCard.description}
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
