import React, { useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import ChatRoomCard from "./ChatRoomCard";
import ChatRoom from "./ChatRoom";

function ChatRoomList({ onClose }) {
  const [selectedRoom, setSelectedRoom] = useState(null);

  // 임시 채팅방 데이터
  const chatRooms = [
    {
      id: 1,
      name: "선선선",
      subjects: ["Java", "Spring"],
      lastMessage: "마지막 메시지",
      lastMessageTime: "10분 전",
      profileImage: null,
      messages: [
        {
          id: 1,
          senderId: "user2",
          sender: "선선선",
          text: "안녕하세요",
          profileImage: null,
        },
        {
          id: 2,
          senderId: "user1",
          text: "반갑습니다 저는 항상 프로그래밍이란 무엇인지 열심히 고민하며 공부하고 있습니다.",
        },
        {
          id: 3,
          senderId: "user2",
          sender: "선선선",
          text: "수업 문의 드립니다 jasidoj aosjdoi jis j asjdi oajsd ioj",
          profileImage: null,
        },
      ],
    },
    {
      id: 2,
      name: "김싸피",
      subjects: ["Python", "Django"],
      lastMessage: "네, 알겠습니다.",
      lastMessageTime: "30분 전",
      profileImage: null,
    },
    {
      id: 3,
      name: "이싸피",
      subjects: ["JavaScript", "React"],
      lastMessage: "수업 일정 조율 가능할까요?",
      lastMessageTime: "1시간 전",
      profileImage: null,
    },
    {
      id: 4,
      name: "박싸피",
      subjects: ["C++", "Algorithm"],
      lastMessage: "다음 수업은 언제인가요?",
      lastMessageTime: "2시간 전",
      profileImage: null,
    },
  ];

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
  };

  const handleBack = () => {
    setSelectedRoom(null);
  };

  if (selectedRoom) {
    return <ChatRoom room={selectedRoom} onBack={handleBack} />;
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* 헤더 */}
      <div className="h-14 flex items-center px-4 border-b bg-blue-200">
        <h2 className="text-lg font-semibold text-gray-800">문의 채팅</h2>
      </div>

      {/* 채팅방 목록 */}
      <div className="flex-1 overflow-y-auto">
        {chatRooms.map((room) => (
          <ChatRoomCard
            key={room.id}
            room={room}
            onSelect={() => handleRoomSelect(room)}
          />
        ))}
      </div>
    </div>
  );
}

export default ChatRoomList;
