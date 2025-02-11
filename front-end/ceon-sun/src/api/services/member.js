import api from "../axios";

export const memberAPI = {
  // 사용자 정보 조회
  getUserInfo: async (userId) => {
    try {
      const response = await api.get(`/member-service/members/${userId}`);
      return response.data;
    } catch (error) {
      console.error("사용자 정보 조회 실패:", error);
      throw error;
    }
  },

  // 프로필 수정
  updateProfile: async (userId, profileData) => {
    try {
      const response = await api.put(
        `/member-service/members/${userId}`,
        profileData,
      );
      return response.data;
    } catch (error) {
      console.error("프로필 수정 실패:", error);
      throw error;
    }
  },

  // 추가 정보 입력 (회원가입 완료)
  completeSignup: (userData) => api.post("/member-service/members", userData),

  // 닉네임 중복 체크
  checkNickname: async (nickname) => {
    try {
      const response = await api.get(
        `/member-service/members?nickname=${nickname}`,
      );
      // 200 응답이면 사용 가능한 닉네임
      return true;
    } catch (error) {
      // 에러가 발생하면 중복된 닉네임
      console.error("닉네임 중복 체크 실패:", error);
      return false;
    }
  },

  // 필터링된 멤버 검색 (선생/학생 리스트)
  searchMembers: async ({
    userId,
    categories = [],
    gender = null,
    ageRange = null,
    page = 0,
    size = 10,
  }) => {
    try {
      // URL 파라미터 구성
      const params = new URLSearchParams();

      // 페이지네이션 파라미터
      params.append("page", page);
      params.append("size", size);

      // 필터 파라미터 추가
      if (categories.length > 0) {
        params.append("category", categories.join(","));
      }

      if (gender && gender !== "all") {
        params.append("gender", gender.toUpperCase());
      }

      if (ageRange && ageRange.start && ageRange.end) {
        params.append("age", `${ageRange.start}-${ageRange.end}`);
      }

      const response = await api.post(
        `/member-service/members/search?${params.toString()}`,
        { id: userId },
      );

      // 응답 데이터 가공
      const { content, pageable, totalElements, totalPages } = response.data;

      // CardList 컴포넌트에서 사용하기 쉽게 데이터 구조 변환
      const formattedContent = content.map((member) => ({
        id: member.id,
        nickname: member.nickname,
        age: member.age,
        gender: member.gender === "MALE" ? "남자" : "여자",
        subjects: member.categories.map((cat) => cat.name),
        profileImage: member.profileImage || "",
        showDetail: true,
        showAge: true,
        showGender: true,
      }));

      return {
        members: formattedContent,
        pagination: {
          currentPage: pageable.pageNumber,
          totalPages,
          totalElements,
          pageSize: pageable.pageSize,
        },
      };
    } catch (error) {
      console.error("멤버 검색 실패:", error);
      throw error;
    }
  },

  // 찜한 선생님 목록 조회
  getFavoriteTeachers: async (userId, page = 0, size = 10) => {
    try {
      const response = await api.get(
        `/member-service/members/favorites?page=${page}&size=${size}`,
        { data: { id: userId } },
      );
      return response.data;
    } catch (error) {
      console.error("찜한 선생님 목록 조회 실패:", error);
      throw error;
    }
  },

  // 선생님 랭킹 목록 조회
  getTeacherRanking: async (page = 0, size = 10) => {
    try {
      const response = await api.get(
        `/member-service/members/ranking?page=${page}&size=${size}`,
      );
      return response.data;
    } catch (error) {
      console.error("선생님 랭킹 목록 조회 실패:", error);
      throw error;
    }
  },
};
