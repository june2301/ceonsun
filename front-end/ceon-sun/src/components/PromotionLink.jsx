import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bannerImage1 from "@/assets/img/banner1.png";
import bannerImage2 from "@/assets/img/banner2.png";
import bannerImage3 from "@/assets/img/banner3.png";
import bannerImage4 from "@/assets/img/banner4.png";
import "@/assets/css/PromotionLink.css";

const PromotionLink = () => {
  const navigate = useNavigate();
  const images = [bannerImage1, bannerImage2, bannerImage3, bannerImage4];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState("slide-in");

  // 1초마다 이미지 전환
  useEffect(() => {
    const interval = setInterval(() => {
      setSlideDirection("slide-out"); // 슬라이드 아웃 애니메이션 시작

      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setSlideDirection("slide-in"); // 슬라이드 인 애니메이션 시작
      }, 500); // 0.5초 후 이미지 전환
    }, 3000); // 3초마다 이미지 전환

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 해제
  }, [images.length]);

  const handleClick = () => {
    navigate("/promotion");
  };

  return (
    <div
      className="bg-gray-100 w-full py-4 mb-6 cursor-pointer overflow-hidden"
      onClick={handleClick}
    >
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="max-w-[60%] mx-auto text-center relative">
          <div className={`w-full ${slideDirection}`}>
            <img
              src={images[currentImageIndex]}
              alt="프로모션 이미지"
              className="w-full h-auto object-cover rounded-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionLink;
