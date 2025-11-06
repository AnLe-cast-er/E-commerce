import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount, getCartCount, cartItems } = useContext(ShopContext);
  const [subtotal, setSubtotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    // Recalculate when cartItems changes
    const count = getCartCount();
    const amount = getCartAmount();
    
    setItemCount(count);
    setSubtotal(amount);
  }, [cartItems, getCartCount, getCartAmount]);

  const total = subtotal + (subtotal > 0 ? delivery_fee : 0);
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  if (itemCount === 0) {
    return (
      <div className="w-full bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Your cart is empty</h3>
        <p className="text-gray-600">Please add products to your cart</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Order Summary</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between text-gray-700">
          <span>{itemCount} {itemCount === 1 ? 'product' : 'products'}</span>
          <span>{formatPrice(subtotal)} {currency}</span>
        </div>
        
        <div className="flex justify-between text-gray-700">
          <span>Shipping Fee</span>
          <span>{subtotal > 0 ? `${formatPrice(delivery_fee)} ${currency}` : 'Free'}</span>
        </div>
        
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="flex justify-between font-medium text-lg">
            <span>Total</span>
            <span className="text-red-500">{formatPrice(total)} {currency}</span>
          </div>
        </div>
        
        {subtotal > 0 && subtotal < 100 && (
          <div className="pt-2 text-sm text-green-600">
            <p>Free shipping on orders over {currency}$100.000</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartTotal;