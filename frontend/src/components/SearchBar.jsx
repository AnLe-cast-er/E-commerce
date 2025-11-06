import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'

const SearchBar = () => {

    const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
    
  
    return showSearch ? (
    <div className="border-t border-b bg-gray-50 py-4 flex justify-center">
  <div className="flex items-center border border-gray-400 rounded-full px-4 py-2 w-4/5 sm:w-1/2 md:w-2/5 bg-white shadow-sm">
    <img
      src={assets.search_icon}
      alt="search"
      className="w-[20px] h-[20px] mr-2 opacity-60"
    />
    <input
      type="text"
      placeholder="Search"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="flex-1 outline-none bg-transparent text-sm text-gray-700"
    />
    <img
      onClick={() => setShowSearch(false)}
      src={assets.cross_icon}
      alt="close"
      className="w-[20px] h-[20px] ml-2 cursor-pointer opacity-70 hover:opacity-100 transition"
    />
  </div>
</div>

  ) : null
}

export default SearchBar;