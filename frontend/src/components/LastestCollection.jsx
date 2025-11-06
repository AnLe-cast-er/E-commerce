 import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const LastestCollection = () => {
    const { products } = useContext(ShopContext);
    const [lastestProducts, setLastestProducts] = useState([]);

    useEffect(() => {
        if (products && products.length > 0) {
            const sortedProducts = [...products]
                .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
                .slice(0, 8);
            
            setLastestProducts(sortedProducts);
        }
    }, [products]);

    return (
        <div className='my-10 px-4'>
            <div className='text-center py-8'>
                <Title text1={'LATEST'} text2={'COLLECTIONS'}/>
                <p className='w-full md:w-3/4 mx-auto text-xs sm:text-sm md:text-base text-gray-600 mt-4'>
                    Explore our latest collections featuring trendy designs and high-quality materials. Stay ahead in fashion with our new arrivals that combine style and comfort.
                </p>
            </div>
            
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center'>
            {lastestProducts.map((product) => {
                
            const productId = product?._id || product?.id;

            return (
                <ProductItem 
                key={productId}
                productId={productId}
                image={Array.isArray(product.image) ? product.image[0] : product.image}
                name={product.name}
                price={product.price}
                />
            );
            })}

</div>

        </div>
    )
}

export default LastestCollection;