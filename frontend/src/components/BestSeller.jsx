import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSellerProducts, setBestSellerProducts] = useState([]);

useEffect(() => {
  if (Array.isArray(products) && products.length > 0) {
    const bestProduct = products.filter((item) => item?.bestseller === true);
    setBestSellerProducts(bestProduct.slice(0, 5));
  }
}, [products]);



  return (
    <div className="my-10">
      <div className="text-center text-3xl py-8">
        <Title text1={'BEST'} text2={'SELLERS'} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Discover our best-selling products that customers love. These top-rated items combine quality, style, and value, making them must-haves for your collection.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
        {bestSellerProducts.length === 0 ? (
          <p className="text-gray-500 col-span-full">No best sellers found.</p>
        ) : (
          bestSellerProducts.map((item, index) => (
            <ProductItem
              key={item._id || index}
              productId={item._id}
              name={item.name || 'Unnamed product'}
              image={item.image || []}
              price={item.price || 0}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default BestSeller;
