import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ productId, image, name, price }) => {
  const { currency, backendUrl } = useContext(ShopContext);


  let imagePath = "";
  try {
    if (!image) {
      imagePath = "";
    } else if (typeof image === "string") {
      imagePath = image;
    } else if (Array.isArray(image)) {
      imagePath = image[0] || "";
    }
  } catch (err) {
    imagePath = "";
  }

  const buildSrc = (path) => {
    if (!path) return "";
    const normalized = path.replace(/\\\\/g, "/").replace(/^\//, "");
    if (/^https?:\/\//i.test(path)) return path;

    const base = (backendUrl || "http://localhost:8000").replace(/\/$/, "");
    return `${base}/${normalized}`;
  };

  const src = buildSrc(imagePath);

  const placeholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3C/svg%3E";

  return (
    <Link to={`/product/${productId}`} className="text-gray-700 cursor-pointer block w-full max-w-xs">
      <div className="overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300 group">
        <div className="w-full h-64 bg-gray-100 overflow-hidden">
          <img
            src={src || placeholder}
            alt={name}
            onError={(e) => {
              e.currentTarget.src = placeholder;
            }}
            className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-3">
          <p className="pt-1 pb-1 text-sm truncate font-medium">{name}</p>
          <p className="text-base font-semibold">{currency}{price}</p>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
