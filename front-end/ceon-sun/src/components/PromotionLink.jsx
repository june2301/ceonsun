import React from "react";
import { useNavigate } from "react-router-dom";

const PromotionLink = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/promotion");
  };

  return (
    <div
      className="bg-blue-100 w-full py-4 mb-6 cursor-pointer"
      onClick={handleClick}
    >
      <div className="max-w-screen-xl mx-auto px-4">
        {/* 콘텐츠를 60% 영역으로 제한 */}
        <div className="max-w-[60%] mx-auto text-center">
          {/* 프로모션 이미지 */}
          <div className="w-full">
            <img
              src="/path/to/your/promotion-image.png"
              alt="프로모션 이미지"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionLink;
