import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const { setShowSearch, getCartCount, navigate, setToken, token, setCartItems } = useContext(ShopContext);
const logout = () => {
  navigate('/login');
  localStorage.removeItem('token');
  setToken('');
  setCartItems({});

}


  return (
    <div className="bg-white shadow sticky top-0 z-50">
      <div className="container-max mx-auto flex items-center justify-between px-4 md:px-8 h-20">
      {/* Logo */}
      <Link to="/" className="flex items-center">
        <img src={assets.logo} alt="Logo" className="w-12 h-12 object-contain hover:opacity-80 transition-opacity cursor-pointer" />
      </Link>

      {/* Navigation */}
      <ul className="hidden md:flex items-center gap-8 text-gray-800 font-medium text-base tracking-wide">
        <NavLink to="/" className="p-2 hover:text-gray-600 transition-colors">HOME</NavLink>
        <NavLink to="/collection" className="p-2 hover:text-gray-600 transition-colors">COLLECTION</NavLink>
        <NavLink to="/about" className="p-2 hover:text-gray-600 transition-colors">ABOUT</NavLink>
        <NavLink to="/contact" className="p-2 hover:text-gray-600 transition-colors">CONTACT</NavLink>
      </ul>

      {/* Icons */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <img
          onClick={() => setShowSearch(true)}
          src={assets.search_icon}
          alt="Search"
          className="p-2 w-8 h-8 cursor-pointer hover:opacity-70 transition-opacity"
        />

        {/* Profile Dropdown */}
        <div className="group relative">
          
            <img onClick={() =>token ? null :  navigate('/login')}
              src={assets.profile_icon}
              alt="Profile"
              className="p-[10px] w-12 h-12 cursor-pointer hover:opacity-70 transition-opacity"
            />
          {/*Dropdown Menu*/}
          {token &&

          <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
            <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500">
              {/* <p onClick={() => navigate('/profile')} className="cursor-pointer hover:text-black">My Profile</p> */}
              <p onClick={() => navigate('/orders')} className="cursor-pointer hover:text-black">Order</p>
              <p onClick={logout} className="cursor-pointer hover:text-black">Logout</p>
            </div>
          </div>}
        </div>

        {/* Cart */}
        <Link to="/cart" className="relative">
          <img
            src={assets.cart_icon}
            className="p-2 w-8 h-8 ursor-pointer hover:opacity-70 transition-opacity"
            alt="Cart"
          />
          <span className="absolute -right-1 -bottom-1 inline-flex items-center justify-center px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-full">
            {getCartCount()}
          </span>
        </Link>
      </div>
      </div>
    </div>
  );
};

export default Navbar;
