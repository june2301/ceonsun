import React, { useState, useEffect } from "react";

const SUBJECTS = [
  "Python",
  "Java",
  "JavaScript",
  "C",
  "C#",
  "C++",
  "TypeScript",
  "Kotlin",
  "Swift",
];

function TeacherInfoCreateB({
  // 업데이트 모드 여부
  updateMode = false,
  // 업데이트 모드일 때 초기 데이터
  subjects: initialSubjects = [],
  lessonInfo: initialLessonInfo = "",
  lessonFee: initialLessonFee = "",
  // 업데이트 모드에서의 콜백 함수들
  onClose,
  onUpdate,
}) {
  const [selectedSubjects, setSelectedSubjects] = useState(initialSubjects);
  const [lessonInfo, setLessonInfo] = useState(initialLessonInfo);
  const [lessonFee, setLessonFee] = useState(initialLessonFee);

  // 과목 선택/해제 처리
  const handleSubjectClick = (subj) => {
    if (selectedSubjects.includes(subj)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subj));
    } else {
      setSelectedSubjects([...selectedSubjects, subj]);
    }
  };

  // 수업료 입력 처리 (숫자만 입력 가능)
  const handleLessonFeeChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setLessonFee(value);
  };

  // 작성 모드 제출 함수
  const handleSubmit = (e) => {
    e.preventDefault();
    const teacherInfoData = {
      selectedSubjects,
      lessonInfo,
      lessonFee: Number(lessonFee),
    };
    console.log("Teacher Info Data (작성):", teacherInfoData);
    // TODO: 입력 데이터를 백엔드로 전송하는 로직 추가
  };

  // 업데이트 모드 제출 함수
  const handleUpdate = (e) => {
    e.preventDefault();
    const teacherInfoData = {
      selectedSubjects,
      lessonInfo,
      lessonFee: Number(lessonFee),
    };
    console.log("Teacher Info Data (수정):", teacherInfoData);
    if (onUpdate) onUpdate(teacherInfoData);
  };

  // updateMode가 변경되었을 때, 초기값으로 상태 업데이트
  useEffect(() => {
    if (updateMode) {
      setSelectedSubjects(initialSubjects);
      setLessonInfo(initialLessonInfo);
      setLessonFee(initialLessonFee);
    }
  }, [updateMode, initialSubjects, initialLessonInfo, initialLessonFee]);

  return (
    <form
      onSubmit={updateMode ? handleUpdate : handleSubmit}
      className="bg-white p-2"
    >
      {/* 1. 수업 과목 선택 */}
      <div className="mx-2 mb-8">
        <label className="block text-gray-700 font-bold mb-2">
          수업 과목
          <span className="text-gray-500 text-xs ml-2">복수 선택 가능</span>
        </label>
        <div className="ml-4 flex flex-wrap gap-2 justify-start">
          {SUBJECTS.map((subj) => {
            const selected = selectedSubjects.includes(subj);
            return (
              <button
                key={subj}
                type="button"
                onClick={() => handleSubjectClick(subj)}
                className={`
                  px-3 py-1 rounded-full border text-sm
                  ${
                    selected
                      ? "bg-sky-100 border-blue-300"
                      : "bg-white-100 border-gray-300"
                  }
                `}
              >
                {subj}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. 수업 진행 방식 */}
      <div className="mx-2 mb-8">
        <label className="block text-gray-700 font-bold mb-2">수업 진행</label>
        <div className="ml-4">
          <textarea
            value={lessonInfo}
            onChange={(e) => setLessonInfo(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded resize-none"
            rows="4"
            placeholder="수업 진행 방식에 대해 작성해보세요."
          />
        </div>
      </div>

      {/* 3. 회당 수업료 */}
      <div className="mx-2 mb-8">
        <label className="block text-gray-700 font-bold mb-2">
          회당 수업료
        </label>
        <div className="ml-4 flex items-center">
          <input
            type="text"
            value={lessonFee}
            onChange={handleLessonFeeChange}
            className="w-40 p-2 border border-gray-300 rounded text-right"
            placeholder="0"
          />
          <span className="ml-2 text-gray-600">원</span>
        </div>
      </div>

      {/* 하단 버튼 영역 */}
      <div className="mx-2 flex justify-end">
        {updateMode ? (
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
          >
            수정 완료
          </button>
        ) : (
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition"
          >
            등록하기
          </button>
        )}
      </div>
    </form>
  );
}

export default TeacherInfoCreateB;
