import React from "react";

function LeftBar({ userRole, selectedMenu, onMenuSelect }) {
  let menuItems = [];

  if (userRole === "none") {
    menuItems = ["내 정보", "수강 정보", "수업 정보"];
  } else if (userRole === "student") {
    menuItems = ["내 정보", "수강 정보"];
  } else if (userRole === "teacher") {
    menuItems = ["내 정보", "수업 정보", "내 학생 목록"];
  }

  return (
    <div className="flex flex-col space-y-4 p-4">
      {menuItems.map((item, index) => (
        <button
          key={index}
          onClick={() => onMenuSelect(item)}
          className={`h-[60px] flex items-center justify-center px-4 rounded ${
            selectedMenu === item ? "bg-sky-200 font-bold" : "text-gray-500"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export default LeftBar;
