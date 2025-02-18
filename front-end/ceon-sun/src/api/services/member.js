import api from "../axios";

export const memberAPI = {
  // 사용자 정보 조회
  getUserInfo: async (userId) => {
    try {
      const response = await api.get(`/member-service/members/${userId}`);

      // 생년월일로 나이 계산
      const birthdate = response.data.birthdate; // "YYYY-MM-DD" 또는 "YYYYMMDD" 형식
      let age = null;

      if (birthdate) {
        // 생년월일 형식 통일 (YYYYMMDD)
        const cleanBirthdate = birthdate.replace(/-/g, "");
        const year = parseInt(cleanBirthdate.substring(0, 4));
        const month = parseInt(cleanBirthdate.substring(4, 6));
        const day = parseInt(cleanBirthdate.substring(6, 8));

        // 현재 날짜
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1;
        const currentDay = today.getDate();

        // 나이 계산
        age = currentYear - year;
        if (
          currentMonth < month ||
          (currentMonth === month && currentDay < day)
        ) {
          age--;
        }
      }

      // 응답 데이터에 나이 추가하고 gender 한글로 변환
      return {
        ...response.data,
        age,
        gender: response.data.gender === "MALE" ? "남자" : "여자",
      };
    } catch (error) {
      console.error("사용자 정보 조회 실패:", error);
      throw error;
    }
  },

  // 프로필 수정
  updateProfile: async (userId, formData) => {
    try {
      const response = await api.put(
        `/member-service/members/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
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

  // 필터링된 멤버 검색
  searchMembers: async ({
    userId,
    categories = [],
    gender = null,
    ageRange = null,
    page = 0,
    size = 10,
  }) => {
    try {
      const params = new URLSearchParams();

      // 카테고리 파라미터 수정
      // API 명세: /member-service/members/1/search?category=java,python,C
      if (categories.length > 0) {
        // 기존: categories.forEach(category => params.append("category", category));
        params.append("category", categories.join(","));
      }

      // 페이지네이션 파라미터
      params.append("page", page);
      params.append("size", size);

      // gender 파라미터가 API 명세와 일치하는지 확인
      if (gender && gender !== "all") {
        params.append("gender", gender.toUpperCase()); // male -> MALE, female -> FEMALE
      }

      // age 파라미터가 API 명세와 일치하는지 확인
      if (ageRange && ageRange.start && ageRange.end) {
        params.append("age", `${ageRange.start}-${ageRange.end}`);
      }

      console.log(
        "API 요청 URL:",
        `/member-service/members/${userId}/search?${params.toString()}`,
      );

      const response = await api.get(
        `/member-service/members/${userId}/search?${params.toString()}`,
      );

      return {
        members: response.data.content.map((member) => ({
          id: member.id,
          nickname: member.nickname,
          age: member.age,
          gender: member.gender === "MALE" ? "남자" : "여자",
          subjects: member.categories.map((cat) => cat.name),
          profileImage: member.profileImage || "",
          showDetail: true,
          showAge: true,
          showGender: true,
        })),
        pagination: {
          currentPage: response.data.pageable.pageNumber,
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements,
          pageSize: response.data.pageable.pageSize,
        },
      };
    } catch (error) {
      console.error("멤버 검색 실패:", error);
      throw error;
    }
  },

  // 선생님 상세 정보 조회
  getTeacherDetail: async (teacherId) => {
    try {
      const response = await api.get(
        `/member-service/teachers/details/${teacherId}`,
      );

      // 응답 데이터를 컴포넌트에서 사용할 형태로 변환
      const teacherData = {
        id: teacherId,
        name: response.data.name,
        nickname: response.data.nickname,
        gender: response.data.gender === "MALE" ? "남자" : "여자",
        age: response.data.age,
        subjects: response.data.categories.map((cat) => cat.name),
        description: response.data.description,
        careerDescription: response.data.careerDescription,
        careerProgress: response.data.careerProgress,
        price: response.data.price,
        totalClassCount: response.data.totalClassCount,
        totalClassHours: response.data.totalClassHours,
      };

      return teacherData;
    } catch (error) {
      console.error("선생님 상세 정보 조회 실패:", error);
      throw error;
    }
  },

  // 학생 상세 정보 조회
  getStudentDetail: async (studentId) => {
    try {
      const response = await api.get(
        `/member-service/students/details/${studentId}`,
      );

      // StudentCardDetail 컴포넌트에서 사용할 수 있도록 데이터 변환
      const studentData = {
        id: studentId,
        name: response.data.name,
        nickname: response.data.nickname,
        gender: response.data.gender === "MALE" ? "남자" : "여자",
        age: response.data.age,
        subjects: response.data.categories.map((cat) => cat.name),
        description: response.data.description,
      };

      return studentData;
    } catch (error) {
      console.error("학생 상세 정보 조회 실패:", error);
      throw error;
    }
  },

  // 카테고리 목록 조회
  getCategories: async () => {
    try {
      const response = await api.get("/member-service/categories");
      console.log("카테고리 목록:", response.data);
      return response.data;
    } catch (error) {
      console.error("카테고리 목록 조회 실패:", error);
      throw error;
    }
  },

  // 회원 카테고리 입력 (최초 등록)
  createMemberCategories: async (categoryIds) => {
    try {
      const response = await api.post("/member-service/category", {
        categoryIds: categoryIds,
      });
      return response.data;
    } catch (error) {
      console.error("카테고리 입력 실패:", error);
      throw error;
    }
  },

  // 회원 카테고리 수정
  updateMemberCategories: async (userId, categoryIds) => {
    try {
      const response = await api.put(`/member-service/category/${userId}`, {
        categoryIds: categoryIds,
      });
      return response.data;
    } catch (error) {
      console.error("카테고리 수정 실패:", error);
      throw error;
    }
  },

  // 학생 카드 생성
  createStudentCard: async (isExposed, description) => {
    try {
      const response = await api.post("/member-service/students", {
        isExposed: isExposed,
        description: description,
      });
      return response.data;
    } catch (error) {
      console.error("학생 카드 생성 실패:", error);
      throw error;
    }
  },

  // 학생 카드 조회
  getStudentCard: async (userId) => {
    try {
      const response = await api.get(`/member-service/students/${userId}`);
      return response.data;
    } catch (error) {
      console.error("학생 카드 조회 실패:", error);
      throw error;
    }
  },

  // 학생 카드 수정
  updateStudentCard: async (userId, cardData) => {
    try {
      const response = await api.put(`/member-service/students/${userId}`, {
        isExposed: cardData.isExposed,
        description: cardData.description,
      });
      return response.data;
    } catch (error) {
      console.error("학생 카드 수정 실패:", error);
      throw error;
    }
  },

  // 선생님 카드 생성 API
  createTeacherCard: async (teacherCardData) => {
    try {
      const response = await api.post("/member-service/teachers", {
        description: teacherCardData.description,
        careerProgress: teacherCardData.careerProgress,
        careerDescription: teacherCardData.careerDescription,
        classContents: "없습니다",
        isWanted: teacherCardData.isWanted,
        bank: teacherCardData.bank,
        account: teacherCardData.account,
        price: Number(teacherCardData.price),
      });

      return response.data;
    } catch (error) {
      console.error("선생님 카드 생성 실패:", error);
      throw error;
    }
  },

  // 선생 카드 조회
  getTeacherCard: async (userId) => {
    try {
      const response = await api.get(`/member-service/teachers/${userId}`);
      return response.data;
    } catch (error) {
      console.error("선생 카드 조회 실패:", error);
      throw error;
    }
  },

  // 선생님 카드 수정 API
  updateTeacherCard: async (teacherCardData) => {
    try {
      const response = await api.put(
        `/member-service/teachers/${teacherCardData.id}`,
        {
          id: Number(teacherCardData.id),
          description: teacherCardData.description,
          careerProgress: teacherCardData.careerProgress,
          careerDescription: teacherCardData.careerDescription,
          classContents: "없습니다", // 고정값으로 설정
          isWanted: teacherCardData.isWanted,
          bank: teacherCardData.bank,
          account: teacherCardData.account,
          price: Number(teacherCardData.price),
        },
      );
      return response.data;
    } catch (error) {
      console.error("선생님 카드 수정 실패:", error);
      throw error;
    }
  },

  // 랭킹 목록 조회
  getRankingList: async () => {
    try {
      const response = await api.get("/member-service/members/ranking");
      console.log("랭킹 데이터 응답:", response.data);

      return response.data.map((member) => ({
        id: member.id,
        profileImage: member.profileImage,
        nickname: member.nickname,
        age: member.age,
        gender: member.gender === "MALE" ? "남자" : "여자",
        subjects: member.categories.map((cat) => cat.name),
        score: member.score.toFixed(0), // 소수점 제거
        showDetail: true,
        showAge: true,
        showGender: true,
      }));
    } catch (error) {
      console.error("랭킹 목록 조회 실패:", error);
      throw error;
    }
  },
};
