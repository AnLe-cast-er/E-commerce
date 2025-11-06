import logo from './logo.png';
import cart_icon from './cart_icon.jpg';
import search_icon_img from './search_icon.jpg';
import profile_icon_img from './profile_icon.jpg';
import menu_icon_img from './menu_icon.jpg';
import dropdown_icon from './dropdown_icon.jpg';
import exchange_icon from './exchange_icon.jpg';
import support_img from './support_img.jpg';
import quality_icon from './quality_icon.jpg';
import cross_icon from './cross_icon.jpg';
import bin_icon from './bin_icon.jpg';
import contact_img from './contact_img.jpg';
import about_img from './about_img.jpg';

import hero from './hero.jpg';
import shirt1 from './shirt1.jpg';
import shirt2 from './shirt2.jpg';
import shirt3 from './shirt3.jpg';
import shirt4 from './shirt4.jpg';
import jean1 from './jean1.jpg';
import jean2 from './jean2.jpg';
import jean3 from './jean3.jpg';
import jean4 from './jean4.jpg';
import s1 from './s1.jpg';
import s2 from './s2.jpg';
import s3 from './s3.jpg';
import s4 from './s4.jpg';
import vest1 from './vest1.jpg';
import vest2 from './vest2.jpg';
import vest3 from './vest3.jpg';
import vest4 from './vest4.jpg';    
import dress1 from './dress1.jpg';
import dress2 from './dress2.jpg';
import dress3 from './dress3.jpg';
import dress4 from './dress4.jpg';
import kids1 from './kids1.jpg';
import kids2 from './kids2.jpg';
import kids3 from './kids3.jpg';
import kids4 from './kids4.jpg';
import vnpay_icon from './vnpay_icon.jpg';
import momo_icon from './momo_icon.jpg';


export const assets = {
    logo,
    search_icon: search_icon_img,
    profile_icon: profile_icon_img,
    cart_icon,
    menu_icon: menu_icon_img,
    dropdown_icon: dropdown_icon,
    exchange_icon,
    quality_icon,
    support_img,
    cross_icon,
    bin_icon,
    contact_img,
    about_img,
    
    hero,
    shirt1,
    shirt2, 
    shirt3,
    shirt4,
    jean1,
    jean2,  
    jean3,
    jean4,
    s1,     
    s2,
    s3,
    s4,
    vest1,
    vest2,
    vest3,
    vest4,
    dress1,
    dress2,
    dress3,
    dress4,
    kids4,
    kids3,
    kids2,
    kids1,
    vnpay_icon,
    momo_icon
};

