import React from "react";

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

function TeacherInfoB({
  subjects = [],
  price = null, // lessonFee에서 price로 변경
  careerProgress = "", // lessonInfo에서 careerProgress로 변경
  bank = null, // 은행 정보 추가
  account = null, // 계좌번호 추가
}) {
  // 은행 코드를 라벨로 변환하는 함수
  const getBankLabel = (bankCode) => {
    return BANK_OPTIONS.find((opt) => opt.code === bankCode)?.label || bankCode;
  };

  return (
    <div className="w-full px-2 py-2">
      {/* 수업 과목: 버튼처럼 보이는 작은 네모 박스로 나열 (세로줄 없음) */}
      <h2 className="text-lg font-bold mb-2">수업 과목</h2>
      <div className="flex flex-wrap gap-2 mb-6">
        {subjects.length > 0 ? (
          subjects.map((subj) => (
            <span
              key={subj}
              className="px-3 py-1 rounded-full border-2 text-sm bg-white-100 border-gray-400"
            >
              {subj}
            </span>
          ))
        ) : (
          <span>등록된 과목이 없습니다.</span>
        )}
      </div>

      {/* 수업 진행 */}
      <h2 className="text-lg font-bold mb-2">수업 진행</h2>
      <div className="flex pl-1">
        <div className="border-l-4 border-gray-400 pl-2 mb-6">
          <p className="text-gray-800 whitespace-pre-line pl-1">
            {careerProgress}
          </p>
        </div>
      </div>

      {/* 계좌 정보 - bank와 account가 모두 있을 때만 표시 */}
      {bank && account && (
        <>
          <h2 className="text-lg font-bold mb-2">계좌 정보</h2>
          <div className="flex pl-1">
            <div className="border-l-4 border-gray-400 pl-1 mb-6">
              <p className="text-gray-800 pl-2">
                {getBankLabel(bank)} {account}
              </p>
            </div>
          </div>
        </>
      )}

      {/* 회당 수업료 */}
      <h2 className="text-lg font-bold mb-2">회당 수업료</h2>
      <div className="flex pl-1">
        <div className="border-l-4 border-gray-400 pl-1">
          <p className="text-gray-800 pl-2">{price} 원</p>
        </div>
      </div>
    </div>
  );
}

export default TeacherInfoB;
