import { create } from "zustand";

const useTeacherCardStore = create((set) => ({
  // 상태
  teacherCardData: {
    // TeacherInfoCreateA 데이터
    description: "",
    careerDescription: "",
    isWanted: true,

    // TeacherInfoCreateB 데이터
    subjects: [],
    careerProgress: "",
    price: "",
    bank: "",
    account: "",
  },

  // 액션
  updateTeacherCardA: (dataA) =>
    set((state) => ({
      teacherCardData: {
        ...state.teacherCardData,
        description: dataA.description,
        careerDescription: dataA.careerDescription,
        isWanted: dataA.isWanted,
      },
    })),

  updateTeacherCardB: (dataB) =>
    set((state) => ({
      teacherCardData: {
        ...state.teacherCardData,
        subjects: dataB.subjects,
        careerProgress: dataB.careerProgress,
        price: dataB.price,
        bank: dataB.bank,
        account: dataB.account,
      },
    })),

  // 초기화
  resetTeacherCard: () =>
    set({
      teacherCardData: {
        description: "",
        careerDescription: "",
        isWanted: true,
        subjects: [],
        careerProgress: "",
        price: "",
        bank: "",
        account: "",
      },
    }),

  // 수정 모드를 위한 전체 데이터 설정
  setTeacherCard: (data) =>
    set({
      teacherCardData: data,
    }),
}));

export default useTeacherCardStore;
