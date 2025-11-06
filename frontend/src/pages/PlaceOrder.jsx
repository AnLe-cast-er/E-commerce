import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    phone: '',
    
  }); 
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData(data => ({...formData,[name]: value,}));
  };
  
  const navigate = useNavigate();
  const { backendUrl, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);
  
  // Handle VNPAY payment
  const handleVnpayPayment = async (orderId, amount) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Vui lòng đăng nhập để thanh toán');
        navigate('/login');
        return;
      }

      // Clear cart before redirecting to payment
      setCartItems({});
      
      // Store order info in localStorage to handle after payment
      localStorage.setItem('pendingOrder', JSON.stringify({
        orderId,
        amount,
        timestamp: new Date().getTime()
      }));

      const response = await axios.post(
        `${backendUrl}/api/payment/create_payment_url`,
        {
          orderId,
          amount,
          bankCode: '',
          language: 'vn',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );


      if (response.data.url) {
        // Redirect to VNPAY
        window.location.href = response.data.url;
      } else {
        toast.error('Không thể khởi tạo thanh toán VNPAY');
      }
    } catch (error) {
      console.error('Lỗi khi thanh toán VNPAY:', error);
      toast.error('Có lỗi xảy ra khi xử lý thanh toán');
    }
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    try {
      // Validate form data
      if (!formData.firstName || !formData.phone || !formData.address) {
        toast.error("Vui lòng điền đầy đủ thông tin giao hàng");
        return;
      }

      console.log('🛒 Cart items in PlaceOrder:', cartItems);
      
      // Prepare order items
      const orderItems = [];
      
      // Process cart items
      for (const [itemId, itemData] of Object.entries(cartItems)) {
        if (!itemData || !itemData.sizes) continue;
        
        const product = products.find(p => p._id === itemId) || itemData.product;
        if (!product) {
          console.warn(`Product not found for item ID: ${itemId}`);
          continue;
        }

        for (const [size, quantity] of Object.entries(itemData.sizes)) {
          const qty = parseInt(quantity);
          if (qty > 0) {
            orderItems.push({
              productId: product._id,
              name: product.name,
              price: product.price,
              size: size,
              quantity: qty,
              image: Array.isArray(product.image) ? product.image[0] : product.image
            });
          }
        }
      }

      if (orderItems.length === 0) {
        toast.error("Giỏ hàng trống");
        return;
      }

      const orderData = {
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
        method: method.toUpperCase(), // Ensure method is uppercase to match enum
        address: {
          fullName: `${formData.firstName} ${formData.lastName || ''}`.trim(),
          email: formData.email,
          phone: formData.phone,
          address: formData.address
        }
      };

      // Get token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Vui lòng đăng nhập để đặt hàng");
        navigate("/login");
        return;
      }

      // Send order to backend
      const response = await axios.post(
        `${backendUrl}/api/order/place`,
        orderData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        if (method === 'vnpay') {
          // Handle VNPAY payment
          handleVnpayPayment(response.data.order._id, response.data.order.amount);
        } else {
          // For COD, show success message and redirect to orders page
          toast.success('Đặt hàng thành công!');
          setCartItems({});
          navigate('/orders');
        }
      } else {
        toast.error(response.data.message || 'Có lỗi xảy ra khi đặt hàng');
      }
    } catch (error) {
      console.error('Lỗi khi đặt hàng:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng');
    }
  };

  return (
    <div className='w-full mt-20 px-4 md:px-10 py-10'>
      <div className='text-2xl mb-6'>
        <Title text1='ORDER' text2='CONFIRMATION' />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Left Side - Delivery Information */}
        <div className='space-y-6'>
          <h3 className='text-xl font-semibold'>Shipping Information</h3>

          <form onSubmit={handlePlaceOrder} className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>First Name *</label>
                <input
                  type='text'
                  name='firstName'
                  value={formData.firstName}
                  onChange={onChangeHandler}
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Last Name</label>
                <input
                  type='text'
                  name='lastName'
                  value={formData.lastName}
                  onChange={onChangeHandler}
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent'
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={onChangeHandler}
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Phone Number *</label>
              <input
                type='tel'
                name='phone'
                value={formData.phone}
                onChange={onChangeHandler}
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Shipping Address *</label>
              <textarea
                name='address'
                value={formData.address}
                onChange={onChangeHandler}
                rows='3'
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent'
                required
              ></textarea>
            </div>

            <div className='pt-4'>
              <h3 className='text-lg font-semibold mb-3'>Payment Method</h3>
              <div className='space-y-3'>
                <div className='flex items-center p-3 border rounded-md hover:bg-gray-50'>
                  <input
                    type='radio'
                    id='cod'
                    name='paymentMethod'
                    value='cod'
                    checked={method === 'cod'}
                    onChange={() => setMethod('cod')}
                    className='h-5 w-5 text-black focus:ring-black border-gray-300'
                  />
                  <div className='ml-3 flex-1'>
                    <label htmlFor='cod' className='block text-sm font-medium text-gray-700'>
                      Cash on Delivery (COD)
                    </label>
                    <p className='text-xs text-gray-500 mt-1'>Pay when you receive the goods</p>
                  </div>
                  
                </div>

                <div className='flex items-center p-3 border rounded-md hover:bg-gray-50'>
                  <input
                    type='radio'
                    id='vnpay'
                    name='paymentMethod'
                    value='vnpay'
                    checked={method === 'vnpay'}
                    onChange={() => setMethod('vnpay')}
                    className='h-5 w-5 text-black focus:ring-black border-gray-300'
                  />
                  <div className='ml-3 flex-1'>
                    <label htmlFor='vnpay' className='block text-sm font-medium text-gray-700'>
                      Pay with VNPAY
                    </label>
                    <p className='text-xs text-gray-500 mt-1'>Pay securely through VNPAY gateway</p>
                  </div>
                  <img src={assets.vnpay_icon} alt='VNPAY' className='h-8 ml-2' />
                </div>
              </div>

              {method === 'vnpay' && (
                <div className='mt-3 p-3 bg-blue-50 text-blue-700 text-sm rounded-md'>
                  <p>Bạn sẽ được chuyển đến trang thanh toán VNPAY sau khi xác nhận đơn hàng.</p>
                </div>
              )}

              {method === 'cod' && (
                <div className='mt-3 p-3 bg-gray-50 text-gray-700 text-sm rounded-md'>
                  <p>Nhân viên giao hàng sẽ thu tiền mặt khi giao hàng.</p>
                </div>
              )}
            </div>

            <button
              type='submit'
              className='w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors font-medium mt-6 flex items-center justify-center'
            >
              {method === 'vnpay' ? (
                <>
                  <span>Thanh toán với VNPAY</span>
                  <img src={assets.vnpay_icon} alt='VNPAY' className='h-6 ml-2' />
                </>
              ) : (
                'Đặt hàng ngay'
              )}
            </button>
          </form>
        </div>

        {/* Right Side - Order Summary */}
        <div>
          <h3 className='text-xl font-semibold mb-6'>Tóm tắt đơn hàng</h3>
          <CartTotal />
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
