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
};
