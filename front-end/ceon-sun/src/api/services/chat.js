import api from "../axios";

export const chatAPI = {
  // 문의 채팅방 생성
  createInquiryRoom: async (studentId, teacherId) => {
    try {
      const response = await api.post("/chat-service/chat-rooms", {
        studentId: Number(studentId),
        teacherId: Number(teacherId),
      });
      return response.data;
    } catch (error) {
      console.error("채팅방 생성 실패:", error);
      throw error;
    }
  },

  // 채팅방 목록 조회
  getChatRooms: async () => {
    try {
      const response = await api.get("/chat-service/chat-rooms");
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("채팅방 목록 조회 실패:", error);
      throw error;
    }
  },

  // 채팅방 메시지 내역 조회
  getChatMessages: async (roomId) => {
    try {
      const response = await api.get(`/chat-service/chat-rooms/${roomId}`);
      return response.data;
    } catch (error) {
      console.error("채팅 내역 조회 실패:", error);
      throw error;
    }
  },
};
