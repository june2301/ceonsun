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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Payment from "./pages/Payment";
import Promotion from "./pages/Promotion";

// Header를 조건부로 표시하기 위한 래퍼 컴포넌트
function AppContent() {
  const location = useLocation();
  const isAuthPage = ["/", "/signup"].includes(location.pathname);

  return (
    <div className="min-h-screen">
      {!isAuthPage && <Header />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/mainpage" element={<MainPage />} />
        <Route path="/cardlistpage" element={<CardListPage />} />
        <Route path="/teacherdetailpage" element={<TeacherDetailPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/promotion" element={<Promotion />} />
      </Routes>
    </div>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // 윈도우 포커스시 자동 리페치 비활성화
      retry: 1, // 실패시 재시도 횟수
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppContent />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
