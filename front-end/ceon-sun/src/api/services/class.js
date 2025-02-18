import api from "../axios";

export const classAPI = {
  // 과외 신청 API
  createClassRequest: async (teacherId) => {
    try {
      const response = await api.post("/class-service/class-requests", {
        teacherId: teacherId,
      });
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      throw error;
    }
  },

  // 신청 학생 리스트 조회 API
  getPendingStudents: async (page = 0, size = 10) => {
    try {
      const response = await api.get(`/class-service/class-requests`, {
        params: { page, size },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 과외/종료 학생 리스트 조회 API (role이 STUDENT면 선생님 리스트 조회)
  getContractedMembers: async (page = 0, size = 10) => {
    try {
      const response = await api.get(`/class-service/contracted-class`, {
        params: { page, size },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 과외 신청 응답 API (수락/거절)
  respondToClassRequest: async (studentId, classRequestId, status) => {
    try {
      const response = await api.post(
        "/class-service/class-requests/response",
        {
          studentId,
          classRequestId,
          status,
        },
      );
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      throw error;
    }
  },
};
