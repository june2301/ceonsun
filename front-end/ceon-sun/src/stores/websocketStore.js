import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import useAuthStore from "./authStore"; // authStore에서 토큰을 가져온다

const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL;

const useWebSocketStore = create(
  persist(
    (set, get) => ({
      // ============ 메모리에만 저장되는 상태 ============
      stompClient: null,
      connected: false,

      // STOMP subscription 객체 목록 (직렬화 불가)
      // 실제 unsubscribe에 사용
      ephemeralSubscriptions: [],

      // ============ persist 저장될 상태 ============
      // 새로고침 후에도 어떤 roomId를 구독 중이었는지 유지
      subscribedRoomIds: [],

      /**
       * 웹소켓 연결
       * 1) authStore에서 토큰을 가져옴
       * 2) SockJS + STOMP 클라이언트 연결
       * 3) 연결 성공 시 subscribedRoomIds 다시 subscribe
       */
      connect: () => {
        const { token } = useAuthStore.getState();
        if (!token) {
          console.warn(
            "[webSocketStore] connect() called but no token in authStore",
          );
          return;
        }

        const pureToken = token.startsWith("Bearer ") ? token.slice(7) : token;
        const socketUrl = `${WEBSOCKET_URL}/ws?token=${encodeURIComponent(
          pureToken,
        )}`;
        const socket = new SockJS(socketUrl);

        socket.onclose = () => {
          console.log("WebSocket 연결이 끊어졌습니다.");
          set({
            connected: false,
            stompClient: null,
            ephemeralSubscriptions: [],
          });
          // 자동 재연결
          setTimeout(() => {
            const curToken = useAuthStore.getState().token;
            if (curToken) {
              console.log("[webSocketStore] 재연결 시도");
              get().connect();
            }
          }, 5000);
        };

        const client = Stomp.over(socket);
        client.debug = null; // 디버그 로그 제거

        client.connect(
          {},
          (frame) => {
            console.log("WebSocket Connected:", frame);

            // 연결 성공 → stompClient 세팅
            set({
              stompClient: client,
              connected: true,
              ephemeralSubscriptions: [],
            });

            // persisted된 roomId들 재구독
            const { subscribedRoomIds } = get();
            subscribedRoomIds.forEach((roomId) => {
              const subscription = client.subscribe(
                `/queue/chat/${roomId}`,
                (msgFrame) => {
                  console.log(
                    `[Resubscribe] room ${roomId} message:`,
                    msgFrame.body,
                  );
                },
              );
              set((state) => ({
                ephemeralSubscriptions: [
                  ...state.ephemeralSubscriptions,
                  { roomId, subscription },
                ],
              }));
            });
          },
          (error) => {
            console.error("WebSocket connection error:", error);
            set({
              connected: false,
              stompClient: null,
              ephemeralSubscriptions: [],
            });
            // 재연결
            setTimeout(() => {
              const curToken = useAuthStore.getState().token;
              if (curToken) {
                console.log("[webSocketStore] 에러 후 재연결 시도");
                get().connect();
              }
            }, 5000);
          },
        );
      },

      /**
       * 채팅방 구독
       * - 연결 안되어 있으면 무시
       * - STOMP subscribe 후 ephemeralSubscriptions, subscribedRoomIds 업데이트
       */
      addSubscription: (roomId) => {
        const {
          stompClient,
          connected,
          ephemeralSubscriptions,
          subscribedRoomIds,
        } = get();
        if (!connected || !stompClient) {
          console.warn("WebSocket이 연결되지 않아서 구독 불가");
          return;
        }

        // 구독
        const subscription = stompClient.subscribe(
          `/queue/chat/${roomId}`,
          (frame) => {
            console.log(
              `[MainPage] 새 메시지 - roomId=${roomId}, body:`,
              frame.body,
            );
          },
        );

        set({
          ephemeralSubscriptions: [
            ...ephemeralSubscriptions,
            { roomId, subscription },
          ],
          subscribedRoomIds: Array.from(
            new Set([...subscribedRoomIds, roomId]),
          ),
        });
      },

      /**
       * 현재 구독 중인 roomId 확인
       */
      checkSubscriptions: () => {
        const { subscribedRoomIds } = get();
        if (subscribedRoomIds.length === 0) {
          console.log("현재 구독 중인 채팅방이 없습니다.");
        } else {
          console.log("현재 구독 중인 채팅방 목록:", subscribedRoomIds);
        }
      },

      /**
       * WebSocket 연결 종료
       * - 연결 중이라면 모든 구독 unsubscribe
       * - 상태 리셋
       */
      disconnect: () => {
        const { stompClient, ephemeralSubscriptions } = get();

        // 만약 STOMP 연결이 살아있다면 구독 해제
        if (stompClient && stompClient.connected) {
          ephemeralSubscriptions.forEach((subObj) => {
            if (subObj?.subscription?.unsubscribe) {
              // 방어 코드
              subObj.subscription.unsubscribe();
            }
          });

          stompClient.disconnect(() => {
            console.log("WebSocket Disconnected");
            set({
              stompClient: null,
              connected: false,
              ephemeralSubscriptions: [],
              subscribedRoomIds: [],
            });
          });
        } else {
          // 이미 연결 안 됐다면
          set({
            stompClient: null,
            connected: false,
            ephemeralSubscriptions: [],
            subscribedRoomIds: [],
          });
        }
      },
    }),
    {
      // persist: 새로고침해도 subscribedRoomIds 유지
      name: "websocket-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export default useWebSocketStore;
