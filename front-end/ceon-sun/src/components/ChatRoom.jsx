import React, { useState, useRef, useEffect } from "react";
import { ArrowLeftIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import DefaultProfile from "@/assets/img/default-profile.png";

function ChatRoom({ room, onBack }) {
  const [message, setMessage] = useState("");
  const messageEndRef = useRef(null);
  const currentUserId = "user1"; // 실제로는 로그인한 사용자 ID

  // 메시지 추가될 때마다 스크롤 최하단으로 이동
  useEffect(() => {
    const messageContainer = messageEndRef.current?.parentElement;
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }, [room.messages]);

  const MessageBubble = ({ message, isMine }) => (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"} mb-4`}>
      {!isMine && (
        <div className="flex flex-shrink-0 items-start mr-2">
          <img
            src={message.profileImage || DefaultProfile}
            alt="프로필"
            className="w-9 h-9 rounded-md border border-gray-200"
          />
        </div>
      )}
      <div className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
        {!isMine && (
          <span className="text-sm text-gray-700 mb-1">{message.sender}</span>
        )}
        <div
          className={`px-3 py-2 rounded-lg break-words
            ${isMine ? "bg-blue-400 text-white" : "bg-gray-100 text-gray-800"}
            max-w-[250px]`}
        >
          <p className="text-sm whitespace-pre-wrap word-break-all">
            {message.text}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white">
      {/* 헤더 */}
      <div className="h-14 flex justify-between items-center px-4 bg-blue-200 border-b">
        <button onClick={onBack}>
          <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
        </button>
        <span className="font-semibold text-md">{room.name}</span>
        <button>
          <Cog6ToothIcon className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4 pb-0 chatroom-scrollbar">
        {room.messages?.map((msg, idx) => (
          <MessageBubble
            key={idx}
            message={msg}
            isMine={msg.senderId === currentUserId}
          />
        ))}
        {/* 스크롤 위치를 잡기 위한 div */}
        <div ref={messageEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="h-[60px] px-4 py-3 border-t-2 bg-white">
        <div className="flex gap-2 h-full">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 text-sm focus:outline-none"
            placeholder="내용을 입력하세요"
          />
          <button
            onClick={() => {
              if (message.trim()) {
                // 메시지 전송 로직
                setMessage("");
              }
            }}
            className="px-4 bg-blue-400 text-white text-md rounded"
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatRoom;
