import React, { useState, useEffect } from "react";
import TopBar from "../components/TopBar";
import TeacherInfoCreateA from "../components/TeacherInfoCreateA";
import TeacherInfoCreateB from "../components/TeacherInfoCreateB";
import TeacherInfoA from "../components/TeacherInfoA";
import TeacherInfoB from "../components/TeacherInfoB";
import useAuthStore from "../stores/authStore";
import { memberAPI } from "../api/services/member";
import useTeacherCardStore from "../stores/teacherCardStore";
import { authAPI } from "../api/services/auth";

function MyClass({ role }) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [userInfo, setUserInfo] = useState(null);
  const { user, setAuth } = useAuthStore();

  const [teacherCardExists, setTeacherCardExists] = useState(false);
  const teacherCardData = useTeacherCardStore((state) => state.teacherCardData);
  const setTeacherCard = useTeacherCardStore((state) => state.setTeacherCard);
  const resetTeacherCard = useTeacherCardStore(
    (state) => state.resetTeacherCard,
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfoData = await memberAPI.getUserInfo(user.userId);
        setUserInfo(userInfoData);
        console.log("유저 정보:", userInfoData);

        if (role === "TEACHER") {
          const teacherCardData = await memberAPI.getTeacherCard(user.userId);
          console.log("선생님 카드 데이터:", teacherCardData);

          setTeacherCard({
            description: teacherCardData.description,
            careerDescription: teacherCardData.careerDescription,
            isWanted: teacherCardData.isWanted,
            subjects: teacherCardData.categories,
            careerProgress: teacherCardData.careerProgress,
            price: teacherCardData.price,
            bank: teacherCardData.bank,
            account: teacherCardData.account,
          });

          setTeacherCardExists(true);
        } else {
          resetTeacherCard();
        }
      } catch (error) {
        console.error("데이터 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user.userId, role, setTeacherCard, resetTeacherCard]);

  const handleTabSelect = (tabIndex) => {
    setSelectedTab(tabIndex);
  };

  const handleTeacherUpdate = () => {
    setIsUpdateMode(true);
  };

  const menuItems = ["선생님 소개", "수업 설명"];

  const handleSubmitTeacherCard = async () => {
    try {
      if (
        !teacherCardData.description ||
        !teacherCardData.careerProgress ||
        !teacherCardData.careerDescription ||
        !teacherCardData.price ||
        !teacherCardData.subjects ||
        teacherCardData.subjects.length === 0
      ) {
        alert("모든 필수 항목을 입력해주세요.");
        return;
      }

      console.log("카테고리 등록 요청:", {
        userId: user.userId,
        categoryIds: teacherCardData.subjects.map((category) => category.id),
      });
      await memberAPI.createMemberCategories(
        user.userId,
        teacherCardData.subjects.map((category) => category.id),
      );
      console.log("유저id:", user.userId);
      const { subjects, ...cardData } = teacherCardData;
      const submitData = {
        ...cardData,
        id: user.userId,
      };

      console.log("선생 카드 생성 요청:", submitData);
      const response = await memberAPI.createTeacherCard(submitData);
      console.log("선생 카드 생성 응답:", response);

      if (response.message === "선생 카드 생성 완료") {
        const { token } = await authAPI.changeRole();
        if (token) {
          setAuth(token);
          alert("선생 수업 등록에 성공하였습니다.");
        }
      }
    } catch (error) {
      console.error("선생님 카드 생성 실패:", error);
      alert("선생 수업 등록에 실패하였습니다. 다시 시도해주세요.");
    }
  };

  // 선생 카드 수정 처리 함수
  const handleUpdateTeacherCard = async () => {
    try {
      // 카테고리 업데이트
      console.log("카테고리 수정 요청:", {
        userId: user.userId,
        categoryIds: teacherCardData.subjects.map((category) => category.id),
      });

      await memberAPI.updateMemberCategories(
        user.userId,
        teacherCardData.subjects.map((category) => category.id),
      );

      // 선생 카드 수정 요청 - 각 필드 명확히 구분
      const { subjects, ...cardData } = teacherCardData;
      const submitData = {
        ...cardData,
        id: user.userId,
        description: teacherCardData.description, // 소개글
        careerDescription: teacherCardData.careerDescription, // 기타 경력사항
        careerProgress: teacherCardData.careerProgress, // 수업 진행
      };

      console.log("선생 카드 수정 요청:", submitData);
      const response = await memberAPI.updateTeacherCard(submitData);

      if (response.message === "선생 카드 업데이트 완료") {
        alert("선생 수업 정보가 수정되었습니다.");
        setIsUpdateMode(false); // 수정 모드 종료

        // 수정된 데이터 다시 조회하여 store 업데이트
        const updatedTeacherCard = await memberAPI.getTeacherCard(user.userId);
        setTeacherCard({
          description: updatedTeacherCard.description, // 소개글
          careerDescription: updatedTeacherCard.careerDescription, // 기타 경력사항
          isWanted: updatedTeacherCard.isWanted,
          subjects: updatedTeacherCard.categories,
          careerProgress: updatedTeacherCard.careerProgress, // 수업 진행
          price: updatedTeacherCard.price,
          bank: updatedTeacherCard.bank,
          account: updatedTeacherCard.account,
        });
      }
    } catch (error) {
      console.error("선생님 카드 수정 실패:", error);
      alert("선생 수업 정보 수정에 실패하였습니다. 다시 시도해주세요.");
    }
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (!userInfo && role === "TEACHER" && !teacherCardData) {
    return <div>데이터를 불러올 수 없습니다.</div>;
  }

  if (!user?.userId) {
    return null;
  }

  // TeacherInfoCreateA,B 컴포넌트에 전달할 props 수정
  const createProps = {
    name: userInfo?.name,
    nickname: userInfo?.nickname,
    age: userInfo?.age,
    birthdate: userInfo?.birthdate,
    gender: userInfo?.gender,
    profileImage: userInfo?.profileImage,
    onSubmit: teacherCardExists
      ? handleUpdateTeacherCard
      : handleSubmitTeacherCard,
  };

  const infoProps = {
    A: {
      description: teacherCardData.description, // 소개글
      careerDescription: teacherCardData.careerDescription, // 기타 경력사항
      showProfile: true,
      teacher: {
        name: userInfo?.name,
        nickname: userInfo?.nickname,
        age: userInfo?.age,
        gender: userInfo?.gender,
        profileImage: userInfo?.profileImage,
      },
    },
    B: {
      subjects: teacherCardData.subjects?.map((cat) => cat.name) || [],
      price: teacherCardData.price,
      careerProgress: teacherCardData.careerProgress, // 수업 진행
      bank: teacherCardData.bank,
      account: teacherCardData.account,
    },
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="p-4 pb-0">
        <TopBar
          menuItems={menuItems}
          selectedIndex={selectedTab}
          onSelectItem={handleTabSelect}
        />
      </div>

      <div className="flex-1 relative">
        <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-4 pt-4">
          {!teacherCardExists ? (
            selectedTab === 0 ? (
              <TeacherInfoCreateA {...createProps} />
            ) : (
              <TeacherInfoCreateB onSubmit={handleSubmitTeacherCard} />
            )
          ) : isUpdateMode ? (
            selectedTab === 0 ? (
              <TeacherInfoCreateA
                {...createProps}
                updateMode={true}
                onClose={() => setIsUpdateMode(false)}
                onUpdate={handleUpdateTeacherCard}
              />
            ) : (
              <TeacherInfoCreateB
                {...teacherCardData}
                updateMode={true}
                onClose={() => setIsUpdateMode(false)}
                onUpdate={handleUpdateTeacherCard}
              />
            )
          ) : (
            <div className="flex flex-col">
              {selectedTab === 0 ? (
                <TeacherInfoA {...infoProps.A} />
              ) : (
                <TeacherInfoB {...infoProps.B} />
              )}
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleTeacherUpdate}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  수정하기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyClass;
