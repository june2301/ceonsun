import React, { useState, useEffect } from "react";
import axios from "axios";

const Payment = () => {
  const [lessonFee, setLessonFee] = useState(40000); // 임시 수강료 데이터
  const [lessonCount, setLessonCount] = useState(1);
  const [coupons, setCoupons] = useState([
    // 임시 쿠폰 데이터
    { id: 1, name: "신규 가입 할인 10%", discountRate: 10 },
    { id: 2, name: "여름방학 특별 할인 15%", discountRate: 15 },
    { id: 3, name: "첫 수강 할인 20%", discountRate: 20 },
  ]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // API 연동 전까지는 useEffect 주석 처리
  /*
  useEffect(() => {
    const fetchData = async () => {
      try {
        const feeResponse = await axios.get("/api/lesson-fee");
        const couponResponse = await axios.get("/api/coupons");
        setLessonFee(feeResponse.data.fee);
        setCoupons(couponResponse.data);
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      }
    };
    fetchData();
  }, []);
  */

  const totalLessonFee = lessonFee * lessonCount;
  const discountAmount = selectedCoupon
    ? Math.floor(totalLessonFee * (selectedCoupon.discountRate / 100))
    : 0;
  const finalAmount = totalLessonFee - discountAmount;

  const handleCountChange = (change) => {
    const newCount = lessonCount + change;
    if (newCount >= 1) {
      setLessonCount(newCount);
    }
  };

  const handlePayment = () => {
    // 결제 로직 구현
    console.log("결제 진행");
  };

  return (
    <div className="max-w-[660px] mx-auto p-5">
      <div className="mt-4 mb-8">
        <h2 className="text-xl font-semibold mb-5">수강료</h2>
        <div className="px-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-base">1회당 수강료 :</span>
            <span className="text-base font-bold">
              {lessonFee.toLocaleString()} 원
            </span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-base">수업 횟수 :</span>
            <div className="flex items-center gap-3">
              <button
                className="w-8 h-8 border border-gray-300 rounded-md bg-white cursor-pointer"
                onClick={() => handleCountChange(-1)}
              >
                -
              </button>
              <span className="text-base min-w-[40px] text-center">
                {lessonCount} 회
              </span>
              <button
                className="w-8 h-8 border border-gray-300 rounded-md bg-white cursor-pointer"
                onClick={() => handleCountChange(1)}
              >
                +
              </button>
            </div>
          </div>
          <hr className="mt-8 mb-5 border-t border-gray-200" />
          <div className="flex justify-between items-center mb-4">
            <span className="text-base">전체 수강료 :</span>
            <span className="text-base font-bold">
              {totalLessonFee.toLocaleString()} 원
            </span>
          </div>
        </div>
      </div>

      <hr className="my-8 border-t-4 border-gray-200" />
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-5">할인 쿠폰</h2>
        <div className="px-4">
          <div className="relative">
            <div
              className={`p-3 border border-gray-300 cursor-pointer bg-white shadow-sm flex justify-between items-center ${
                isDropdownOpen ? "rounded-t-lg" : "rounded-lg"
              }`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="text-gray-600">
                {selectedCoupon ? selectedCoupon.name : "보유중인 쿠폰 선택"}
              </span>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            {isDropdownOpen && (
              <div className="absolute left-0 right-0 bg-white border-x border-b border-gray-300 rounded-b-lg shadow-lg overflow-hidden z-10">
                {coupons.map((coupon, index) => (
                  <div
                    key={coupon.id}
                    className={`flex justify-between items-center p-4 hover:bg-gray-50 ${
                      index !== coupons.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedCoupon(coupon);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <span className="text-gray-700">{coupon.name}</span>
                    <span className="text-blue-600 font-medium">선택</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mt-6 flex justify-between items-center mb-4">
            <span className="text-base">할인 금액 :</span>
            <span className="text-base font-bold text-green-500">
              {discountAmount.toLocaleString()} 원
            </span>
          </div>
        </div>
      </div>

      <hr className="my-8 border-t-4 border-gray-200" />
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-5">총 결제 금액</h2>
        <div className="px-4">
          <div className="flex items-center gap-3 text-lg">
            {totalLessonFee.toLocaleString()} 원 -{" "}
            {discountAmount.toLocaleString()} 원 =
            <span className="text-2xl font-bold text-blue-500 ml-2">
              {finalAmount.toLocaleString()} 원
            </span>
          </div>
        </div>
      </div>

      <button
        className="w-[120px] h-[40px] bg-blue-500 text-white rounded-md text-base cursor-pointer float-right hover:bg-blue-600"
        onClick={handlePayment}
      >
        결제하기
      </button>
    </div>
  );
};

export default Payment;
