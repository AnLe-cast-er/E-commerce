import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

// Hàm gọi API Laravel
const loginAdmin = async (email, password) => {
  try {
    const res = await fetch('http://localhost:8000/api/user/admin', { // backend admin route
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('API login error:', error);
    throw error;
  }
};

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    try {
      const response = await loginAdmin(email, password); 
      console.log("🟢 Login API response:", response);

      if (response.success && response.token) {
        localStorage.setItem('token', response.token);
        setToken(response.token);
        toast.success('Login successful!');
        navigate('/admin/dashboard'); 
      } else {
        toast.error(response.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className='w-full max-w-md mx-auto mt-10'>
      <div className='bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden'>
        <div className='p-8'>
          <div className='text-center mb-8'>
            <h1 className='text-2xl font-semibold text-gray-800 mb-1'>Admin Login</h1>
            <p className='text-gray-500 text-sm'>Enter your admin credentials</p>
          </div>

          <form onSubmit={onSubmitHandler} className='space-y-5'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1.5'>Email</label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full px-4 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-700'
                placeholder='Enter admin email'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1.5'>Password</label>
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-full px-4 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-700'
                placeholder='Enter password'
                required
              />
            </div>

            <button
              type='submit'
              className='w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors shadow-sm'
            >
              Sign In
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Login;
