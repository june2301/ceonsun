import api from "../axios";

export const openviduAPI = {
  createToken: async (contractedClassId) => {
    try {
      const response = await api.post(
        `/class-service/openvidu/sessions/${contractedClassId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.error("세션 생성 실패:", error);
      throw error;
    }
  },
};
