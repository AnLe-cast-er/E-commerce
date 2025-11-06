import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortBy, setSortBy] = useState("Relevant");
  const [loading, setLoading] = useState(true);

  // ✅ Khi products load xong từ context
  useEffect(() => {
    if (products.length > 0) {
      setLoading(false);
      applyFilters(products);
    }
  }, [products]);

  // ✅ Toggle category
  const toggleCategory = (e) => {
    const { value } = e.target;
    setCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  // ✅ Toggle subCategory
  const toggleSubCategory = (e) => {
    const { value } = e.target;
    setSubCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  // ✅ Áp dụng filter
  const applyFilters = (baseProducts = products) => {
    let filtered = baseProducts.slice();

    if (search.trim() !== "") {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      filtered = filtered.filter((item) => category.includes(item.category));
    }

    if (subCategory.length > 0) {
      filtered = filtered.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    // Sau khi lọc xong thì sắp xếp
    filtered = sortProducts(filtered);

    setFilteredProducts(filtered);
  };

  // ✅ Sắp xếp
  const sortProducts = (arr) => {
    const sorted = [...arr];
    if (sortBy === "Low to High") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === "High to Low") {
      sorted.sort((a, b) => b.price - a.price);
    }
    return sorted;
  };

  // ✅ Khi filter hoặc search thay đổi → áp lại filter
  useEffect(() => {
    applyFilters();
  }, [category, subCategory, search, showSearch, sortBy]);

  // ✅ Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-500">Loading collections...</p>
      </div>
    );
  }

  return (
    <div className="flex gap-8 px-8 py-10">
      {/* LEFT FILTERS */}
      <div className="w-[250px] min-w-[250px]">
        <h2 className="font-semibold mb-4 text-lg text-center">FILTERS</h2>

        <div className="mb-6 border border-gray-300 p-4 rounded-md shadow-sm">
          <h3 className="font-medium mb-3 text-sm uppercase text-gray-700">
            Categories
          </h3>
          <div className="space-y-2 text-sm">
            {["Men", "Women", "Kids"].map((cat) => (
              <label key={cat} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={cat}
                  onChange={toggleCategory}
                  checked={category.includes(cat)}
                />
                {cat}
              </label>
            ))}
          </div>
        </div>

        <div className="border border-gray-300 p-4 rounded-md shadow-sm">
          <h3 className="font-medium mb-3 text-sm uppercase text-gray-700">
            Type
          </h3>
          <div className="space-y-2 text-sm">
            {["Topwear", "Bottomwear", "Winterwear"].map((type) => (
              <label key={type} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={type}
                  onChange={toggleSubCategory}
                  checked={subCategory.includes(type)}
                />
                {type}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PRODUCT GRID */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold tracking-wide flex-1 text-center">
            ALL COLLECTIONS
          </h2>
          <select
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 text-sm rounded-md px-3 py-1"
          >
            <option value="Relevant">Sort by: Relevant</option>
            <option value="Low to High">Sort by: Price (Low → High)</option>
            <option value="High to Low">Sort by: Price (High → Low)</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
  {filteredProducts.length === 0 ? (
    <p className="text-gray-500 text-center col-span-full">
      No products found.
    </p>
  ) : (
    filteredProducts.map((item, index) => (
      <ProductItem
        key={item._id || item.id || index}
        productId={item._id || item.id}
        name={item.name || 'Unnamed product'}
        image={item.image || []}
        price={item.price || 0}
      />
    ))
  )}
</div>

      </div>
    </div>
  );
};

export default Collection;
