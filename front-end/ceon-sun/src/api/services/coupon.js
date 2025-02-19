import api from "../axios";

export const couponAPI = {
  // 쿠폰 목록 조회
  getCoupons: async () => {
    try {
      const response = await api.get("/coupon-service/coupons");
      return response.data.coupons;
    } catch (error) {
      console.error("쿠폰 목록 조회 실패:", error);
      throw error;
    }
  },

  // 쿠폰 발급
  issueCoupon: async (couponId, validDays) => {
    try {
      await api.post("/coupon-service/coupons", {
        couponId: Number(couponId),
        validDays: Number(validDays),
      });
      return true; // 성공 시 true 반환
    } catch (error) {
      if (error.response?.data?.code === "COUPON4013") {
        throw new Error("이미 발급받은 쿠폰입니다.");
      }
      console.error("쿠폰 발급 실패:", error);
      throw error;
    }
  },

  // 보유 쿠폰 목록 조회
  getMyCoupons: async () => {
    try {
      const response = await api.get("/coupon-kafka-service/coupons/members");
      return response.data.coupons;
    } catch (error) {
      console.error("보유 쿠폰 목록 조회 실패:", error);
      throw error;
    }
  },
};
