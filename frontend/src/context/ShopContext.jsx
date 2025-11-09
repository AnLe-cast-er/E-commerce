import { createContext, useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const currency = "$";
  const delivery_fee = 10;
  // Ensure backend URL doesn't end with a trailing slash to avoid double // when building endpoints
  const backendUrl = (import.meta.env.VITE_BACKEND_URL || '').replace(/\/$/, '');
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem("cartData");
    return stored ? JSON.parse(stored) : {};
  });
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const cartLoaded = useRef(false); 


  useEffect(() => {
    localStorage.setItem("cartData", JSON.stringify(cartItems));
  }, [cartItems]);

  // Fetch sản phẩm
const getProductsData = async (retries = 3, delay = 2000) => {
  try {
    const response = await axios.get(`${backendUrl}/api/product/list`);

    if (response.data && Array.isArray(response.data.products)) {
      const normalized = response.data.products.map(item => ({
        _id: item._id || item.id, 
        name: item.name,
        description: item.description,
        image: item.image,
        price: item.price,
        category: item.category,
        bestseller: item.bestseller,
        sizes: item.sizes || [],  
      }));


      setProducts(normalized);
    }
  } catch (error) {
    if (error.response?.status === 429 && retries > 0) {
      console.warn(`429 Too Many Requests. Retrying in ${delay}ms...`);
      setTimeout(() => getProductsData(retries - 1, delay * 2), delay);
    } else {
      console.error("Error fetching products:", error);
      toast.error("Cannot load product");
    }
  }
};

    const productsLoaded = useRef(false);

    useEffect(() => {
      if (!productsLoaded.current) {
        productsLoaded.current = true;
        getProductsData();
      }
    }, []);


  const getCartData = async () => {
    if (!token || cartLoaded.current) return;
    cartLoaded.current = true; 


    try {
      const res = await axios.get(`${backendUrl}/api/cart/get`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          token: token,
        },
        withCredentials: true,
      });



      if (res.data.success) {

        const cartData = res.data.cartData || {};
        setCartItems(cartData);
        

        setTimeout(() => {

        }, 1000);
      } else {
        toast.error(res.data.message || "Cannot load cart data");
      }
    } catch (err) {

    }
  };


  const addToCart = async (itemId, size) => {
    if (!size) return toast.error("Please select a size before adding to cart");

    const newCart = { ...cartItems };
    if (!newCart[itemId]) {
      // Initialize with proper structure matching backend
      const product = products.find(p => p._id === itemId);
      if (!product) {
        return toast.error("Product not found");
      }
      newCart[itemId] = {
        product: {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image?.[0] || ''
        },
        sizes: {}
      };
    }
    
    // Ensure sizes object exists
    if (!newCart[itemId].sizes) {
      newCart[itemId].sizes = {};
    }
    
    // Update quantity for specific size
    const currentQty = newCart[itemId].sizes[size] || 0;
    newCart[itemId].sizes[size] = currentQty + 1;
    
    setCartItems(newCart);

    // Show success message
    toast.success("Added to cart!");

    if (!token) {
      return toast.error("Please log in to save cart to your account");
    }

    try {

      const response = await axios.post(
        `${backendUrl}/api/cart/add`,
        { itemId, size },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            token,
          },
          withCredentials: true,
        }
      );
      
      
      // Force refresh cart data from server
      await getCartData();
    } catch (error) {
      console.error("Error addToCart:", error.response?.data || error);
    }
  };


  const getCartAmount = () => {
    if (!cartItems) return 0;
    
    let total = 0;
    for (const itemId in cartItems) {
      const item = cartItems[itemId];
      if (item && item.product && item.sizes) {
        const product = products.find(p => p._id === itemId) || item.product;
        for (const size in item.sizes) {
          const quantity = parseInt(item.sizes[size]) || 0;
          total += (product.price || 0) * quantity;
        }
      }
    }
    return total;
  };

  
  const getCartCount = () => {
    if (!cartItems) return 0;
    
    let count = 0;
    for (const itemId in cartItems) {
      const item = cartItems[itemId];
      if (item && item.sizes) {
        for (const size in item.sizes) {
          count += parseInt(item.sizes[size]) || 0;
        }
      }
    }
    return count;
  };


  const updateQuantity = async (itemId, size, quantity) => {
    try {
      // Create a copy of current cart items
      const updatedCart = { ...cartItems };
      
      // If quantity is 0 or less, remove the item
      if (quantity <= 0) {
        if (updatedCart[itemId]?.sizes?.[size]) {
          delete updatedCart[itemId].sizes[size];
          
          // If no sizes left, remove the item completely
          if (Object.keys(updatedCart[itemId].sizes).length === 0) {
            delete updatedCart[itemId];
          }
        }
      } else {
        // Update quantity
        if (!updatedCart[itemId]) {
          updatedCart[itemId] = {
            product: products.find(p => p._id === itemId),
            sizes: {}
          };
        }
        updatedCart[itemId].sizes = {
          ...updatedCart[itemId].sizes,
          [size]: quantity
        };
      }
      
      // Update local state
      setCartItems(updatedCart);
      
      // Sync with server if authenticated
      if (token) {
        await axios.put(
          `${backendUrl}/api/cart/update`,
          { itemId, size, quantity },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
              'token': token
            }
          }
        );
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error(error.response?.data?.message || "Lỗi khi cập nhật giỏ hàng");
      // Revert to previous state on error
      setCartItems({ ...cartItems });
    }
  }
  const getUserCart = async () => {
    if (!token) return;
    
    try {
      const response = await axios.get(`${backendUrl}/api/cart/get`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'token': token
        }
      });
      
      if (response.data.success) {
        // Use cartData from response if available, otherwise use empty object
        const cartData = response.data.cartData || {};
        setCartItems(cartData);
      } else {
        console.error("Failed to load cart:", response.data.message);
        toast.error(response.data.message || "Không thể tải giỏ hàng");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

    useEffect(() => {
      if(!token && localStorage.getItem("token")){
        setToken(localStorage.getItem("token"));
        getUserCart( localStorage.getItem("token"));
      }
    }, []);



  const removeFromCart = async (itemId, size) => {
    const newCart = { ...cartItems };
    if (newCart[itemId]?.[size]) {
      delete newCart[itemId][size];
      // Remove the itemId if no sizes left
      if (Object.keys(newCart[itemId]).length === 0) {
        delete newCart[itemId];
      }
      setCartItems(newCart);

      if (token) {
        try {
          await axios.post(
            `${backendUrl}/api/cart/update`,
            { itemId, size, quantity: 0 }, // Set quantity to 0 to remove
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                token,
              },
            }
          );
        } catch (error) {
          console.error("Error removing from cart:", error);
          toast.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng");
        }
      }
    }
  };

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartCount,
    getCartAmount,
    navigate,
    backendUrl,
    token,
    setToken,
  };

  return (
    <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
