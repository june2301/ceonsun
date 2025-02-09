import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { BellIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import logo from "../assets/img/logo.png";
import ChatRoomList from "./ChatRoomList";
import AlarmList from "./AlarmList";

const Header = () => {
  const [showChatModal, setShowChatModal] = useState(false);
  const [showAlarmModal, setShowAlarmModal] = useState(false);
  const chatButtonRef = useRef(null);
  const chatModalRef = useRef(null);
  const alarmButtonRef = useRef(null);
  const alarmModalRef = useRef(null);

  // 바깥 영역 클릭 감지를 위한 이벤트 핸들러
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (showChatModal &&
          !chatButtonRef.current?.contains(event.target) &&
          !chatModalRef.current?.contains(event.target)) ||
        (showAlarmModal &&
          !alarmButtonRef.current?.contains(event.target) &&
          !alarmModalRef.current?.contains(event.target))
      ) {
        setShowChatModal(false);
        setShowAlarmModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showChatModal, showAlarmModal]);

  return (
    <div className="w-full bg-gray-100">
      <div className="max-w-[940px] mx-auto flex items-center justify-between h-24 px-4">
        {/* 로고 */}
        <div className="flex items-center">
          <Link to="/mainpage" className="flex items-center">
            <img src={logo} alt="Logo" className="h-12" />
          </Link>
        </div>

        {/* 메뉴 */}
        <div className="flex gap-6">
          <Link
            to="/cardlistpage"
            className="text-lg text-gray-700 hover:text-blue-500"
          >
            선생님 목록
          </Link>
          <Link
            to="/cardlistpage"
            className="text-lg text-gray-700 hover:text-blue-500"
          >
            학생 목록
          </Link>
          <Link
            to="/mypage"
            className="text-lg text-gray-700 hover:text-blue-500"
          >
            내 수업
          </Link>
        </div>

        {/* 사용자 정보 */}
        <div className="flex items-center gap-6">
          {/* 사용자 이름과 로그아웃 */}
          <div className="flex flex-col items-center">
            <Link to="#" className="text-gray-800 font-bold text-lg">
              김싸피 님
            </Link>
            <Link to="/" className="text-gray-600 text-sm hover:text-blue-500">
              로그아웃
            </Link>
          </div>

          {/* 알림 확인 */}
          <div className="relative">
            <button
              ref={alarmButtonRef}
              onClick={() => setShowAlarmModal(!showAlarmModal)}
              className="flex flex-col items-center text-gray-600 text-sm hover:text-blue-500"
            >
              <BellIcon className="w-6 h-6 mb-1" />
              알림 확인
            </button>

            {/* 알림 모달 */}
            {showAlarmModal && (
              <div
                ref={alarmModalRef}
                className="absolute bg-white rounded-lg shadow-lg overflow-hidden z-50"
                style={{
                  width: "340px",
                  height: "660px",
                  top: "calc(100% + 8px)",
                  right: "calc(100% - 200px)",
                }}
              >
                <AlarmList onClose={() => setShowAlarmModal(false)} />
              </div>
            )}
          </div>

          {/* 문의 채팅 버튼과 모달을 감싸는 컨테이너 */}
          <div className="relative">
            <button
              ref={chatButtonRef}
              onClick={() => setShowChatModal(!showChatModal)}
              className="flex flex-col items-center text-gray-600 text-sm hover:text-blue-500"
            >
              <ChatBubbleLeftRightIcon className="w-6 h-6 mb-1" />
              문의 채팅
            </button>

            {/* 채팅 모달 */}
            {showChatModal && (
              <div
                ref={chatModalRef}
                className="absolute bg-white rounded-lg shadow-lg overflow-hidden z-50"
                style={{
                  width: "340px",
                  height: "660px",
                  top: "calc(100% + 8px)", // 버튼 아래 8px 간격
                  right: "calc(100% - 210px)", // 버튼 우측에서 약간 왼쪽으로
                }}
              >
                <ChatRoomList onClose={() => setShowChatModal(false)} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
