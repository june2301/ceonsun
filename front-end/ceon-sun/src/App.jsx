import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import SignUp from "./pages/SignUp";
import MainPage from "./pages/MainPage";
import Login from "./pages/Login";
import TeacherDetailPage from "./pages/TeacherDetailPage";
import CardListPage from "./pages/CardListPage";
import MyPage from "./pages/MyPage";

// Header를 조건부로 표시하기 위한 래퍼 컴포넌트
function AppContent() {
  const location = useLocation();
  const isAuthPage = ["/", "/signup"].includes(location.pathname);

  return (
    <div className="min-h-screen">
      {!isAuthPage && <Header />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/mainpage" element={<MainPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/cardlistpage" element={<CardListPage />} />
        <Route path="/teacherdetailpage" element={<TeacherDetailPage />} />
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
