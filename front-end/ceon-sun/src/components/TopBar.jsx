import React from "react";

function TopBar({
  menuItems = [],
  selectedIndex = 0,
  onSelectItem = () => {},
}) {
  return (
    <div className="border-b-2 border-gray-300 flex">
      {menuItems.map((item, idx) => {
        // 현재 인덱스와 selectedIndex 비교
        const isSelected = idx === selectedIndex;
        return (
          <div
            key={idx}
            className="flex-1 flex items-center justify-center pb-2"
          >
            <button
              onClick={() => onSelectItem(idx)}
              className={`
                py-2 w-full text-center
                text-lg font-semibold
                ${isSelected ? "text-black" : "text-gray-400"}
                hover:text-blue-400
              `}
            >
              {item}
            </button>
            {/* 세로 구분선 (마지막 버튼 제외) */}
            {idx < menuItems.length - 1 && (
              <div className="w-[2px] h-8 bg-gray-300" />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default TopBar;
