import React from "react";
import {
  BellIcon,
  ChatBubbleOvalLeftEllipsisIcon,
} from "@heroicons/react/24/outline";
import DefaultProfile from "@/assets/img/default-profile.png";

function AlarmCard({ alarm }) {
  const { type, message, isRead, createdAt } = alarm;

  const getIcon = () => {
    switch (type) {
      case "chat":
        return (
          <ChatBubbleOvalLeftEllipsisIcon className="w-8 h-8 text-blue-400" />
        );
      case "notification":
        return <BellIcon className="w-8 h-8 text-yellow-400" />;
      default:
        return <BellIcon className="w-8 h-8 text-gray-400" />;
    }
  };

  return (
    <div
      className={`flex justify-center p-3 border-b hover:bg-gray-50 cursor-pointer
      ${!isRead ? "bg-blue-50" : "bg-white"}`}
    >
      <div className="flex items-center w-[200px] h-[40px]">
        <div className="w-8 h-8 flex-shrink-0">{getIcon()}</div>
        <div className="ml-2">
          <p className="text-sm font-semibold text-gray-800 leading-tight mb-0.5">
            {message}
          </p>
          <p className="text-xs text-gray-500 leading-none">{createdAt}</p>
        </div>
      </div>
    </div>
  );
}

export default AlarmCard;
