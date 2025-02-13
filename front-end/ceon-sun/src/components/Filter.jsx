import React, { useState, useEffect } from "react";
import { memberAPI } from "../api/services/member";

// 나이 예시: 15 ~ 60
const AGE_OPTIONS = Array.from({ length: 46 }, (_, i) => 15 + i);

function Filter({ filterState, onFilterChange }) {
  // 필터 펼침 여부
  const [openSubject, setOpenSubject] = useState(false);
  const [openGender, setOpenGender] = useState(false);
  const [openAge, setOpenAge] = useState(false);

  // 과목 선택
  const [selectedSubjects, setSelectedSubjects] = useState(
    filterState.categories || [],
  );

  // 성별: "all" | "male" | "female"
  const [selectedGender, setSelectedGender] = useState(
    filterState.gender || "all",
  );

  // 나이 초기값 설정
  const [startAge, setStartAge] = useState(filterState.ageRange?.start || 20); // 기본값 20
  const [endAge, setEndAge] = useState(filterState.ageRange?.end || 40); // 기본값 40

  // 나이 팝업
  const [openStartAgePopup, setOpenStartAgePopup] = useState(false);
  const [openEndAgePopup, setOpenEndAgePopup] = useState(false);

  // 과목 목록 상태 추가
  const [subjects, setSubjects] = useState([]);

  // 컴포넌트 마운트 시 카테고리 목록 조회
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await memberAPI.getCategories();
        setSubjects(categories);
      } catch (error) {
        console.error("카테고리 목록 조회 실패:", error);
      }
    };
    fetchCategories();
  }, []);

  // -------------------
  // 과목 필터 관련
  const toggleSubject = () => setOpenSubject(!openSubject);

  const handleSubjectClick = (subj) => {
    if (selectedSubjects.includes(subj.name)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subj.name));
    } else {
      setSelectedSubjects([...selectedSubjects, subj.name]);
    }
  };

  const applySubject = () => {
    onFilterChange({ categories: selectedSubjects });
    // setOpenSubject(false);  // 주석 처리하여 필터가 닫히지 않도록 함
  };

  // -------------------
  // 성별 필터 관련
  const toggleGender = () => setOpenGender(!openGender);

  // "남자 / 여자" 중 하나만 선택 가능,
  // 이미 선택된 성별 다시 누르면 → "all"
  const handleGenderToggle = (gender) => {
    if (selectedGender === gender) {
      setSelectedGender("all");
    } else {
      setSelectedGender(gender);
    }
  };

  const applyGender = () => {
    onFilterChange({ gender: selectedGender });
    // setOpenGender(false);  // 주석 처리
  };

  // -------------------
  // 나이 필터 관련
  const toggleAge = () => setOpenAge(!openAge);

  const onSelectStartAge = (age) => {
    setStartAge(age);
    setOpenStartAgePopup(false);
  };

  const onSelectEndAge = (age) => {
    setEndAge(age);
    setOpenEndAgePopup(false);
  };

  const applyAge = () => {
    onFilterChange({
      ageRange: {
        start: startAge,
        end: endAge,
      },
    });
    // setOpenAge(false);  // 주석 처리
  };

  return (
    <div className="w-[260px] h-[780px] bg-white border-2 border-gray-400 rounded-md p-4">
      <h2 className="font-semibold text-lg mb-3">필터로 검색</h2>

      {/* ============== 과목 필터 ============== */}
      <div className="mb-4 border-2 border-gray-300 rounded-md bg-white overflow-hidden">
        <div
          className="flex justify-between items-center px-3 py-2 cursor-pointer"
          onClick={toggleSubject}
        >
          <span className="font-medium">과목</span>
          <span>{openSubject ? "▲" : "▼"}</span>
        </div>

        {openSubject && (
          <div className="px-3 py-2 border-t border-gray-200">
            <div className="max-h-[140px] overflow-y-auto mb-3 custom-scrollbar">
              <div className="flex flex-wrap gap-2 justify-center">
                {subjects.map((subj) => {
                  const selected = selectedSubjects.includes(subj.name);
                  return (
                    <button
                      key={subj.id}
                      onClick={() => handleSubjectClick(subj)}
                      className={`
                        mx-0.5
                        px-3 py-1
                        rounded-full
                        border
                        text-sm
                        ${
                          selected
                            ? "bg-green-200 border-green-400"
                            : "bg-gray-100 border-gray-300"
                        }
                      `}
                    >
                      {subj.name}
                    </button>
                  );
                })}
              </div>
            </div>
            <button
              className="w-full py-2 bg-lime-300 text-white font-semibold rounded-md"
              onClick={applySubject}
            >
              적용하기
            </button>
          </div>
        )}
      </div>

      {/* ============== 성별 필터 ============== */}
      <div className="mb-4 border-2 border-gray-300 rounded-md bg-white overflow-hidden">
        <div
          className="flex justify-between items-center px-3 py-2 cursor-pointer"
          onClick={toggleGender}
        >
          <span className="font-medium">성별</span>
          <span>{openGender ? "▲" : "▼"}</span>
        </div>

        {openGender && (
          <div className="px-3 py-2 border-t border-gray-200">
            <div className="flex flex-col items-center">
              <div className="flex gap-4 items-center mb-3">
                {/* 남자 */}
                <span
                  className="cursor-pointer text-sm font-semibold mr-1"
                  onClick={() => handleGenderToggle("male")}
                >
                  {selectedGender === "male" ? (
                    <span className="text-blue-300">●</span>
                  ) : (
                    "○"
                  )}{" "}
                  남자
                </span>

                {/* 여자 */}
                <span
                  className="cursor-pointer text-sm font-semibold ml-1"
                  onClick={() => handleGenderToggle("female")}
                >
                  {selectedGender === "female" ? (
                    <span className="text-blue-300">●</span>
                  ) : (
                    "○"
                  )}{" "}
                  여자
                </span>
              </div>

              <button
                className="w-full py-2 bg-lime-300 text-white font-semibold rounded-md"
                onClick={applyGender}
              >
                적용하기
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ============== 나이 필터 ============== */}
      <div className="border-2 border-gray-300 rounded-md bg-white overflow-visible mb-4">
        <div
          className="flex justify-between items-center px-3 py-2 cursor-pointer"
          onClick={toggleAge}
        >
          <span className="font-medium">나이</span>
          <span>{openAge ? "▲" : "▼"}</span>
        </div>

        {openAge && (
          <div className="px-3 py-2 border-t border-gray-200 relative">
            <div className="flex items-center justify-center gap-4 mb-3">
              {/* 시작 나이 */}
              <div className="relative">
                <button
                  className="px-3 py-1 border rounded-md bg-white"
                  onClick={() => setOpenStartAgePopup((prev) => !prev)}
                >
                  {startAge} 세
                </button>
                {openStartAgePopup && (
                  <div
                    className="
                      absolute top-10 left-0
                      w-20
                      max-h-[130px]
                      overflow-y-auto
                      border bg-white shadow
                      z-30
                    "
                  >
                    {AGE_OPTIONS.map((age) => (
                      <div
                        key={age}
                        className="px-2 py-1 text-sm hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          onSelectStartAge(age);
                        }}
                      >
                        {age} 세
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <span className="font-semibold text-gray-600">~</span>

              {/* 끝 나이 */}
              <div className="relative">
                <button
                  className="px-3 py-1 border rounded-md bg-white"
                  onClick={() => setOpenEndAgePopup((prev) => !prev)}
                >
                  {endAge} 세
                </button>
                {openEndAgePopup && (
                  <div
                    className="
                      absolute top-10 left-0
                      w-20
                      max-h-[130px]
                      overflow-y-auto
                      border bg-white shadow
                      z-30
                    "
                  >
                    {AGE_OPTIONS.map((age) => (
                      <div
                        key={age}
                        className="px-2 py-1 text-sm hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          onSelectEndAge(age);
                        }}
                      >
                        {age} 세
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              className="w-full py-2 bg-lime-300 text-white font-semibold rounded-md"
              onClick={applyAge}
            >
              적용하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Filter;
