import React, { useState } from "react";
import { ArrowLongLeftIcon, StarIcon } from "@heroicons/react/24/solid";
import DefaultProfile from "@/assets/img/default-profile.png";
import Modal from "./Modal";
import { chatAPI } from "../api/services/chat";
import useAuthStore from "../stores/authStore";
import { useNavigate, useLocation } from "react-router-dom";

function TeacherAction({ teacher, previousTab }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuthStore(); // 로그인한 사용자 정보 가져오기
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    navigate("/cardlistpage", {
      state: { selectedMenu: previousTab ?? 0 },
    });
  };

  const handleInquiryClick = () => {
    setIsModalOpen(true);
  };

  const handleModalConfirm = async () => {
    try {
      const response = await chatAPI.createInquiryRoom(user.userId, teacher.id);
      console.log("채팅방 생성 응답:", response);

      if (response === "문의 메시지 전송 완료") {
        alert("문의 채팅방이 생성되었습니다.");
      }
    } catch (error) {
      console.error("채팅방 생성 실패:", error);
      alert("채팅방 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="w-[240px] min-w-[240px] flex flex-col px-4 py-3 border-r-2 border-gray-300">
      {/* 뒤로가기 버튼 (오른쪽 정렬) */}
      <div className="flex justify-end mb-3">
        <button onClick={handleBack} className="hover:opacity-80">
          <ArrowLongLeftIcon className="w-8 h-8 text-gray-600" />
        </button>
      </div>

      {/* 프로필 카드 */}
      <div className="bg-white rounded-md border-2 border-gray-300 p-4 mb-3">
        {/* 프로필 사진과 "프로필 정보" 텍스트를 가로로 배치 */}
        <div className="flex items-center mb-4">
          <div className="w-24 h-24 mr-4 border border-gray-400 rounded">
            <img
              src={teacher.profileImage || DefaultProfile}
              alt="Profile"
              className="w-full h-full object-cover rounded"
            />
          </div>
          <div className="text-base font-bold text-center">
            프로필 <br /> 정보
          </div>
        </div>

        {/* 프로필 상세 정보 */}
        <div className="text-sm text-gray-600 leading-5">
          <div>
            닉네임 : <span className="font-bold">{teacher.nickname}</span>
          </div>
          <div>
            나이 : <span className="font-bold">{teacher.age}</span>
          </div>
          <div>
            성별 : <span className="font-bold">{teacher.gender}</span>
          </div>
          <div className="grid grid-cols-[auto,1fr] gap-x-2">
            <span>과목 :</span>
            <span className="font-bold">
              {teacher.subjects && teacher.subjects.length > 0
                ? teacher.subjects.join(", ")
                : "미등록"}
            </span>
          </div>
        </div>
      </div>

      {/* 문의, 찜하기, 과외신청 버튼 */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleInquiryClick}
            className="w-[100px] h-[40px] font-semibold border-2 border-green-300 rounded py-1 px-3 text-sm bg-green-200 hover:bg-green-300"
          >
            문의하기
          </button>
          <button className="w-[100px] h-[40px] font-semibold border-2 border-gray-300 rounded py-1 px-3 text-sm bg-gray-200 hover:bg-gray-100 flex items-center justify-center">
            <StarIcon className="w-5 h-5 mr-1 text-gray-400" />
            찜하기
          </button>
        </div>
        <button className="bg-amber-200 hover:bg-amber-300 text-black rounded py-2 font-bold">
          과외 신청하기
        </button>
      </div>

      {/* 모달 컴포넌트 */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        nickname={teacher.nickname}
        who="선생님과"
        what="문의 채팅방을 생성하시겠습니까?"
        notice="*문의 채팅방을 생성하면 생성 메시지가 전송됩니다."
      />
    </div>
  );
}

export default TeacherAction;
