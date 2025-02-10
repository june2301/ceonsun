import api from "../axios";

export const memberAPI = {
  // 추가 정보 입력 (회원가입 완료)
  completeSignup: (userData) =>
    api.post("/api/member/complete-signup", userData),
};
