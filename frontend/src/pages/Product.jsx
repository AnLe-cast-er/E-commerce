import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, backendUrl } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1); 

  const buildSrc = (path) => {
    if (!path) return "";
    const normalized = String(path).replace(/\\/g, "/").replace(/^\//, "");
    if (/^https?:\/\//i.test(normalized)) return normalized;
    const base = (backendUrl || "http://localhost:8000").replace(/\/$/, "");
    return `${base}/${normalized}`;
  };

  useEffect(() => {
    if (products.length > 0) {
      const found = products.find(
        (item) =>
          item.id === productId || item._id === productId || item.id?.toString() === productId
      );
      if (found) {
        setProductData(found);
        const firstImg = found.image?.[0] ? buildSrc(found.image[0]) : "";
        setImage(firstImg);
      }
    }
  }, [products, productId]);

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  if (!productData) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-600">
        Loading product...
      </div>
    );
  }

  return (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <div className="flex flex-row gap-8 max-w-6xl mx-auto w-full justify-center items-start">
        {/* Thumbnail list */}
        <div className="flex flex-col gap-3 w-[100px] h-[600px] overflow-y-auto items-center">
          {productData.image.map((img, index) => (
            <img
              key={index}
              src={buildSrc(img)}
              alt={`${productData.name} ${index + 1}`}
              className={`w-[90px] h-[110px] object-cover rounded-md cursor-pointer border-2 transition-all duration-300 ${
                selectedImageIndex === index
                  ? "border-blue-500 scale-105"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onClick={() => {
                setSelectedImageIndex(index);
                setImage(buildSrc(img));
              }}
            />
          ))}
        </div>

        {/* Main image */}
        <div className="flex justify-center items-center flex-1">
          <img
            src={image}
            alt={productData.name}
            className="w-[400px] h-[600px] object-cover rounded-lg shadow-md"
          />
        </div>

        {/* Product details */}
        <div className="flex flex-col max-w-lg flex-1">
          <h1 className="text-3xl font-semibold mb-4">{productData.name}</h1>

          {/* ✅ Hiển thị Subcategory */}
          {productData.subCategory && (
            <div className="mb-4">
              <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                {productData.subCategory}
              </span>
            </div>
          )}

          {productData.description && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Product Description</h3>
              <p className="text-gray-700 whitespace-pre-line">{productData.description}</p>
            </div>
          )}

          <span className="text-2xl font-bold text-blue-600 mb-4">
            {currency}
            {productData.price}
          </span>

          {/* Sizes */}
          {Array.isArray(productData.sizes) && productData.sizes.length > 0 && (
            <div className="flex flex-col gap-4 my-8">
              <p className="font-medium">Select Size</p>
              <div className="flex gap-2 flex-wrap">
                {[...productData.sizes]
                  .sort((a, b) => {
                    const order = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
                    const ai = order.indexOf(a);
                    const bi = order.indexOf(b);
                    if (ai === -1 && bi === -1) return a.localeCompare(b);
                    if (ai === -1) return 1;
                    if (bi === -1) return -1;
                    return ai - bi;
                  })
                  .map((item, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        setSelectedSize((prev) => (prev === item ? "" : item))
                      }
                      className={`min-w-[50px] py-2 px-4 rounded-md font-medium transition-all duration-200 ${
                        selectedSize === item
                          ? "bg-orange-500 text-white shadow-md scale-105"
                          : "bg-white border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50 text-gray-700"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex flex-col gap-4 my-6">
            <p className="font-medium">Quantity</p>
            <div className="flex items-center gap-4">
              <button
                onClick={decreaseQuantity}
                className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-md font-bold text-lg transition-colors"
              >
                −
              </button>
              <span className="text-xl font-semibold min-w-[40px] text-center">
                {quantity}
              </span>
              <button
                onClick={increaseQuantity}
                className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-md font-bold text-lg transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to cart */}
          <button
            onClick={() => {
              if (!selectedSize) {
                alert("Please select size before adding to cart!");
                return;
              }

              for (let i = 0; i < quantity; i++) {
                addToCart(productData._id, selectedSize);
              }
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors duration-300 font-medium"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Description Section */}
      <div className="w-full max-w-6xl mt-20 px-4 mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Product Details</h2>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          {productData.description ? (
            <p className="text-gray-700 whitespace-pre-line">{productData.description}</p>
          ) : (
            <p className="text-gray-500">No description available for this product.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;