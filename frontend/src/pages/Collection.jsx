import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [normalizedProducts, setNormalizedProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortBy, setSortBy] = useState("Relevant");
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  // 🧩 1. Chuẩn hóa dữ liệu từ products
 useEffect(() => {
  if (products.length > 0) {
    const normalized = products.map((p) => {

      return {
        ...p,
        category: (p.category || p.Category || p.categoryName || "").toLowerCase(),
        subCategory: p.subCategory || p.SubCategory || p.subcategory || p.sub_category || "",
      };
    });

    setNormalizedProducts(normalized);
    setLoading(false);
  }
}, [products]);


  // 🧩 2. Hàm toggle filter
  const toggleCategory = (e) => {
    const { value } = e.target;
    setCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const toggleSubCategory = (e) => {
    const { value } = e.target;
    
    setSubCategory((prev) => {
      // Kiểm tra xem giá trị đã tồn tại trong mảng chưa (so sánh không phân biệt hoa thường)
      const isExisting = prev.some(item => 
        item.toLowerCase() === value.toLowerCase()
      );
      
      // Nếu đã tồn tại thì lọc ra, nếu chưa thì thêm vào (giữ nguyên kiểu viết hoa)
      return isExisting
        ? prev.filter(item => item.toLowerCase() !== value.toLowerCase())
        : [...prev, value];
    });
  };

  // 🧩 3. Hàm sắp xếp
  const sortProducts = (arr) => {
    const sorted = [...arr];
    if (sortBy === "Low to High") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === "High to Low") {
      sorted.sort((a, b) => b.price - a.price);
    }
    return sorted;
  };

  const applyFilters = (baseProducts = normalizedProducts) => {
    
    let filtered = baseProducts.slice();

    if (search.trim() !== "") {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 📂 Lọc theo Category
    if (category.length > 0) {
      filtered = filtered.filter((item) =>
        category.some(
          (cat) => cat.toLowerCase() === (item.category || "").toLowerCase()
        )
      );
    }

    // 🏷️ Lọc theo SubCategory (case-insensitive)
    if (subCategory.length > 0) {
      filtered = filtered.filter((item) => {
        const itemSubCategory = (item.subCategory || "").toLowerCase();
        const isMatch = subCategory.some(
          (sub) => sub.toLowerCase() === itemSubCategory
        );
        return isMatch;
      });

    }

    // 🔢 Sắp xếp sau khi lọc
    filtered = sortProducts(filtered);
    setFilteredProducts(filtered);
  };

  // 🧩 5. Re-run filters khi filter hoặc search thay đổi
  useEffect(() => {
    setCurrentPage(1);
    applyFilters();
  }, [category, subCategory, search, showSearch, sortBy, normalizedProducts]);

  // 🧩 6. Pagination logic
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // 🧩 7. Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-500">Loading collections...</p>
      </div>
    );
  }

  // 🧩 8. Render UI
  return (
    
    <div className="flex gap-8 px-8 py-10">
      {/* LEFT FILTERS */}
      <div className="w-[250px] min-w-[250px]">
        <h2 className="font-semibold mb-4 text-lg text-center">FILTERS</h2>

        {/* Categories */}
        <div className="mb-6 border border-gray-300 p-4 rounded-md shadow-sm">
          <h3 className="font-medium mb-3 text-sm uppercase text-gray-700">
            Categories
          </h3>
          <div className="space-y-2 text-sm">
            {["men", "women", "kids"].map((cat) => (
              <label key={cat} className="flex items-center gap-2 capitalize">
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

        {/* Sub Categories */}
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
                  checked={subCategory.some(item => item.toLowerCase() === type.toLowerCase())}
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

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
          {currentProducts.length === 0 ? (
            <p className="text-gray-500 text-center col-span-full">
              No products found.
            </p>
          ) : (
            currentProducts.map((item, index) => (
              <ProductItem
                key={item._id || item.id || index}
                productId={item._id || item.id}
                name={item.name || "Unnamed product"}
                image={item.image || []}
                price={item.price || 0}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-8">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className={`px-3 py-1 rounded-md border ${
                currentPage === 1
                  ? "text-gray-400 border-gray-300"
                  : "text-gray-700 border-gray-400 hover:bg-gray-100"
              }`}
            >
              Prev
            </button>

            {/* Smart pagination */}
            {(() => {
              const pageButtons = [];
              const showPages = 2;

              for (let i = 1; i <= totalPages; i++) {
                if (
                  i === 1 ||
                  i === totalPages ||
                  (i >= currentPage - showPages && i <= currentPage + showPages)
                ) {
                  pageButtons.push(i);
                } else if (
                  (i === currentPage - showPages - 1 && i > 1) ||
                  (i === currentPage + showPages + 1 && i < totalPages)
                ) {
                  if (pageButtons[pageButtons.length - 1] !== "ellipsis") {
                    pageButtons.push("ellipsis");
                  }
                }
              }

              return pageButtons.map((page, idx) =>
                page === "ellipsis" ? (
                  <span key={idx} className="px-2 text-gray-400">
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-md border ${
                      currentPage === page
                        ? "bg-gray-800 text-white border-gray-800"
                        : "border-gray-400 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              );
            })()}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className={`px-3 py-1 rounded-md border ${
                currentPage === totalPages
                  ? "text-gray-400 border-gray-300"
                  : "text-gray-700 border-gray-400 hover:bg-gray-100"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
