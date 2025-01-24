import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/img/logo.png";

const Header = () => {
  return (
    <div className="fixed top-0 w-full bg-gray-100 shadow-md z-50">
      <div className="max-w-[60%] mx-auto flex items-center justify-between h-24 px-4">
        {/* 로고 */}
        <div className="flex items-center">
          <Link to="/mainpage" className="flex items-center">
            <img src={logo} alt="Logo" className="h-12" />
          </Link>
        </div>

        {/* 메뉴 */}
        <div className="flex gap-6">
          <Link to="#" className="text-lg text-gray-700 hover:text-blue-500">
            선생님 목록
          </Link>
          <Link to="#" className="text-lg text-gray-700 hover:text-blue-500">
            학생 목록
          </Link>
          <Link to="#" className="text-lg text-gray-700 hover:text-blue-500">
            내 수업
          </Link>
        </div>

        {/* 사용자 정보 */}
        <div className="flex items-center gap-6">
          {/* 사용자 이름과 로그아웃 */}
          <div className="flex flex-col items-center">
            <Link to="#" className="text-gray-800 font-bold text-lg">
              김싸피 님
            </Link>
            <Link to="/" className="text-gray-600 text-sm hover:text-blue-500">
              로그아웃
            </Link>
          </div>

          {/* 알림 확인 */}
          <Link
            to="#"
            className="flex flex-col items-center text-gray-600 text-sm hover:text-blue-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6 mb-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
              />
            </svg>
            알림 확인
          </Link>

          {/* 문의 채팅 */}
          <Link
            to="#"
            className="flex flex-col items-center text-gray-600 text-sm hover:text-blue-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6 mb-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
              />
            </svg>
            문의 채팅
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
