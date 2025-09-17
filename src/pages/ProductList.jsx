import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = 'https://anupam-ecommerce-python-backend.onrender.com/products';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ category: '', minPrice: '', maxPrice: '' });
  const [sortBy, setSortBy] = useState('price');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 8;
  const skip = (page - 1) * limit;

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        category: filters.category || undefined,
        min_price: filters.minPrice || undefined,
        max_price: filters.maxPrice || undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
        skip,
        limit,
      };

      const { data } = await axios.get(API_URL, { params });
      setProducts(data.data);
      setTotal(data.total);
    } catch (error) {
      console.error('Error fetching products:', error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [filters, sortBy, sortOrder, page]);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setPage(1); // reset to first page on filter change
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-4">Products</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          name="category"
          placeholder="Filter by Category"
          value={filters.category}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="minPrice"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="price">Price</option>
          <option value="rating">Rating</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {/* Products Grid */}
      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white p-4 rounded shadow hover:shadow-lg transition">
                <Link to={`/products/${product.id}`}>
                  <img
                    src={product.thumbnail || product.images?.[0]}
                    alt={product.title}
                    className="w-full h-48 object-cover mb-3 rounded"
                  />
                  <h2 className="text-lg font-semibold">{product.title}</h2>
                  <p className="text-indigo-600 font-bold">${product.price?.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">
                    Rating: {product.rating} ⭐
                  </p>
                  <p className="text-gray-600 mt-2 line-clamp-2">{product.description}</p>
                </Link>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-4 mt-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">{page} / {totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
