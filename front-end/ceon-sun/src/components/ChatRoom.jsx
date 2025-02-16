import React, { useState, useRef, useEffect } from "react";
import { ArrowLeftIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import DefaultProfile from "@/assets/img/default-profile.png";
import useAuthStore from "../stores/authStore";
import useWebSocketStore from "../stores/websocketStore";

function ChatRoom({ room, onBack }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(room.messages || []);
  const messageEndRef = useRef(null);

  // Zustand store에서 사용자 정보와 WebSocket 클라이언트 가져오기
  const user = useAuthStore((state) => state.user);
  const { stompClient, connected } = useWebSocketStore();

  // 메시지가 추가될 때마다 스크롤을 최하단으로 이동
  useEffect(() => {
    const container = messageEndRef.current?.parentElement;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  // 채팅방 구독
  useEffect(() => {
    if (connected && stompClient) {
      console.log(`Subscribing to chat room ${room.id}`);
      const subscription = stompClient.subscribe(
        `/queue/chat/${room.id}`,
        (message) => {
          console.log("Received message:", message.body);
          try {
            const receivedMsg = JSON.parse(message.body);
            setMessages((prev) => [...prev, receivedMsg]);
          } catch (error) {
            console.error("Error parsing message:", error);
          }
        },
      );

      // 컴포넌트 언마운트 시 구독 해제
      return () => {
        subscription.unsubscribe();
        console.log(`Unsubscribed from chat room ${room.id}`);
      };
    }
  }, [room.id, connected, stompClient]);

  // 메시지 전송 함수
  const handleSendMessage = () => {
    if (!connected || !stompClient) {
      alert("채팅 서버에 연결되어 있지 않습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    if (!message.trim()) {
      alert("메시지를 입력하세요.");
      return;
    }

    console.log("Sending message:", message);
    stompClient.send(
      "/app/chat.sendMessage",
      {},
      JSON.stringify({
        roomId: room.id,
        senderId: user.userId,
        message: message,
        sentAt: new Date().toISOString(),
      }),
    );
    setMessage("");
  };

  // 메시지 버블 컴포넌트
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
          <span className="text-sm text-gray-700 mb-1">
            {message.sender || message.senderId}
          </span>
        )}
        <div
          className={`px-3 py-2 rounded-lg break-words max-w-[250px] ${
            isMine ? "bg-blue-400 text-white" : "bg-gray-100 text-gray-800"
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">
            {message.message || message.text}
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
      <div className="flex-1 overflow-y-auto p-4 pb-0 custom-scrollbar">
        {messages.map((msg, idx) => (
          <MessageBubble
            key={idx}
            message={msg}
            isMine={msg.senderId === user.userId}
          />
        ))}
        <div ref={messageEndRef} />
      </div>
      {/* 입력 영역 */}
      <div className="h-[60px] px-4 py-3 border-t-2 bg-white">
        <div className="flex gap-2 h-full">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="내용을 입력하세요"
            className="flex-1 text-sm focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
          />
          <button
            onClick={handleSendMessage}
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
