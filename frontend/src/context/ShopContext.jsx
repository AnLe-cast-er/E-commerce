import { createContext, useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const currency = "$";
  const delivery_fee = 10;
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
        subCategory: item.subCategory || item.SubCategory || "",
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


  const addToCart = async (itemId, size, quantity = 1) => {
  if (!size) return toast.error("Please select a size before adding to cart");

  const qty = Math.max(1, Number(quantity) || 1);

  const newCart = { ...cartItems };
  const product = products.find(p => p._id === itemId);
  if (!product) {
    return toast.error("Product not found");
  }

  if (!newCart[itemId]) {
    newCart[itemId] = {
      product: {
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image?.[0] || "",
      },
      sizes: {},
    };
  }

  if (!newCart[itemId].sizes) {
    newCart[itemId].sizes = {};
  }

  const currentQty = newCart[itemId].sizes[size] || 0;
  newCart[itemId].sizes[size] = currentQty + qty;

  setCartItems(newCart);
  toast.success(`Added ${qty} item${qty > 1 ? "s" : ""} to cart!`);

  if (!token) {
    return toast.error("Please log in to save cart to your account");
  }

  try {
    const response = await axios.post(
      `${backendUrl}/api/cart/add`,
      { itemId, size, quantity: qty }, 
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          token,
        },
        withCredentials: true,
      }
    );

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
      const updatedCart = { ...cartItems };
      
      if (quantity <= 0) {
        if (updatedCart[itemId]?.sizes?.[size]) {
          delete updatedCart[itemId].sizes[size];
          
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
      toast.error(error.response?.data?.message || "Error updating cart");
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
        const cartData = response.data.cartData || {};
        setCartItems(cartData);
      } else {
        console.error("Failed to load cart:", response.data.message);
        toast.error(response.data.message || "Unable to load cart");
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
            { itemId, size, quantity: 0 }, 
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
          toast.error("Error removing product from cart");
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
