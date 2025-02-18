import api from "../axios";

export const classAPI = {
  // 과외 신청 API
  createClassRequest: async (teacherId) => {
    try {
      const response = await api.post("/class-service/class-requests", {
        teacherId: teacherId,
      });
      return response.data;
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

  // 과외/종료 학생 리스트 조회 API
  getContractedStudents: async (page = 0, size = 10) => {
    try {
      const response = await api.get(`/class-service/contracted-class`, {
        params: { page, size },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
