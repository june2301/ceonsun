import { create } from "zustand";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL;

const useWebSocketStore = create((set, get) => ({
  stompClient: null,
  connected: false,
  token: null, // 연결에 사용된 토큰을 저장

  // 웹소켓 연결 함수
  connect: (token) => {
    set({ token }); // 토큰을 저장해두면 재연결 시 사용 가능
    const socketUrl = `${WEBSOCKET_URL}/ws?token=${encodeURIComponent(token)}`;
    const socket = new SockJS(socketUrl);

    // onclose 이벤트로 연결 종료 시 자동 재연결 시도
    socket.onclose = () => {
      console.log("WebSocket 연결이 끊어졌습니다.");
      set({ connected: false });
      // 일정 시간 후 재연결 시도 (예: 5초 후)
      setTimeout(() => {
        const currentToken = get().token;
        if (currentToken) {
          console.log("WebSocket 재연결 시도 중...");
          get().connect(currentToken);
        }
      }, 5000);
    };

    const client = Stomp.over(socket);
    // 디버그 메시지 출력 제거 (선택사항)
    client.debug = null;

    client.connect(
      {},
      (frame) => {
        console.log("WebSocket Connected:", frame);
        set({ stompClient: client, connected: true });
      },
      (error) => {
        console.error("WebSocket connection error:", error);
        set({ connected: false });
        // 에러 발생 시 일정 시간 후 재연결 시도
        setTimeout(() => {
          const currentToken = get().token;
          if (currentToken) {
            console.log("에러 후 WebSocket 재연결 시도 중...");
            get().connect(currentToken);
          }
        }, 5000);
      },
    );
  },

  // 웹소켓 연결 종료 함수
  disconnect: () => {
    const { stompClient } = get();
    if (stompClient && stompClient.connected) {
      stompClient.disconnect(() => {
        console.log("WebSocket Disconnected");
        set({ stompClient: null, connected: false });
      });
    }
  },
}));

export default useWebSocketStore;
