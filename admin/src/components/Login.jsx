import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { login } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const Login = ({setToken}) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // ✨ KHỞI TẠO useNavigate
    const navigate = useNavigate();
 
    const onSubmitHandler = async (e) => {
  e.preventDefault();
  try {
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    const response = await login(email, password);
    console.log("🟢 Login API response:", response); 

    if (response.success) {
      localStorage.setItem('token', response.token); 
      setToken(response.token);
      toast.success('Login successful!');
      navigate('/list');
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
              <h1 className='text-2xl font-semibold text-gray-800 mb-1'>Welcome back</h1>
              <p className='text-gray-500 text-sm'>Login to your account</p>
            </div>
            
            <form onSubmit={onSubmitHandler} className='space-y-5'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1.5'>Email</label>
                <div className='relative'>
                  <input
                    type='email'
                    onChange={(e) => setEmail(e.target.value)}
                    className='w-full px-4 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-700'
                    placeholder='Enter your email'
                    required
                  />
                </div>
              </div>

              <div>
                <div className='flex justify-between items-center mb-1.5'>
                  <label className='block text-sm font-medium text-gray-700'>Password</label>
                  <a href='#' className='text-xs text-blue-600 hover:underline'>Forgot password?</a>
                </div>
                <div className='relative'>
                  <input
                    type='password'
                    onChange={(e) => setPassword(e.target.value)}
                    className='w-full px-4 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-700'
                    placeholder='Enter your password'
                    required
                  />
                </div>
              </div>

              <div className='pt-2'>
                <button
                  type='submit'
                  className='w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors shadow-sm'
                >
                  Sign in
                </button>
              </div>
            </form>
            
            <div className='mt-6 pt-6 border-t border-gray-100 text-center'>
              <p className='text-sm text-gray-600'>
                Don't have an account?{' '}
                <a href='#' className='text-blue-600 font-medium hover:underline'>
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
}

export default Login
