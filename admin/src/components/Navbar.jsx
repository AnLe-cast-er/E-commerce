import React from 'react';
import { assets } from '../assets/assets';
import { FiLogOut, FiMenu, FiX } from 'react-icons/fi';

const Navbar = ({ setToken, toggleSidebar, isSidebarOpen }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  return (
    <header className='sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm'>
      <div className='max-w-full px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex items-center'>
            <button 
              onClick={toggleSidebar}
              className='md:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 mr-2'
            >
              {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
            <div className='hidden md:flex items-center'>
              <img 
                src={assets.logo} 
                alt="Logo" 
                className='h-8 w-auto' 
              />
              <h1 className='ml-3 text-lg font-semibold text-gray-900'>E-Commerce Admin</h1>
            </div>
          </div>
          
          <div className='flex items-center space-x-4'>
            <div className='flex items-center space-x-1'>
              <span className='hidden md:inline text-sm font-medium text-gray-700'>
                Admin
              </span>
              <div className='h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium'>
                A
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className='btn btn-secondary flex items-center space-x-2'
            >
              <FiLogOut className='w-4 h-4' />
              <span className='hidden md:inline'>Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default React.memo(Navbar);
