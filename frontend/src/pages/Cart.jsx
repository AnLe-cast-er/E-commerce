import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import { buildSrc } from "../utils/image";

const Cart = () => {
  const { currency, cartItems, updateQuantity, navigate, backendUrl } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {

    
    // Transform cartItems into a flat array for rendering
    const tempData = [];
    
    for (const itemId in cartItems) {
      const item = cartItems[itemId];

      
      if (!item) {
        console.warn(`⚠️ [Cart] Item ${itemId} is null or undefined`);
        continue;
      }
      
      if (!item.product) {
        console.warn(`⚠️ [Cart] Item ${itemId} is missing product data`);
        continue;
      }
      
      if (!item.sizes || Object.keys(item.sizes).length === 0) {
        console.warn(`⚠️ [Cart] Item ${itemId} has no sizes`);
        continue;
      }
      
      for (const size in item.sizes) {
        const quantity = item.sizes[size];
        if (quantity > 0) {
          tempData.push({
            _id: itemId,
            product: item.product,
            size,
            quantity,
          });
        }
      }
    }
    

    setCartData(tempData);
  }, [cartItems]);

  if (Object.keys(cartItems).length === 0) {
    return (
      <div className="border-t pt-14 px-6 min-h-[50vh] flex items-center justify-center">
        <p className="text-gray-500 text-center">Your shopping cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="border-t pt-14 px-6">
      <h2 className="text-2xl font-semibold mb-8 text-gray-800 uppercase tracking-wide">
        Your <span className="font-bold text-black">Cart</span>
      </h2>

      {cartData.length === 0 ? (
        <p className="text-gray-500 text-center">Your shopping cart is empty.</p>
      ) : (
        <div className="flex flex-col gap-8">
          {cartData.map((item, index) => (
            <div
              key={`${item._id}-${item.size}-${index}`}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-6 gap-4"
            >
              <div className="flex items-start gap-4 w-full sm:w-2/3">

                
                <img
                        src={
                          item.product?.image
                            ? buildSrc(
                                Array.isArray(item.product.image) 
                                  ? item.product.image[0] 
                                  : item.product.image,
                                backendUrl
                              )
                            : assets.logo
                        }
                        alt={item.product?.name || 'Product'}
                        className="w-[80px] h-[120px] object-cover rounded-md shadow"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = assets.logo;
                        }}
                      />
                  


                <div className="flex flex-col gap-1">
                  <p className="text-lg font-medium">{item.product?.name || 'Product'}</p>
                  <p className="text-gray-700">
                    {currency} {item.product?.price || '0.00'}
                  </p>
                  <p className="text-sm border rounded px-2 py-1 bg-gray-50 inline-block w-fit">
                    Size: {item.size}
                  </p>
                </div>
              </div>

              {/* Quantity Controls - Only rendered once per item */}
              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => updateQuantity(item._id, item.size, Math.max(1, item.quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="w-16 text-center py-1">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => updateQuantity(item._id, item.size, 0)}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  <img
                    src={assets.bin_icon}
                    alt="delete"
                    className="w-5 h-5"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {cartData.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center my-12 gap-6">
          <button
            onClick={() => navigate('/')}
            className="border border-black text-black px-6 py-2 rounded hover:bg-gray-100 transition-colors w-full sm:w-auto text-center"
          >
            CONTINUE SHOPPING
          </button>
          
          <div className="w-full sm:w-auto flex flex-col items-end gap-4">
            <div className="w-full sm:w-[350px]">
              <CartTotal />
            </div>
            <button
              onClick={() => navigate("/place-order")}
              className="bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition-colors w-full sm:w-auto"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
