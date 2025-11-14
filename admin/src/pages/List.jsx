import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const backendUrl = import.meta.env.VITE_BACKEND_URL;

const List = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const currency = '$';

  const buildSrc = (path) => {
    if (!path) return '';
    try {
      if (/^https?:\/\//i.test(path)) return path;
      const normalized = path.replace(/\\\\/g, '/').replace(/^\//, '');
      return `${backendUrl}/${normalized}`;
    } catch (err) {
      console.error('Error building image URL:', err);
      return '';
    }
  };


  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      window.location.href = '/login';
      return {};
    }
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchList = async () => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();
      const response = await axios.get(`${backendUrl}/api/product/list`, { headers });
      
      if (response.data.success) {
        setList(response.data.products || []);
      } else {
        toast.error(response.data.message || 'Failed to load products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      const errorMessage = error.response?.data?.message || 'Error loading products';
      toast.error(errorMessage);
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  // Delete product
 const handleDelete = async (id) => {
  
  if (window.confirm('Are you sure you want to delete this product?')) {
    try {
      const headers = {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
        "Accept": "application/json"
      };
      
      // console.log("Deleting ID:", id);
      // console.log("Headers:", headers);
      
      const response = await axios.post(
        `${backendUrl}/api/product/remove`, 
        { productId: id }, 
        { headers }
      );

      // console.log("Delete response:", response.data);


      if (response.data.success || response.data.message) {
        toast.success(response.data.message || 'Product deleted successfully');
        await fetchList();
      } else {
        toast.error(response.data.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('❌ Error deleting product:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.status === 401) {
        toast.error('Unauthorized. Please login again');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else if (error.response?.status === 422) {
        // Laravel validation error
        const errors = error.response.data.errors;
        const errorMsg = errors ? Object.values(errors).flat().join(', ') : 'Invalid data';
        toast.error(errorMsg);
      } else {
        toast.error(error.response?.data?.message || 'Error deleting product');
      }
    }
  }
};

  // Load products on component mount
  useEffect(() => {
    fetchList();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Product List</h1>
      </div>
      
      <div className='bg-white rounded-lg shadow overflow-hidden'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Product</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Price</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Category</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Actions</th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {list.map((product) => (
              
              <tr key={product.id}>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex items-center'>
                    <div className='flex-shrink-0 h-10 w-10'>
                      {product.image && product.image[0] ? (
                        <img 
                          className='h-10 w-10 rounded-full object-cover' 
                          src={buildSrc(product.image[0])} 
                          alt={product.name}
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"%3E%3Cpath fill="%23ccc" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/%3E%3C/svg%3E';
                          }}
                        />
                      ) : (
                        <div className='h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center'>
                          <span className='text-gray-400'>
                            <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                            </svg>
                          </span>
                        </div>
                      )}
                    </div>
                    <div className='ml-4'>
                      <div className='text-sm font-medium text-gray-900'>{product.name}</div>
                      <div className='text-sm text-gray-500'>{product.category}</div>
                    </div>
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{product.price}$</td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{product.subCategory}</td>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className='text-red-600 hover:text-red-900'
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default List;