import React, { useState, useEffect } from "react"; 
import { Routes, Route, Navigate } from "react-router-dom";
// Đảm bảo import các component cho Layout
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx"; 
import Login from "./components/Login.jsx"; 
import List from "./pages/List.jsx";
import Add from "./pages/Add.jsx";
import Edit from "./pages/Edit.jsx";
import Orders from "./pages/Orders.jsx";

// Xóa ProtectedRoute vì logic được xử lý trực tiếp trong App()

function App() {
  // 🔑 SỬ DỤNG STATE: Component App sẽ render lại khi token thay đổi
  const [token, setToken] = useState(localStorage.getItem("token") || ""); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // 🔄 Theo dõi sự thay đổi của state token và cập nhật localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);
  
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);


  if (!token) {
    // === TRẠNG THÁI 1: CHƯA ĐĂNG NHẬP ===
    // CHỈ CHỨA routes liên quan đến Login.
    return (
      <div className="app">
        <Routes>
          {/* Chỉ hiển thị Login */}
          <Route path="/login" element={<Login setToken={setToken} />} />
          
          {/* Redirect mọi route khác (bao gồm cả '/') về /login */}
          <Route path="*" element={<Navigate to="/login" replace />} /> 
        </Routes>
      </div>
    );
  }

  // === TRẠNG THÁI 2: ĐÃ ĐĂNG NHẬP (token tồn tại) ===
  // Hiển thị Dashboard Layout và các Admin Routes
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* 1. Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out md:relative md:translate-x-0 w-64 flex-shrink-0`}
      >
        <Sidebar />
      </div>
      
      <div className="flex flex-col flex-1 w-full overflow-y-auto">
        {/* 2. Navbar */}
        <Navbar setToken={setToken} toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        {/* 3. Main Content Area */}
        <main className="flex-1 p-4">
          <Routes>
              {/* Route gốc chuyển hướng đến /list */}
              <Route path="/" element={<Navigate to="/list" replace />} /> 
              {/* Các route Admin */}
              <Route path="/list" element={<List />} /> 
              <Route path="/add" element={<Add />} />
              <Route path="/edit/:id" element={<Edit />} />
              <Route path="/orders" element={<Orders />} />
              
              {/* Nếu cố truy cập /login khi đã đăng nhập, chuyển hướng về /list */}
              <Route path="/login" element={<Navigate to="/list" replace />} /> 
              
              {/* Route 404 - chuyển hướng về /list */}
              <Route path="*" element={<Navigate to="/list" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
