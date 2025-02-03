import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import MainPage from "./pages/MainPage";
import Login from "./pages/Login";
import TeacherDetail from "./pages/TeacherDetail";
import CardListPage from "./pages/CardListPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/mainpage" element={<MainPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/cardlistpage" element={<CardListPage />} />
        <Route path="/teacherdetail" element={<TeacherDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