export const products = [
  // ======== MEN JEANS (BOTTOMWEAR) ========
  {
    _id: "p001",
    name: "Men Classic Blue Jeans",
    description: "High-quality blue jeans with a modern slim fit style.",
    price: 120,
    image: [jean1, jean2, jean3, jean4],
    category: "Men",
    subCategory: "Bottomwear",
    sizes: ["M", "L", "XL"],
    date: 1716634345448,
    bestseller: true,
  },
  {
    _id: "p002",
    name: "Men Black Stretch Jeans",
    description: "Comfortable and stretchable jeans perfect for everyday wear.",
    price: 110,
    image: [jean1, jean2, jean3, jean4],
    category: "Men",
    subCategory: "Bottomwear",
    sizes: ["M", "L", "XL"],
    date: 1716634345448,
    bestseller: false,
  },
  {
    _id: "p003",
    name: "Men Regular Fit Jeans",
    description: "Durable denim jeans offering classic style and comfort.",
    price: 100,
    image: [jean1, jean2, jean3, jean4],
    category: "Men",
    subCategory: "Bottomwear",
    sizes: ["M", "L", "XL"],
    date: 1716634345448,
    bestseller: true,
  },
  {
    _id: "p004",
    name: "Men Grey Washed Jeans",
    description: "Trendy washed grey jeans with a relaxed fit.",
    price: 130,
    image: [jean1, jean2, jean3, jean4],
    category: "Men",
    subCategory: "Bottomwear",
    sizes: ["M", "L", "XL"],
    date: 1716634345448,
    bestseller: false,
  },

  // ======== MEN SHIRTS (TOPWEAR) ========
  {
    _id: "p005",
    name: "Casual White Cotton Shirt",
    description: "Lightweight and breathable shirt for all occasions.",
    price: 90,
    image: [shirt1, shirt2, shirt3, shirt4],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["M", "L", "XL"],
    date: 1716634345448,
    bestseller: true,
  },
  {
    _id: "p006",
    name: "Slim Fit Blue Shirt",
    description: "Stylish slim-fit shirt made from high-quality cotton.",
    price: 95,
    image: [shirt1, shirt2, shirt3, shirt4],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["M", "L", "XL"],
    date: 1716634345448,
    bestseller: false,
  },
  {
    _id: "p007",
    name: "Classic Checked Shirt",
    description: "Timeless checked shirt for casual or office wear.",
    price: 100,
    image: [shirt1, shirt2, shirt3, shirt4],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["M", "L", "XL"],
    date: 1716634345448,
    bestseller: true,
  },
  {
    _id: "p008",
    name: "Beige Linen Shirt",
    description: "Comfortable and airy linen shirt for warm weather.",
    price: 110,
    image: [shirt1, shirt2, shirt3, shirt4],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["M", "L", "XL"],
    date: 1716634345448,
    bestseller: false,
  },

  // ======== WOMEN DRESS (TOPWEAR) ========
  {
    _id: "p009",
    name: "Women Summer Dress",
    description: "Elegant summer dress made with soft fabric for a perfect fit.",
    price: 150,
    image: [s1, s2, s3, s4],
    category: "Women",
    subCategory: "Topwear",
    sizes: ["M", "L", "XL"],
    date: 1716634345448,
    bestseller: true,
  },
  {
    _id: "p010",
    name: "Women Floral Top",
    description: "Stylish floral print top for a chic casual look.",
    price: 85,
    image: [s1, s2, s3, s4],
    category: "Women",
    subCategory: "Topwear",
    sizes: ["M", "L", "XL"],
    date: 1716634345448,
    bestseller: false,
  },
  {
    _id: "p011",
    name: "Women High Waist Jeans",
    description: "Trendy high-waist jeans that go with any top.",
    price: 140,
    image: [s1, s2, s3, s4],
    category: "Women",
    subCategory: "Bottomwear",
    sizes: ["M", "L", "XL"],
    date: 1716634345448,
    bestseller: true,
  },
  {
    _id: "p012",
    name: "Women Formal Blouse",
    description: "Elegant blouse suitable for both office and casual wear.",
    price: 120,
    image: [s1, s2, s3, s4],
    category: "Women",
    subCategory: "Topwear",
    sizes: ["M", "L", "XL"],
    date: 1716634345448,
    bestseller: false,
  },

  // ======== NEW ITEMS ========
  {
    _id: "p013",
    name: "Women Elegant Floral Dress",
    description: "Beautiful floral dress made from soft, breathable fabric for all-day comfort.",
    price: 180,
    image: [dress1, dress2, dress3, dress4],
    category: "Women",
    subCategory: "Topwear",
    sizes: ["M", "L", "XL"],
    date: 1716634345448,
    bestseller: true,
  },
  {
    _id: "p014",
    name: "Women Summer Long Dress",
    description: "Lightweight long dress perfect for summer with a comfortable fit.",
    price: 210,
    image: [dress1, dress2, dress3, dress4],
    category: "Women",
    subCategory: "Topwear",
    sizes: ["M", "L", "XL"],
    date: 1716634345448,
    bestseller: false,
  },
  {
    _id: "p015",
    name: "Kids Cotton T-shirt",
    description: "Soft cotton T-shirt for kids, ideal for everyday wear and comfort.",
    price: 60,
    image: [kids1, kids2, kids3, kids4],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["M", "L", "XL"],
    date: 1716634345448,
    bestseller: true,
  },
];



// Utility functions for testing
export const getProductById = (productId) => {
    return products.find(product => product.id === productId);
};

export const getProductsByCategory = (category) => {
    return products.filter(product => product.category === category);
};

export const getBestsellerProducts = () => {
    return products.filter(product => product.bestseller === true);
};

export const getProductsBySubCategory = (subCategory) => {
    return products.filter(product => product.subCategory === subCategory);
};

export const searchProducts = (query) => {
    return products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
    );
};

export const getProductPriceRange = () => {
    const prices = products.map(product => product.price);
    return {
        min: Math.min(...prices),
        max: Math.max(...prices)
    };
};

export const getCategories = () => {
    return [...new Set(products.map(product => product.category))];
};

export const getSubCategories = () => {
    return [...new Set(products.map(product => product.subCategory))];
};

// Test data for API calls
export const testProductData = {
    name: "Test Product",
    description: "This is a test product for API testing",
    price: 250000,
    category: "Áo",
    subCategory: "Áo thun",
    sizes: ["S", "M", "L"],
    bestseller: false
};
