import React from "react";
import { LightBulbIcon } from "@heroicons/react/24/outline";
import AlarmCard from "./AlarmCard";

function AlarmList({ onClose }) {
  // 임시 알림 데이터
  const alarms = [
    {
      id: 1,
      type: "notification",
      message: "새 과외신청이 왔습니다.",
      isRead: false,
      createdAt: "1분 전",
    },
    {
      id: 2,
      type: "chat",
      message: "새 과외문의가 왔습니다.",
      isRead: false,
      createdAt: "10분 전",
    },
    {
      id: 3,
      type: "notification",
      message: "새 과외신청이 왔습니다",
      isRead: true,
      createdAt: "1시간 전",
    },
    {
      id: 4,
      type: "chat",
      message: "새 과외문의가 왔습니다.",
      isRead: true,
      createdAt: "2시간 전",
    },
  ];

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* 헤더 */}
      <div className="h-14 flex items-center px-4 border-b bg-orange-200">
        <div className="flex items-center">
          <LightBulbIcon className="w-8 h-8 text-gray-900 mr-2" />
          <h2 className="text-lg font-semibold text-gray-800">알림</h2>
        </div>
      </div>

      {/* 알림 목록 */}
      <div className="flex-1 overflow-y-auto">
        {alarms.map((alarm) => (
          <AlarmCard key={alarm.id} alarm={alarm} />
        ))}
      </div>
    </div>
  );
}

export default AlarmList;
