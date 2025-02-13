import React, { useState, useEffect } from "react";
import useTeacherCardStore from "../stores/teacherCardStore";
import { memberAPI } from "../api/services/member";

const BANK_OPTIONS = [
  { label: "KB국민", code: "KB" },
  { label: "신한", code: "SHINHAN" },
  { label: "우리", code: "WOORI" },
  { label: "하나", code: "HANA" },
  { label: "농협", code: "NONGHYUP" },
  { label: "기업", code: "IBK" },
  { label: "SC제일", code: "SC" },
  { label: "카카오뱅크", code: "KAKAO" },
  { label: "토스뱅크", code: "TOSS" },
  { label: "케이뱅크", code: "KEBANK" },
];

function TeacherInfoCreateB({
  // 업데이트 모드 여부
  updateMode = false,
  // 업데이트 모드일 때 초기 데이터
  subjects: initialSubjects = [],
  lessonInfo: initialLessonInfo = "",
  lessonFee: initialLessonFee = "",
  bank: initialBank = "",
  account: initialAccount = "",
  // 업데이트 모드에서의 콜백 함수들
  onClose,
  onUpdate,
  onSubmit,
}) {
  const { teacherCardData, updateTeacherCardB } = useTeacherCardStore();
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(
    teacherCardData.subjects || [],
  );
  const [careerProgress, setCareerProgress] = useState(
    teacherCardData.careerProgress,
  );
  const [price, setPrice] = useState(teacherCardData.price);
  const [bank, setBank] = useState(teacherCardData.bank);
  const [account, setAccount] = useState(teacherCardData.account);
  const [showBankList, setShowBankList] = useState(false);

  // 컴포넌트 마운트 시 카테고리 목록 조회
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await memberAPI.getCategories();
        setCategories(data);
      } catch (error) {
        console.error("카테고리 목록 조회 실패:", error);
      }
    };
    fetchCategories();
  }, []);

  // 카테고리 선택 핸들러
  const handleCategoryClick = (category) => {
    const isSelected = selectedCategories.some((cat) => cat.id === category.id);
    let newSelectedCategories = isSelected
      ? selectedCategories.filter((cat) => cat.id !== category.id)
      : [...selectedCategories, category];

    setSelectedCategories(newSelectedCategories);
    updateTeacherCardB({
      ...teacherCardData,
      subjects: newSelectedCategories,
    });
  };

  // 입력값 변경 시마다 store 업데이트
  const handleCareerProgressChange = (e) => {
    const newCareerProgress = e.target.value;
    setCareerProgress(newCareerProgress);
    updateTeacherCardB({
      subjects: selectedCategories,
      careerProgress: newCareerProgress,
      price,
      bank,
      account,
    });
  };

  // 수업료 입력 처리 (숫자만 입력 가능)
  const handleLessonFeeChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setPrice(value);
    updateTeacherCardB({
      subjects: selectedCategories,
      careerProgress,
      price: Number(value),
      bank,
      account,
    });
  };

  // 계좌번호 입력 처리 (숫자와 하이픈만 입력 가능)
  const handleAccountChange = (e) => {
    const value = e.target.value.replace(/[^0-9-]/g, "");
    setAccount(value);
    updateTeacherCardB({
      subjects: selectedCategories,
      careerProgress,
      price,
      bank,
      account: value,
    });
  };

  // 2) 은행 선택 처리
  const handleBankSelect = (selectedBankObj) => {
    // 클릭된 객체의 code만 최종 bank state에 저장
    setBank(selectedBankObj.code);
    setShowBankList(false);

    updateTeacherCardB({
      subjects: selectedCategories,
      careerProgress,
      price,
      bank: selectedBankObj.code, // ENUM 값만 저장
      account,
    });
  };

  // 작성 모드 제출 함수
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      subjects: selectedCategories,
      careerProgress,
      price: Number(price),
      bank,
      account,
    };
    updateTeacherCardB(data);
    onSubmit?.();
  };

  // 업데이트 모드 제출 함수
  const handleUpdate = (e) => {
    e.preventDefault();
    const teacherInfoData = {
      subjects: selectedCategories,
      careerProgress,
      price: Number(price),
      bank,
      account,
    };
    console.log("Teacher Info Data (수정):", teacherInfoData);
    if (onUpdate) onUpdate(teacherInfoData);
  };

  // updateMode가 변경되었을 때, 초기값으로 상태 업데이트
  useEffect(() => {
    if (updateMode) {
      setSelectedCategories(teacherCardData.subjects);
      setCareerProgress(teacherCardData.careerProgress);
      setPrice(teacherCardData.price.toString());
      setBank(teacherCardData.bank);
      setAccount(teacherCardData.account);
    }
  }, [
    updateMode,
    teacherCardData.subjects,
    teacherCardData.careerProgress,
    teacherCardData.price,
    teacherCardData.bank,
    teacherCardData.account,
  ]);

  return (
    <form
      onSubmit={updateMode ? handleUpdate : handleSubmit}
      className="bg-white p-2"
    >
      {/* 1. 수업 과목 선택 */}
      <div className="mx-2 mb-8">
        <label className="block text-gray-700 font-bold mb-2">
          수업 과목
          <span className="text-gray-500 text-xs ml-2">복수 선택 가능</span>
        </label>
        <div className="ml-4 flex flex-wrap gap-2 justify-start">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => handleCategoryClick(category)}
              className={`px-3 py-1 rounded-full border-2 text-sm
                ${
                  selectedCategories.some((cat) => cat.id === category.id)
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white border-gray-400"
                }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* 2. 수업 진행 방식 */}
      <div className="mx-2 mb-8">
        <label className="block text-gray-700 font-bold mb-2">수업 진행</label>
        <div className="ml-4">
          <textarea
            value={careerProgress}
            onChange={handleCareerProgressChange}
            className="w-full p-2 border border-gray-300 rounded resize-none"
            rows="4"
            placeholder="수업 진행 방식에 대해 작성해보세요."
          />
        </div>
      </div>

      {/* 계좌 정보 */}
      <div className="mx-2 mb-8">
        <label className="block text-gray-700 font-bold mb-2">계좌 정보</label>
        <div className="ml-4 flex items-center relative">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowBankList(!showBankList)}
              className="w-32 p-2 border border-gray-300 rounded text-left bg-white flex justify-between items-center"
            >
              {
                /* 3) 화면에 표시할 때는 code -> label 변환 */
                BANK_OPTIONS.find((opt) => opt.code === bank)?.label || "은행"
              }
              <span className="text-gray-500">{showBankList ? "▲" : "▼"}</span>
            </button>
            {showBankList && (
              <div className="absolute top-[calc(100%-1px)] left-0 w-32 bg-white border border-gray-300 rounded-b shadow-lg z-10 max-h-40 overflow-y-auto custom-scrollbar">
                {BANK_OPTIONS.map((bankObj) => (
                  <button
                    key={bankObj.code}
                    type="button"
                    onClick={() => handleBankSelect(bankObj)}
                    className="w-full px-3 py-2 text-left hover:bg-gray-100"
                  >
                    {bankObj.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <input
            type="text"
            value={account}
            onChange={handleAccountChange}
            className="ml-2 flex-1 p-2 border border-gray-300 rounded"
            placeholder="계좌번호 입력"
          />
        </div>
      </div>

      {/* 3. 회당 수업료 */}
      <div className="mx-2 mb-8">
        <label className="block text-gray-700 font-bold mb-2">
          회당 수업료
        </label>
        <div className="ml-4 flex items-center">
          <input
            type="text"
            value={price}
            onChange={handleLessonFeeChange}
            className="w-40 p-2 border border-gray-300 rounded text-right"
            placeholder="0"
          />
          <span className="ml-2 text-gray-600">원</span>
        </div>
      </div>

      {/* 하단 버튼 영역 */}
      <div className="mx-2 flex justify-end">
        {updateMode ? (
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
          >
            수정 완료
          </button>
        ) : (
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
          >
            등록하기
          </button>
        )}
      </div>
    </form>
  );
}

export default TeacherInfoCreateB;
