import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import TeacherAction from "../components/TeacherAction";
import TeacherDetail from "../components/TeacherDetail";
import { memberAPI } from "../api/services/member";

function TeacherDetailPage() {
  const location = useLocation();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeacherDetail = async () => {
      try {
        const teacherId = location.state?.teacher?.id;
        if (!teacherId) {
          throw new Error("선생님 ID가 없습니다.");
        }

        const teacherData = await memberAPI.getTeacherDetail(teacherId);
        setTeacher(teacherData);
      } catch (err) {
        setError(err.message);
        console.error("선생님 상세 정보를 불러오는데 실패했습니다:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherDetail();
  }, [location.state?.teacher?.id]);

  const handleBack = () => {
    window.history.back();
  };

  const topBarItems = ["선생님 소개", "수업 설명"];

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;
  if (!teacher) return <div>선생님 정보를 찾을 수 없습니다.</div>;

  return (
    <div className="h-[calc(100vh-96px)] w-full flex flex-col overflow-hidden">
      <div className="flex-1 flex justify-center overflow-hidden">
        <div className="flex w-[860px]">
          <TeacherAction teacher={teacher} onBack={handleBack} />
          <div className="flex flex-col pl-2 w-full">
            <TeacherDetail teacher={teacher} topBarItems={topBarItems} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherDetailPage;
