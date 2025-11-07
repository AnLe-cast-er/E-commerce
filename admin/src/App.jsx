import React, { useState, useEffect } from "react"; 
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx"; 
import Login from "./components/Login.jsx"; 
import List from "./pages/List.jsx";
import Add from "./pages/Add.jsx";
import Edit from "./pages/Edit.jsx";
import Orders from "./pages/Orders.jsx";


function App() {

  const [token, setToken] = useState(localStorage.getItem("token") || ""); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);


  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);
  
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);


  if (!token) {

    return (
      <div className="app">
        <Routes>
          <Route path="/login" element={<Login setToken={setToken} />} />
          
          <Route path="*" element={<Navigate to="/login" replace />} /> 
        </Routes>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <div 
        className={`fixed inset-y-0 left-0 z-30 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out md:relative md:translate-x-0 w-64 flex-shrink-0`}
      >
        <Sidebar />
      </div>
      
      <div className="flex flex-col flex-1 w-full overflow-y-auto">
        <Navbar setToken={setToken} toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        <main className="flex-1 p-4">
          <Routes>

              <Route path="/" element={<Navigate to="/list" replace />} /> 

              <Route path="/list" element={<List />} /> 
              <Route path="/add" element={<Add />} />
              <Route path="/edit/:id" element={<Edit />} />
              <Route path="/orders" element={<Orders />} />
              

              <Route path="/login" element={<Navigate to="/list" replace />} /> 
              
              <Route path="*" element={<Navigate to="/list" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
