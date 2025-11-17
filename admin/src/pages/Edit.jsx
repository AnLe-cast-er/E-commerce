import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Edit = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Men');
  const [subCategory, setSubCategory] = useState('Topwear');
  const [sizes, setSizes] = useState([]);
  const [bestseller, setBestseller] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);
  const [imagePreviews, setImagePreviews] = useState(Array(4).fill(null)); 
  
  //upload new image in cloudinary
  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'mern_ecommerce_preset'); 
    data.append('cloud_name', 'do0o4i3pu'); 

    const res = await fetch(`https://api.cloudinary.com/v1_1/do0o4i3pu/image/upload`, {
      method: 'POST',
      body: data,
    });
    const result = await res.json();
    return result.secure_url; 
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      navigate('/login');
      return {};
    }
    return {
      'Authorization': `Bearer ${token}`,
    };
  };

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const headers = getAuthHeaders();
        if (!headers.Authorization) return;
        
        const response = await axios.get(
          `${backendUrl}/api/product/${id}`,
          { headers: { 'Authorization': headers.Authorization } }
        );
        
        if (response.data.data) {
          const productData = response.data.data;
          
          setName(productData.name || '');
          setDescription(productData.description || '');
          setPrice(productData.price ? productData.price.toString() : ''); 
          setCategory(productData.category || 'Men');
          setSubCategory(productData.subCategory || 'Topwear');
          setSizes(Array.isArray(productData.sizes) ? productData.sizes : []);
          setBestseller(productData.bestseller || false);
          
          if (Array.isArray(productData.image)) {
            const imagesArray = productData.image.slice(0, 4);
            const previews = [...imagesArray, ...Array(4 - imagesArray.length).fill(null)];
            
            setImage1(imagesArray[0] || null);
            setImage2(imagesArray[1] || null);
            setImage3(imagesArray[2] || null);
            setImage4(imagesArray[3] || null);
            setImagePreviews(previews);
          }
        } else {
          toast.error(response.data.message || 'Failed to load product details');
          navigate('/list');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error(error.response?.data?.message || 'Error loading product details');
        if (error.response?.status === 401) {
          navigate('/login');
        } else {
          navigate('/list');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
        fetchProduct();
    } else {
        navigate('/list'); 
    }
  }, [id, navigate]);

  const handleSizeChange = (size) => {
    setSizes(prevSizes => {
      if (prevSizes.includes(size)) {
        return prevSizes.filter(s => s !== size);
      } else {
        return [...prevSizes, size];
      }
    });
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const newPreviews = [...imagePreviews];
    newPreviews[index] = URL.createObjectURL(file);
    setImagePreviews(newPreviews);
    
    switch(index) {
      case 0: setImage1(file); break;
      case 1: setImage2(file); break;
      case 2: setImage3(file); break;
      case 3: setImage4(file); break;
      default: break;
    }
  };

  // Remove image
  const removeImage = (index) => {
    // Clear preview
    const newPreviews = [...imagePreviews];
    newPreviews[index] = null;
    setImagePreviews(newPreviews);
    
    switch(index) {
      case 0: setImage1(null); break;
      case 1: setImage2(null); break;
      case 2: setImage3(null); break;
      case 3: setImage4(null); break;
      default: break;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
  e.preventDefault();
  setSaving(true);
  try {
    const headers = getAuthHeaders();
    if (!headers.Authorization) return;

    const allImages = [image1, image2, image3, image4];
    const existingImages = [];
    const newImages = [];

    for (const img of allImages) {
      if (img) {
        if (typeof img === "string") {
          existingImages.push(img); 
        } else if (img instanceof File) {
          const uploadedUrl = await uploadToCloudinary(img);
          newImages.push(uploadedUrl);
        }
      }
    }

    const payload = {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
      new_image: newImages,        
      existing_images: existingImages, 
    };

    const res = await axios.post(
      `${backendUrl}/api/product/update/${id}`,
      payload,
      { headers: headers }
    );
    console.log("All images state:", image1, image2, image3, image4);
    console.log("Existing images:", existingImages);
    console.log("New images (to upload):", newImages);
    toast.success("Product updated successfully!");
    console.log("Update success:", res.data);
    navigate("/list");
  } catch (error) {
    console.error("Error updating product:", error.response?.data || error);
    toast.error(error.response?.data?.message || "Error updating product");
  } finally {
    setSaving(false);
  }
};



  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Edit Product</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
          {validationErrors.name && <p className="text-red-500 text-sm mt-1">{validationErrors.name[0]}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
          {validationErrors.description && <p className="text-red-500 text-sm mt-1">{validationErrors.description[0]}</p>}
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Price (VND)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
          {validationErrors.price && <p className="text-red-500 text-sm mt-1">{validationErrors.price[0]}</p>}
        </div>

        {/* Category and Subcategory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Subcategory</label>
            <select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Footwear">Footwear</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>
        </div>

        {/* Sizes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sizes</label>
          <div className="flex flex-wrap gap-2">
            {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
              <button
                key={size}
                type="button"
                onClick={() => handleSizeChange(size)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  sizes.includes(size)
                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                    : 'bg-gray-100 text-gray-800 border border-gray-300'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
          {validationErrors.sizes && <p className="text-red-500 text-sm mt-1">{validationErrors.sizes[0]}</p>}
        </div>

        {/* Bestseller */}
        <div className="flex items-center">
          <input
            id="bestseller"
            type="checkbox"
            checked={bestseller}
            onChange={(e) => setBestseller(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="bestseller" className="ml-2 block text-sm text-gray-700">
            Bestseller Product
          </label>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="relative group">
                <div
                  className={`h-32 w-full rounded-md border-2 border-dashed ${
                    imagePreviews[index]
                      ? 'border-transparent'
                      : 'border-gray-300 hover:border-blue-500'
                  } flex items-center justify-center overflow-hidden`}
                  onClick={() => document.getElementById(`image-upload-${index}`).click()}
                >
                  {imagePreviews[index] ? (
                    <img
                      src={imagePreviews[index] instanceof File ? URL.createObjectURL(imagePreviews[index]) : imagePreviews[index]}
                      alt={`Preview ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="mt-1 text-sm text-gray-600">
                        <span className="text-blue-600 font-medium">Upload Image</span>
                      </div>
                    </div>
                  )}
                  <input
                    id={`image-upload-${index}`}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, index)}
                  />
                </div>
                {imagePreviews[index] && (
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/list')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Edit;