import React, { useEffect, useState } from "react";
import {
  XMarkIcon,
  TicketIcon,
  BookOpenIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import { memberAPI } from "../api/services/member";
import DefaultProfile from "../assets/img/default-profile.png";

function AlarmModal({ isOpen, onClose, notification }) {
  const [senderInfo, setSenderInfo] = useState(null);

  useEffect(() => {
    const fetchSenderInfo = async () => {
      const userId =
        notification.type === "COUPON"
          ? notification.targetUserId
          : notification.sendUserId;

      if (userId) {
        try {
          const info = await memberAPI.getUserInfo(userId);
          setSenderInfo(info);
        } catch (error) {
          console.error("사용자 정보 조회 실패:", error);
        }
      }
    };

    fetchSenderInfo();
  }, [notification.type, notification.targetUserId, notification.sendUserId]);

  const getIcon = () => {
    switch (notification.type) {
      case "COUPON":
        return <TicketIcon className="w-8 h-8 text-yellow-500" />;
      case "CLASS":
        return <BookOpenIcon className="w-8 h-8 text-lime-600" />;
      case "CHAT":
        return (
          <ChatBubbleOvalLeftEllipsisIcon className="w-8 h-8 text-blue-500" />
        );
      case "PAYMENT":
        return <CreditCardIcon className="w-8 h-8 text-purple-600" />;
      default:
        return <TicketIcon className="w-8 h-8 text-gray-400" />;
    }
  };

  const getTypeText = () => {
    switch (notification.type) {
      case "COUPON":
        return "쿠폰 관련";
      case "CLASS":
        return "수업 관련";
      case "CHAT":
        return "채팅 관련";
      case "PAYMENT":
        return "결제 관련";
      default:
        return "기타 알림";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />

      <div className="bg-white rounded-lg shadow-xl w-[400px] relative z-10">
        {/* 헤더 */}
        <div className="flex justify-between items-center p-4 border-b-2">
          <div className="flex items-center">
            {getIcon()}
            <h2 className="text-lg font-semibold ml-2">알림 상세</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* 내용 */}
        <div className="p-4">
          {/* 발신자 정보 */}
          <div className="flex items-center ml-1 mb-4">
            <img
              src={senderInfo?.profileImage || DefaultProfile}
              alt="프로필"
              className="border border-gray-300 w-12 h-12 rounded mr-4"
            />
            <div className="text-center">
              <p className="text-lg">
                <span className="font-semibold">
                  {senderInfo?.nickname || "알 수 없음"}
                </span>
                <span className="font-normal"> 님</span>
              </p>
            </div>
          </div>

          {/* 알림 메시지 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 font-semibold">
              {notification.message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlarmModal;
