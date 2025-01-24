import React from "react";

const PromotionLink = () => {
  return (
    <div className="bg-blue-100 w-full py-4">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* 콘텐츠를 60% 영역으로 제한 */}
        <div className="max-w-[60%] mx-auto text-center">
          {/* 프로모션 이미지 */}
          <a href="#" className="inline-block">
            <img
              src="/path/to/your/promotion-image.png" // 이미지 경로를 실제 이미지로 교체
              alt="프로모션 이미지"
              className="w-full h-auto object-contain"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default PromotionLink;
