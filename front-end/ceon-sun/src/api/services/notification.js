const BASE_URL = import.meta.env.VITE_API_BASE_URL;
let eventSource = null;

export const connectNotification = (userId) => {
  // 기존 연결이 있다면 종료
  if (eventSource) {
    eventSource.close();
  }

  const sseUrl = `${BASE_URL}/notification-service/sse/subscribe/${userId}`;

  console.log("SSE 연결 URL:", sseUrl);

  // SSE 연결 생성
  eventSource = new EventSource(sseUrl, { withCredentials: false });

  // 연결 성공 이벤트
  eventSource.onopen = () => {
    console.log("[SSE] 연결 성공");
  };

  // "connect" 이벤트 수신
  eventSource.addEventListener("connect", (event) => {
    console.log("[SSE:connect]", event.data);
  });

  // notification 이벤트 수신 시 안읽은 알림 상태 확인
  eventSource.addEventListener("notification", async (event) => {
    console.log("[SSE:notification]", event.data);
    // 새 알림이 오면 안읽은 알림 상태 확인
    const hasUnread = await checkUnreadNotifications(userId);
    // Header 컴포넌트에서 상태 업데이트를 위해 커스텀 이벤트 발생
    window.dispatchEvent(
      new CustomEvent("unreadNotificationUpdate", { detail: hasUnread }),
    );
  });

  // 에러 처리
  eventSource.onerror = (err) => {
    console.error("[SSE] 에러 발생:", err);
  };

  return eventSource;
};

export const disconnectNotification = () => {
  if (eventSource) {
    eventSource.close();
    eventSource = null;
  }
};

export const checkUnreadNotifications = async (userId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/notification-service/user/${userId}/has-unread`,
    );
    return await response.json();
  } catch (error) {
    console.error("안읽은 알림 확인 중 에러 발생:", error);
    return false;
  }
};

export const getAllNotifications = async (userId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/notification-service/user/${userId}/all`,
    );
    return await response.json();
  } catch (error) {
    console.error("알림 목록 조회 중 에러 발생:", error);
    return [];
  }
};

export const getNotificationDetail = async (notificationId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/notification-service/detail/${notificationId}`,
    );
    return await response.json();
  } catch (error) {
    console.error("알림 상세 조회 중 에러 발생:", error);
    throw error;
  }
};
