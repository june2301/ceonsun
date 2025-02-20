import React, { useState, useRef, useEffect } from "react";
import { ArrowLeftIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import DefaultProfile from "@/assets/img/default-profile.png";
import useAuthStore from "../stores/authStore";
import useWebSocketStore from "../stores/websocketStore";
import { chatAPI } from "@/api/services/chat";

function ChatRoom({ room, onBack }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const messageEndRef = useRef(null);

  // 임시 메시지 ID용 ref
  const tempMessageIdRef = useRef(0);

  // Zustand
  const user = useAuthStore((state) => state.user);
  const { stompClient, connected } = useWebSocketStore();

  // 1) 채팅방 입장 시 과거 메시지 로딩
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const chatHistory = await chatAPI.getChatMessages(room.id);
        setMessages(chatHistory);
      } catch (error) {
        console.error("채팅 내역 로딩 실패:", error);
        alert("채팅 내역을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    loadMessages();
  }, [room.id]);

  // 2) 메시지 추가 시 스크롤 맨 아래로
  useEffect(() => {
    const container = messageEndRef.current?.parentElement;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  // 3) 채팅방(로컬) 구독 - 생략 or 필요시 추가
  useEffect(() => {
    if (connected && stompClient) {
      console.log(`Locally subscribing to room ${room.id}`);
      const subscription = stompClient.subscribe(
        `/queue/chat/${room.id}`,
        (frame) => {
          const newMsg = JSON.parse(frame.body);
          setMessages((prev) => [...prev, newMsg]);
        },
      );
      return () => subscription.unsubscribe();
    }
  }, [connected, stompClient, room.id]);

  // 4) 메시지 전송 함수
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

    // (옵션) 옵티미스틱 UI
    /*
    const tempId = `temp-${tempMessageIdRef.current++}`;
    const newMsg = {
      id: tempId,
      roomId: room.id,
      senderId: user.userId,
      message,
      sentAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);
    */

    // 서버로 전송
    stompClient.send(
      "/app/chat.sendMessage",
      {},
      JSON.stringify({
        roomId: room.id,
        senderId: user.userId,
        message,
        sentAt: new Date().toISOString(),
      }),
    );

    // 입력창 비우기
    setMessage("");
  };

  // 메시지 버블 컴포넌트
  const MessageBubble = ({ message, isMine }) => (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"} mb-4`}>
      {!isMine && (
        <div className="flex-shrink-0 mr-2">
          <img
            src={room.partner.profileImage || DefaultProfile}
            alt="프로필"
            className="w-9 h-9 rounded-md border border-gray-200"
          />
        </div>
      )}
      <div className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
        {!isMine && (
          <span className="text-sm text-gray-700 mb-1">
            {room.partner.name}
          </span>
        )}
        <div
          className={`px-3 py-2 rounded-lg max-w-[250px] break-words ${
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
        <span className="font-semibold text-md">{room.partner.name}</span>
        <button>
          <Cog6ToothIcon className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4 pb-0 custom-scrollbar">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p>메시지를 불러오는 중...</p>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => {
              // DB에서 받은 메시지라면 msg.id가 있을 것이고,
              // 새 메시지(옵티미스틱)에는 id가 없을 수 있으니 임시 key 보완
              const uniqueKey = msg.id || `temp-${index}`;

              return (
                <MessageBubble
                  key={uniqueKey}
                  message={{
                    ...msg,
                    text: msg.message,
                    sender: msg.senderId,
                  }}
                  isMine={msg.senderId === user.userId}
                />
              );
            })}
            <div ref={messageEndRef} />
          </>
        )}
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
