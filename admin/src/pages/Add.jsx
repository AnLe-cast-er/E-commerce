import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";


const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Add = () => {
  const [images, setImages] = useState([null, null, null, null]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Men"); 
  const [subCategory, setSubCategory] = useState("Topwear"); 
  const [price, setPrice] = useState("");
  const [sizes, setSizes] = useState([]);
  const [bestseller, setBestseller] = useState(false);
  const [loading, setLoading] = useState(false);

  const uploadToCloudinary = async (file) => {
    if (!file) return null;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "mern_ecommerce_preset");
    data.append("cloud_name", "do0o4i3pu");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/do0o4i3pu/image/upload",
      { method: "POST", body: data }
    );

    const json = await res.json();
    return json.secure_url;
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let token = localStorage.getItem("token");

      if (!token) {
        const urlParams = new URLSearchParams(window.location.search);
        token = urlParams.get("token");
        if (token) {
          localStorage.setItem("token", token);
          window.history.replaceState({}, document.title, window.location.pathname);
        } else {
          window.location.href = "/";
          return;
        }
      }

      toast.info("Uploading images to Cloudinary...");
      const imageUrls = [];

      for (let img of images) {
        if (img) {
          const url = await uploadToCloudinary(img);
          imageUrls.push(url);
        }
      }

      const productData = {
        name,
        description,
        category: category,      
        subCategory: subCategory,  
        price: parseFloat(price),   
        sizes,
        bestseller,
        image: imageUrls,
      };

      // console.log("🟢 Sending product data:", productData);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(
        `${backendUrl}/api/product/add`,
        productData,
        config
      );
      toast.success("✅ Product added successfully! Form reset.");
              
        setName("");
        setDescription("");
        setPrice("");
        setBestseller(false);
        setSizes([]);
        setImages([null, null, null, null]);
        setCategory("Men"); 
        setSubCategory("Topwear");
    } catch (error) {
      if (error.response) {
        // console.log("Validation errors:", error.response.data);
        toast.error(
          "Validation error: " + JSON.stringify(error.response.data.errors)
        );
      } else {
        // console.error("Error adding product:", error);
        toast.error("Failed to add product");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col w-full items-start gap-6 p-6 bg-white rounded-lg shadow-md"
      >
        {/* Image Upload */}
        <div>
          <p className="mb-2">Upload Image</p>
          <div className="flex gap-3">
            {images.map((img, i) => (
              <label key={i} htmlFor={`image${i}`}>
                <img
                  className="w-20 h-20 object-cover border rounded"
                  src={!img ? assets.upload_icon : URL.createObjectURL(img)}
                  alt=""
                />
                <input
                  onChange={(e) => {
                    const newImgs = [...images];
                    newImgs[i] = e.target.files[0];
                    setImages(newImgs);
                  }}
                  type="file"
                  id={`image${i}`}
                  hidden
                />
              </label>
            ))}
          </div>
        </div>

        {/* Name */}
        <div className="w-full">
          <p className="mb-2">Product Name</p>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="w-full max-w-[500px] px-3 py-2 border rounded"
            type="text"
            placeholder="Type here"
            required
          />
        </div>

        {/* Description */}
        <div className="w-full">
          <p className="mb-2">Product Description</p>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="w-full max-w-[500px] px-3 py-2 border rounded"
            placeholder="Write here"
            required
          />
        </div>

        {/* Category, Subcategory, Price */}
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <div>
            <p>Product Category</p>
            <select
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>

          <div>
            <p>Sub Category</p>
            <select
              onChange={(e) => setSubCategory(e.target.value)}
              value={subCategory}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Winterwear">Winterwear</option>
            </select>
          </div>

          <div>
            <p className="mb-2">Product Price</p>
            <input
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              className="w-full px-3 py-2 border rounded"
              type="number"
              placeholder="25"
              required
            />
          </div>
        </div>

        {/* Sizes */}
        <div className="w-full">
          <p className="mb-2">Product Sizes</p>
          <div className="flex gap-2 flex-wrap">
            {["S", "M", "L", "XL", "XXL"].map((size) => {
              const selected = sizes.includes(size);
              return (
                <div
                  key={size}
                  onClick={() =>
                    setSizes((prev) =>
                      selected ? prev.filter((s) => s !== size) : [...prev, size]
                    )
                  }
                  className={`px-4 py-2 rounded cursor-pointer border ${
                    selected
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white border-gray-300"
                  }`}
                >
                  {size}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bestseller */}
        <div className="flex gap-2 mt-2">
          <input
            onChange={() => setBestseller((prev) => !prev)}
            checked={bestseller}
            type="checkbox"
            id="bestseller"
          />
          <label htmlFor="bestseller">Add to bestseller</label>
        </div>

        <button
          disabled={loading}
          className="bg-black text-white w-32 py-3 mt-4 rounded hover:bg-gray-800"
          type="submit"
        >
          {loading ? "Uploading..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default Add;