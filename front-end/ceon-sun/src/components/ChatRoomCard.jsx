import React from "react";
import DefaultProfile from "@/assets/img/default-profile.png";

function ChatRoomCard({ room, onSelect }) {
  const { name, subjects, lastMessage, lastMessageTime, profileImage } = room;

  return (
    <div
      onClick={onSelect}
      className="flex items-center p-3 border-b hover:bg-gray-50 cursor-pointer"
    >
      <div className="w-10 h-10 flex-shrink-0">
        <img
          src={profileImage || DefaultProfile}
          alt="프로필"
          className="w-full h-full rounded-md object-cover border border-gray-200"
        />
      </div>
      <div className="ml-3 flex-1">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="font-medium text-sm">{name}</span>
            <span className="ml-2 text-xs text-gray-500">
              {subjects.join(", ")}
            </span>
          </div>
          <span className="text-xs text-gray-400">{lastMessageTime}</span>
        </div>
        <p className="text-xs text-gray-500 mt-1 truncate">{lastMessage}</p>
      </div>
    </div>
  );
}

export default ChatRoomCard;
