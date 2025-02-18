import React, { useState } from "react";
import {
  TicketIcon,
  BookOpenIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import { getNotificationDetail } from "../api/services/notification";
import AlarmModal from "./AlarmModal";

function AlarmCard({ alarm, onRead }) {
  const { type, message, read, id } = alarm;
  const [showModal, setShowModal] = useState(false);
  const [detailData, setDetailData] = useState(null);

  const handleClick = async () => {
    try {
      const detail = await getNotificationDetail(id);
      setDetailData(detail);
      setShowModal(true);
      if (!read && onRead) {
        onRead(id);
      }
    } catch (error) {
      console.error("알림 상세 조회 실패:", error);
    }
  };

  const getIcon = () => {
    switch (type) {
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

  return (
    <>
      <div
        onClick={handleClick}
        className={`flex justify-center p-3 border-b hover:bg-gray-50 cursor-pointer
        ${!read ? "bg-sky-50" : "bg-white"}`}
      >
        <div className="flex items-center w-[300px] h-[40px]">
          <div className="w-8 h-8 flex-shrink-0">{getIcon()}</div>
          <div className="ml-4">
            <p className="text-sm font-semibold text-gray-800 leading-tight mb-0.5">
              {message}
            </p>
          </div>
        </div>
      </div>

      {showModal && detailData && (
        <AlarmModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          notification={detailData}
        />
      )}
    </>
  );
}

export default AlarmCard;
