import React, { useState, useEffect } from "react";
import ChatRoomCard from "./ChatRoomCard";
import ChatRoom from "./ChatRoom";
import { chatAPI } from "@/api/services/chat";

function ChatRoomList({ onClose }) {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChatRooms();
  }, []);

  const fetchChatRooms = async () => {
    try {
      const rooms = await chatAPI.getChatRooms();
      // API 응답을 ChatRoomCard 컴포넌트에 맞는 형식으로 변환
      const formattedRooms = rooms.map((room) => ({
        id: room.id,
        name: room.partnerName,
        profileImage: room.profileImage,
        // subjects, lastMessage, lastMessageTime은 제외
        // 추후 API에서 제공되면 추가
      }));
      setChatRooms(formattedRooms);
    } catch (error) {
      console.error("채팅방 목록 로딩 실패:", error);
      alert("채팅방 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

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
        <h2 className="text-lg font-semibold text-gray-800">채팅방 목록</h2>
      </div>

      {/* 채팅방 목록 */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p>로딩 중...</p>
          </div>
        ) : chatRooms.length > 0 ? (
          chatRooms.map((room) => (
            <ChatRoomCard
              key={room.id}
              room={room}
              onSelect={() => handleRoomSelect(room)}
            />
          ))
        ) : (
          <div className="flex justify-center items-center h-full">
            <p>채팅방이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatRoomList;
