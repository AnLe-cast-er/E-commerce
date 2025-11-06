import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Title from '../components/Title';

const VNPayReturn = () => {
  const [status, setStatus] = useState('processing');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const responseCode = params.get('vnp_ResponseCode');
    const amount = params.get('vnp_Amount');
    const orderId = params.get('vnp_TxnRef');

    if (responseCode === '00') {
      setStatus('success');
      toast.success('Thanh toán thành công!');
      // Clear pending order from localStorage
      localStorage.removeItem('pendingOrder');
      // Redirect to orders page after 3 seconds
      setTimeout(() => {
        navigate('/orders');
      }, 3000);
    } else {
      setStatus('failed');
      toast.error('Thanh toán thất bại hoặc bị hủy');
      setTimeout(() => {
        navigate('/orders');
      }, 3000);
    }
  }, [navigate, location]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
        <Title text1="THANH TOÁN" text2="VNPAY" />
        
        <div className="mt-8">
          {status === 'processing' && (
            <div className="animate-pulse">
              <div className="w-16 h-16 mx-auto border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Đang xử lý thanh toán...</p>
            </div>
          )}
          
          {status === 'success' && (
            <div>
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-medium text-green-500">Thanh toán thành công!</h3>
              <p className="mt-2 text-gray-600">Bạn sẽ được chuyển đến trang đơn hàng...</p>
            </div>
          )}
          
          {status === 'failed' && (
            <div>
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-medium text-red-500">Thanh toán thất bại!</h3>
              <p className="mt-2 text-gray-600">Vui lòng thử lại hoặc chọn phương thức thanh toán khác.</p>
            </div>
          )}
          
          <button
            onClick={() => navigate('/orders')}
            className="mt-8 px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
          >
            Xem đơn hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default VNPayReturn;