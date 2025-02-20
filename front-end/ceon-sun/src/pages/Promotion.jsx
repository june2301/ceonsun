import React, { useState, useEffect } from "react";
import promotion from "@/assets/img/promotion.png";

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
    <div className="min-h-screen h-full overflow-y-auto">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="max-w-[70%] mx-auto text-center relative">
          <img
            src={promotion}
            alt="프로모션 이미지"
            className="w-full h-auto object-cover rounded-xl border border-gray-300 border-[1px] mt-4"
          />
        </div>
      </div>
      <div className="flex flex-col items-center gap-10 mt-6 pb-20">
        {coupons.map((coupon) => (
          <div key={coupon.couponId} className="relative w-1/3">
            <p
              className="text-2xl font-bold text-sky-600 mb-2"
              style={{ marginLeft: "1.5rem" }}
            >
              {coupon.name}
            </p>

            <div className="bg-white rounded-lg shadow-md flex items-center justify-between p-6 border border-sky-300 w-full">
              <div>
                <p className="text-2xl font-bold text-sky-500">
                  {coupon.discountRate}% 할인
                </p>
                <p className="text-gray-700 mt-2">
                  남은 수량:{" "}
                  <span className="text-sky-600 font-semibold">
                    {coupon.remainingQuantity}개
                  </span>
                </p>
              </div>

              <div className="flex items-center justify-center">
                <button
                  className="px-4 py-2 bg-gradient-to-r from-sky-500 to-sky-400 text-white text-lg font-bold rounded-lg hover:opacity-90 transition"
                  onClick={() =>
                    handleIssueCoupon(coupon.couponId, coupon.validDays)
                  }
                >
                  발급하기
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="h-20"></div>
    </div>
  );
}

export default Promotion;
