import React, { useState, useEffect } from "react";
import { couponAPI } from "../api/services/coupon";

function Promotion() {
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const couponsData = await couponAPI.getCoupons();
        setCoupons(couponsData);
        console.log("쿠폰 데이터:", couponsData);
      } catch (error) {
        console.error("쿠폰 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  const handleIssueCoupon = async (couponId, validDays) => {
    try {
      await couponAPI.issueCoupon(couponId, validDays);
      alert("쿠폰이 발급되었습니다!");

      // 쿠폰 목록 새로고침
      const updatedCoupons = await couponAPI.getCoupons();
      setCoupons(updatedCoupons);
    } catch (error) {
      if (error.message === "이미 발급받은 쿠폰입니다.") {
        alert(error.message);
      } else {
        alert("쿠폰 발급에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center px-4 py-8">
      <div className="w-[800px] max-w-full">
        <h1 className="text-3xl font-bold text-center mb-8">
          대충 프로모션 페이지
        </h1>

        {/* 쿠폰 목록 */}
        <div className="space-y-6">
          {coupons.map((coupon) => (
            <div
              key={coupon.couponId}
              className="bg-white rounded-lg shadow-md p-6 relative"
            >
              {/* 쿠폰 정보 */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold mb-2">{coupon.name}</h2>
                  <div className="space-y-1 text-gray-600">
                    <p>
                      할인율:{" "}
                      <span className="font-semibold text-blue-600">
                        {coupon.discountRate}%
                      </span>
                    </p>
                    <p>
                      남은 수량:{" "}
                      <span className="font-semibold text-blue-600">
                        {coupon.remainingQuantity}개
                      </span>
                    </p>
                    <p>
                      사용 가능 기간:{" "}
                      <span className="font-semibold text-blue-600">
                        발급일로부터 {coupon.validDays}일
                      </span>
                    </p>
                  </div>
                </div>

                {/* 발급하기 버튼 */}
                <button
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-colors"
                  onClick={() =>
                    handleIssueCoupon(coupon.couponId, coupon.validDays)
                  }
                >
                  발급하기
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Promotion;
