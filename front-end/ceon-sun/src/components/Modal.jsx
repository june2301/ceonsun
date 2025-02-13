import React from "react";

function Modal({ isOpen, onClose, onConfirm, nickname, who, what, notice }) {
  if (!isOpen) return null;

  // 모달 외부 클릭 시 닫기
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    // onClick 이벤트를 배경에 추가
    <div
      className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50"
      onClick={handleBackgroundClick}
    >
      {/* 모달 컨테이너 */}
      <div className="bg-white rounded-2xl p-6 w-[400px] shadow-lg">
        {/* 닉네임 영역 */}
        <div className="text-center font-bold mb-1">
          <span className="text-2xl">{nickname}</span>
          <span className="text-base ml-2">{who}</span>
        </div>

        {/* 설명 영역 */}
        <div className="text-center font-semibold text-gray-800 mb-4">
          {what}
        </div>

        {/* 주의 문구 */}
        <div className="text-center text-sm text-gray-400 mb-4">{notice}</div>

        {/* 버튼 영역 */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={onConfirm}
            className="px-8 py-2 bg-blue-100 text-black rounded-full hover:bg-blue-200 transition"
          >
            확인
          </button>
          <button
            onClick={onClose}
            className="px-8 py-2 bg-gray-200 text-black rounded-full hover:bg-gray-300 transition"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
