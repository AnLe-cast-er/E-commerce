import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home.jsx'
import Collection from './pages/Collection.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Product from './pages/Product.jsx'
import Cart from './pages/Cart.jsx'
import PlaceOrder from './pages/PlaceOrder.jsx';
import Login from './pages/Login.jsx'
import Orders from './pages/Orders.jsx'
import VNPayReturn from './pages/VNPayReturn.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import SearchBar from './components/SearchBar.jsx'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MyProfile from './pages/MyProfile.jsx';

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const CheckPendingOrder = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkPendingOrder = () => {
      const pendingOrder = localStorage.getItem('pendingOrder');
      
      if (pendingOrder) {
        try {
          const order = JSON.parse(pendingOrder);
          const now = new Date().getTime();
          // Check if the order is less than 1 hour old
          if (now - order.timestamp < 3600000) {
            // Remove from localStorage to prevent showing again
            localStorage.removeItem('pendingOrder');
            // Navigate to orders page
            navigate('/orders', { state: { fromPayment: true } });
          } else {
            localStorage.removeItem('pendingOrder');
          }
        } catch (error) {
          console.error('Error checking pending order:', error);
          localStorage.removeItem('pendingOrder');
        }
      }
    };

    checkPendingOrder();
  }, [navigate]);

  return null;
};

const App = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <ToastContainer />
      <CheckPendingOrder />
      <Navbar />
      <SearchBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/place-order' element={<PlaceOrder />} />
        <Route path='/vnpay-return' element={<VNPayReturn />} />
        <Route path='/login' element={<Login />} />
        <Route path='/orders' element={<Orders />} />
        <Route path="/profile" element={<MyProfile />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App

