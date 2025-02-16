import React, { useEffect, useState } from "react";
import { LightBulbIcon } from "@heroicons/react/24/outline";
import AlarmCard from "./AlarmCard";
import {
  getAllNotifications,
  checkUnreadNotifications,
} from "../api/services/notification";
import useAuthStore from "../stores/authStore";

function AlarmList({ onClose }) {
  const [alarms, setAlarms] = useState([]);
  const { user } = useAuthStore();

  // 알림 정렬 함수
  const sortAlarms = (notifications) => {
    return [...notifications].sort((a, b) => {
      // 먼저 읽음 상태로 정렬
      if (a.read !== b.read) {
        return a.read ? 1 : -1; // 안읽은 알림이 위로
      }
      // 같은 읽음 상태 내에서는 시간순 정렬 (id로 대체)
      return b.id.localeCompare(a.id);
    });
  };

  useEffect(() => {
    const fetchAlarms = async () => {
      if (user.userId) {
        const notifications = await getAllNotifications(user.userId);
        setAlarms(sortAlarms(notifications));
      }
    };

    fetchAlarms();
  }, [user.userId]);

  const handleAlarmRead = async (alarmId) => {
    // 알림 목록 업데이트 및 재정렬
    setAlarms((prevAlarms) => {
      const updatedAlarms = prevAlarms.map((alarm) =>
        alarm.id === alarmId ? { ...alarm, read: true } : alarm,
      );
      return sortAlarms(updatedAlarms);
    });

    // 안읽은 알림 상태 재확인
    if (user.userId) {
      const hasUnread = await checkUnreadNotifications(user.userId);
      // Header 컴포넌트 상태 업데이트를 위한 이벤트 발생
      window.dispatchEvent(
        new CustomEvent("unreadNotificationUpdate", { detail: hasUnread }),
      );
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* 헤더 */}
      <div className="h-14 flex items-center px-4 border-b bg-orange-200">
        <div className="flex items-center">
          <LightBulbIcon className="w-8 h-8 text-gray-900 mr-2" />
          <h2 className="text-lg font-semibold text-gray-800">알림</h2>
        </div>
      </div>

      {/* 알림 목록 - custom-scrollbar 클래스 추가 */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {alarms.map((alarm) => (
          <AlarmCard key={alarm.id} alarm={alarm} onRead={handleAlarmRead} />
        ))}
      </div>
    </div>
  );
}

export default AlarmList;
