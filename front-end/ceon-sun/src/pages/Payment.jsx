import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { couponAPI } from "../api/services/coupon";
import { paymentAPI } from "../api/services/payment"; // 백엔드 결제 요청 API

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // state가 없으면 메인 페이지로 리다이렉트
  useEffect(() => {
    if (!state) {
      console.error("결제 정보가 없습니다.");
      navigate("/mainpage");
      return;
    }
  }, [state, navigate]);

  const { contractedClassId, price } = state || {};
  const [lessonFee] = useState(price);
  const [lessonCount, setLessonCount] = useState(1);
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 페이지 로드 시 쿠폰 목록 조회
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setIsLoading(true);
        const couponsData = await couponAPI.getMyCoupons();
        // 날짜 포맷 변환만 수행
        const formattedCoupons = couponsData.map((coupon) => ({
          id: coupon.couponId,
          name: coupon.name,
          discountRate: coupon.discountRate,
          expiryDate: new Date(coupon.expiryDate).toLocaleDateString(),
        }));
        setCoupons(formattedCoupons);
      } catch (error) {
        console.error("쿠폰 목록 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoupons();
  }, []);

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

  // PortOne 스크립트를 사용하기 위해 컴포넌트 마운트 시점에 IMP.init() 진행
  useEffect(() => {
    if (window.IMP) {
      // .env 파일에 저장된 PORTONE_API_KEY를 사용 (VITE_PORTONE_API_KEY로 설정)
      window.IMP.init(import.meta.env.VITE_PORTONE_API_KEY);
    }
  }, []);

  // 결제 진행 버튼 핸들러
  const handlePayment = () => {
    if (!window.IMP) {
      alert("결제 연동에 문제가 있습니다. 관리자에게 문의해주세요.");
      return;
    }

    // 결제에 필요한 데이터
    const data = {
      pg: "html5_inicis",
      pay_method: "card",
      merchant_uid: `mid_${new Date().getTime()}`,
      name: "수업 결제",
      amount: finalAmount,
    };

    console.log("결제 요청 데이터:", {
      ...data,
      lessonCount,
      selectedCoupon: selectedCoupon
        ? {
            id: selectedCoupon.id,
            name: selectedCoupon.name,
            discountRate: selectedCoupon.discountRate,
          }
        : null,
      contractedClassId,
    });

    // 결제 요청
    window.IMP.request_pay(data, async (response) => {
      if (response.success) {
        console.log("결제 성공:", response);

        try {
          console.log("백엔드 결제 요청 데이터:", {
            impUid: response.imp_uid,
            merchantUid: response.merchant_uid,
            amount: finalAmount,
            couponId: selectedCoupon?.id || null,
            count: lessonCount,
            contractedClassId,
          });

          // 백엔드 결제 검증 API 호출
          const paymentResponse = await paymentAPI.requestPayment({
            impUid: response.imp_uid,
            merchantUid: response.merchant_uid,
            amount: finalAmount,
            couponId: selectedCoupon ? selectedCoupon.id : null,
            count: lessonCount,
            contractedClassId: contractedClassId,
          });

          console.log("백엔드 결제 검증 응답:", paymentResponse);

          // 백엔드에서 받은 결제 상태 확인
          if (paymentResponse.status === "paid") {
            console.log("결제 프로세스 완료:", {
              status: "success",
              finalAmount,
              lessonCount,
              usedCoupon: selectedCoupon?.name,
            });
            alert("결제에 성공했습니다.");
            navigate("/mypage", {
              state: { selectedMenu: "수강 정보" },
            });
          } else {
            console.error("결제 상태 불일치:", paymentResponse.status);
            alert("결제에 실패했습니다.");
          }
        } catch (error) {
          console.error("백엔드 결제 검증 실패:", error);
          console.error("에러 상세 정보:", {
            message: error.message,
            response: error.response?.data,
          });
          alert("결제에 실패했습니다.");
        }
      } else {
        console.log("포트원 결제 실패:", {
          errorMsg: response.error_msg,
          errorCode: response.error_code,
          response,
        });
        alert(`결제 실패: ${response.error_msg}`);
      }
    });
  };

  return (
    <div className="max-w-[660px] mx-auto p-5">
      <div className="mt-4 mb-8">
        <h2 className="text-xl font-semibold mb-5">수강료</h2>
        <div className="px-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-base">1회당 수강료 :</span>
            <span className="text-base font-bold">
              {lessonFee?.toLocaleString()} 원
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
                {selectedCoupon
                  ? `${selectedCoupon.name} (${selectedCoupon.discountRate}% 할인)`
                  : "보유중인 쿠폰 선택"}
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
                {isLoading ? (
                  <div className="p-4 text-center text-gray-500">
                    쿠폰 목록을 불러오는 중...
                  </div>
                ) : coupons.length > 0 ? (
                  coupons.map((coupon) => (
                    <div
                      key={coupon.id}
                      className="flex justify-between items-center p-4 hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setSelectedCoupon(coupon);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <div className="flex flex-col">
                        <span className="text-gray-700">{coupon.name}</span>
                        <span className="text-sm text-gray-500">
                          {coupon.discountRate}% 할인 (~{coupon.expiryDate})
                        </span>
                      </div>
                      <span className="text-blue-600 font-medium">선택</span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    사용 가능한 쿠폰이 없습니다.
                  </div>
                )}
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
            {discountAmount.toLocaleString()} 원 ={" "}
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
