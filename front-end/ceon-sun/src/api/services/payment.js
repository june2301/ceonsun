import api from "../axios";

export const paymentAPI = {
  requestPayment: async (paymentData) => {
    try {
      const response = await api.post("/payment-service/payments", {
        impUid: paymentData.impUid,
        merchantUid: paymentData.merchantUid,
        amount: paymentData.amount,
        couponId: paymentData.couponId || null, // couponId가 없는 경우 null
        count: paymentData.count,
        contractedClassId: paymentData.contractedClassId,
      });

      return response.data;
    } catch (error) {
      console.error("결제 요청 실패:", error);
      throw error;
    }
  },
};
