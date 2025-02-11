import React from "react";
import defaultProfileImg from "@/assets/img/default-profile.png"; // 기본 프로필 이미지 경로 (환경에 맞게 수정)

function DefaultProfile({
  name,
  nickname,
  birthdate,
  gender,
  profileImage,
  isLarge,
}) {
  // birthdate로부터 나이 계산
  const calculateAge = (birthdate) => {
    if (!birthdate) return null;

    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // 생일이 아직 지나지 않은 경우 1을 빼줌
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const age = calculateAge(birthdate);

  return (
    <div
      className={`flex ${
        isLarge ? "items-center space-x-6" : "items-center space-x-6"
      }`}
    >
      {/* 프로필 이미지 */}
      <div
        className={`${
          isLarge ? "w-36 h-36" : "w-20 h-20"
        } bg-white border border-gray-300 rounded-md overflow-hidden flex-shrink-0`}
      >
        <img
          src={profileImage || defaultProfileImg}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>

      {/* 프로필 정보 */}
      <div
        className={`text-gray-800 ${
          isLarge ? "space-y-2" : "grid grid-cols-2 gap-x-20 gap-y-2"
        }`}
      >
        <div>
          <span className="font-bold">닉네임 :</span> {nickname}
        </div>
        <div>
          <span className="font-bold">이름 :</span> {name}
        </div>
        <div>
          <span className="font-bold">나이 :</span> {age}세{" "}
          {birthdate && `(${birthdate.split("-").join(".")})`}
        </div>
        <div>
          <span className="font-bold">성별 :</span>{" "}
          {gender === "MALE" ? "남" : "여"}
        </div>
      </div>
    </div>
  );
}

export default DefaultProfile;
