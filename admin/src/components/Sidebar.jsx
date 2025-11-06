import React from 'react'
import Navbar from './Navbar'
import {NavLink} from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = () => {
  const menuItems = [
    { 
      path: "/add", 
      icon: assets.add_icon, 
      label: "Add Product",
      color: "blue"
    },
    { 
      path: "/list", 
      icon: assets.order_icon, 
      label: "Product List",
      color: "green"
    },
    { 
      path: "/orders", 
      icon: assets.order_icon, 
      label: "Orders",
      color: "purple"
    }
  ];

  const getColorClasses = (color, isActive) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        icon: 'text-blue-500',
        hover: 'hover:bg-blue-50',
      },
      green: {
        bg: 'bg-green-50',
        text: 'text-green-600',
        icon: 'text-green-500',
        hover: 'hover:bg-green-50',
      },
      purple: {
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        icon: 'text-purple-500',
        hover: 'hover:bg-purple-50',
      },
    };

    const colorSet = colors[color] || colors.blue;
    return {
      container: isActive ? `${colorSet.bg} ${colorSet.text} font-medium` : `text-gray-600 ${colorSet.hover}`,
      icon: `p-1.5 rounded-md ${colorSet.bg} ${colorSet.icon}`
    };
  };

  return (
    <div className='w-64 h-full bg-white border-r border-gray-200 flex flex-col'>
      <div className='h-16 p-6 border-b border-gray-100'>
        <h2 className='text-xl font-semibold text-gray-800'>Admin Dashboard</h2>
      </div>
      <nav className='flex-1 p-4 space-y-1'>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${getColorClasses(item.color, isActive).container}`
            }
          >
            <div className={getColorClasses(item.color, false).icon}>
              <img 
                src={item.icon} 
                alt={item.label} 
                className='w-4 h-4' 
              />
            </div>
            <span className='text-sm font-medium'>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className='p-4 border-t border-gray-100'>
        <div className='text-xs text-gray-500'>
          © {new Date().getFullYear()} Admin Panel
        </div>
      </div>
    </div>
  )
}

export default Sidebar