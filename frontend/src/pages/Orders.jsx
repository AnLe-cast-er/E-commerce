import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const Orders = () => {
  const { backendUrl, currency, products } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productImages, setProductImages] = useState({});
  const navigate = useNavigate();

  // Check if coming back from payment
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('vnp_ResponseCode') === '00') {
      toast.success('Payment successful!');
      // Clean up URL
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
          toast.error('Please log in to view your orders');
          navigate('/login');
          return;
        }

        // Fetch orders
        console.log('Fetching user orders...');
        
        // FIX CÚ PHÁP AXIOS: Đảm bảo headers là tham số thứ hai (config) của GET
        const ordersResponse = await axios.get(`${backendUrl}/api/order/userorders`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Orders API Response:', ordersResponse.data);

        if (ordersResponse.data.success) {
          const ordersData = Array.isArray(ordersResponse.data.orders) ? ordersResponse.data.orders : [];

          // Build productImages map from products available in ShopContext
          try {
            const imagesMap = {};
            if (Array.isArray(products)) {
              products.forEach(p => {
                // product.image is saved as an array of paths in backend
                imagesMap[p._id] = p.image || [];
              });
            }
            setProductImages(imagesMap);
          } catch (err) {
            console.error('Error building productImages from context products:', err);
          }

          setOrders(ordersData);
        } else {
          toast.error(ordersResponse.data.message || 'Lỗi khi tải đơn hàng');
        }
      } catch (error) {
        // Lỗi 401 Unauthorized sẽ rơi vào đây
        console.error('Lỗi khi tải đơn hàng:', error);
        if (error.response && error.response.status === 401) {
            toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
            navigate('/login');
        } else {
            toast.error('Có lỗi xảy ra khi tải đơn hàng');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersAndImages();
  }, [backendUrl, navigate]);

  // Handle retry payment for VNPay
  const handlePayment = async (orderId, amount) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to continue payment');
        navigate('/login');
        return;
      }

      // Try new endpoint name first, then fallback to existing
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

          // support both response shapes
          if (res.data) {
            paymentUrl = res.data.paymentUrl || res.data.url || res.data.data?.url || null;
            if (paymentUrl) break;
          }
        } catch (err) {
          // try next endpoint
          console.warn('Payment endpoint failed:', url, err?.response?.status);
        }
      }

      if (!paymentUrl) {
        toast.error('Không thể khởi tạo đường dẫn thanh toán VNPAY');
        return;
      }

      // Save pending order info to localStorage to check after redirect
      localStorage.setItem('pendingOrder', JSON.stringify({ orderId, amount, timestamp: Date.now() }));

      // Redirect user to VNPAY
      window.location.href = paymentUrl;
    } catch (error) {
      console.error('Lỗi khi thanh toán VNPAY:', error);
      toast.error('Có lỗi xảy ra khi khởi tạo thanh toán');
    }
  };

  // Keep productImages in sync when products list updates in context
  useEffect(() => {
    try {
      const imagesMap = {};
      if (Array.isArray(products)) {
        products.forEach(p => {
          imagesMap[p._id] = p.image || [];
        });
      }
      setProductImages(imagesMap);
    } catch (err) {
      console.error('Error syncing productImages from products:', err);
    }
  }, [products]);

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
      // Fallback for old status values
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-indigo-100 text-indigo-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    
    // Convert status to title case for display
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

  console.log('Current orders state:', orders);

  return (
    <div className='container mx-auto px-4 py-16'>
      <div className='text-2xl mb-8'>
        <Title text1="ĐƠN HÀNG" text2="CỦA TÔI" />
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
          {orders.map((order) => (
            <div key={order._id} className="border rounded-lg overflow-hidden shadow-sm">
              <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                <div>
                  <span className="font-medium">Mã đơn hàng: </span>
                  <span className="text-gray-700">{order._id}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div>
                    <span className="font-medium">Ngày đặt: </span>
                    <span className="text-gray-700">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
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
                                  ? productImages[item.productId][0] 
                                  : item.product?.image?.[0]
                                    ? item.product.image[0]
                                    : assets.logo
                              }
                              alt={item.product?.name || 'Product'}
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
                        <span>{formatPrice(order.amount - (order.deliveryFee || 0))} {currency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping Fee:</span>
                        <span>{(order.deliveryFee && order.deliveryFee > 0) ? `${formatPrice(order.deliveryFee)} ${currency}` : 'Free'}</span>
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
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;