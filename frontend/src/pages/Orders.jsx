import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';


const buildSrc = (path, baseUrl) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const normalizedBaseUrl = baseUrl ? baseUrl.replace(/\/$/, '') : '';
  const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
  
  return `${normalizedBaseUrl}/${normalizedPath}`;
};

const Orders = () => {
  const { backendUrl, currency, products } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productImages, setProductImages] = useState({});
  const navigate = useNavigate();

  const DELIVERY_FEE = 10; 

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('vnp_ResponseCode') === '00') {
      toast.success('Payment successful!');
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (params.get('vnp_ResponseCode')) {
      toast.error('Payment failed. Please try again.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const fetchOrdersAndImages = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please login to view order');
          navigate('/login');
          return;
        }

        const ordersResponse = await axios.get(`${backendUrl}/api/order/userorders`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (ordersResponse.data.success) {
          const ordersData = Array.isArray(ordersResponse.data.orders) ? ordersResponse.data.orders : [];

          try {
            const imagesMap = {};
            if (Array.isArray(products)) {
              products.forEach(p => {
                imagesMap[p._id] = p.image || [];
              });
            }
            setProductImages(imagesMap);
          } catch (err) {
            console.error('Error building productImages:', err);
          }

          setOrders(ordersData);
        } else {
          toast.error(ordersResponse.data.message || 'Error loading order');
        }
      } catch (error) {
        console.error('Error loading order:', error);
        if (error.response && error.response.status === 401) {
            toast.error('Your session has expired. Please log in again.');
            navigate('/login');
        } else {
            toast.error('An error occurred while loading the order.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersAndImages();
  }, [backendUrl, navigate, products]);

  const handlePayment = async (orderId, amount) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to continue payment');
        navigate('/login');
        return;
      }

      const endpoints = [
        `${backendUrl}/api/payment/create-vnpay-url`,
        `${backendUrl}/api/payment/create_payment_url`
      ];

      let paymentUrl = null;

      for (const url of endpoints) {
        try {
          const res = await axios.post(url, { orderId, amount }, {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
          });

          if (res.data) {
            paymentUrl = res.data.paymentUrl || res.data.url || res.data.data?.url || null;
            if (paymentUrl) break;
          }
        } catch (err) {
          console.warn('Payment endpoint failed:', url, err?.response?.status);
        }
      }

      if (!paymentUrl) {
        toast.error('Unable to initialize VNPAY payment link');
        return;
      }

      localStorage.setItem('pendingOrder', JSON.stringify({ orderId, amount, timestamp: Date.now() }));
      window.location.href = paymentUrl;
    } catch (error) {
      console.error('Error when paying VNPAY:', error);
      toast.error('An error occurred while initiating payment.');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price || 0);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'Order Placed': 'bg-yellow-100 text-yellow-800',
      'Processing': 'bg-blue-100 text-blue-800',
      'Shipped': 'bg-indigo-100 text-indigo-800',
      'Delivered': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-indigo-100 text-indigo-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    
    const displayStatus = status 
      ? status.split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ')
      : 'Unknown';
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusMap[status] || 'bg-gray-100 text-gray-800'}`}>
        {displayStatus}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-16'>
      <div className='text-2xl mb-8'>
        <Title text1="MY" text2="ORDERS" />
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">You don't have any orders yet.</p>
          <button 
            onClick={() => navigate('/')} 
            className="mt-4 px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => { 
            // Tính toán Subtotal và Shipping Fee
            const deliveryFee = order.deliveryFee || DELIVERY_FEE;
            const subtotal = order.amount - deliveryFee;

            return (
            <div key={order.id} className="border rounded-lg overflow-hidden shadow-sm">
              <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                <div>
                  <span className="font-medium">Order code: </span>
                  <span className="text-gray-700">{order.id}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div>
                    <span className="font-medium">Booking date: </span>
                    <span className="text-gray-700">
                      {new Date(order.date || order.createdAt).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                      })}
                    </span>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <h3 className="font-medium text-lg mb-4">Order Information</h3>
                    <div className="space-y-4">
                      {Array.isArray(order.items) && order.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4 py-2 border-b">
                          <div className="w-20 h-20 flex-shrink-0">
                            <img
                              src={
                                productImages[item.productId]?.[0]
                                  ? buildSrc(productImages[item.productId][0], backendUrl) 
                                  : item.image 
                                    ? buildSrc(item.image, backendUrl) 
                                    : assets.logo
                              }
                              alt={item.name || 'Product'}
                              className="w-20 h-20 object-cover rounded"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = assets.logo;
                              }}
                            />

                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name || 'Unknown Product'}</h4>
                            {item.size && <p className="text-sm text-gray-600">Size: {item.size}</p>}
                            <p className="text-sm text-gray-600">Quantity: {item.quantity || 1}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatPrice(item.price)} {currency}</p>
                            <p className="text-sm text-gray-500">
                              {formatPrice((item.price || 0) * (item.quantity || 1))} {currency}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-l pl-6">
                    <h3 className="font-medium text-lg mb-4">Order Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{formatPrice(subtotal)} {currency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping Fee:</span>
                        <span>{formatPrice(deliveryFee)} {currency}</span>
                      </div>
                      
                      <div className="border-t pt-2 mt-2 font-medium flex justify-between">
                        <span>Total:</span>
                        <span className="text-red-500">{formatPrice(order.amount)} {currency}</span>
                      </div>
                      
                      <div className="pt-2 mt-2 border-t">
                        <p className="font-medium">Payment Method:</p>
                        <p className="capitalize">{order.paymentMethod.toLowerCase()}</p>
                      </div>
                      {order.paymentMethod === 'VNPAY' && !order.payment && (
                        <button 
                          onClick={() => handlePayment(order._id, order.amount)}
                          className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
                        >
                          Pay with VNPAY
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-medium text-lg mb-2">Shipping Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><span className="font-medium">Recipient:</span> {order.address?.fullName || 'No information'}</p>
                      <p><span className="font-medium">Phone:</span> {order.address?.phone || 'No information'}</p>
                    </div>
                    <div>
                      <p><span className="font-medium">Address:</span> {order.address?.address || 'No information'}</p>
                      <p><span className="font-medium">Email:</span> {order.address?.email || 'No information'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )})} 
        </div>
      )}
    </div>
  );
};

export default Orders;