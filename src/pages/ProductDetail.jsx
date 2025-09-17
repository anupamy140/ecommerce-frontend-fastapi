import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const PRODUCT_API = "https://anupam-ecommerce-python-backend.onrender.com/products";
const CART_API = "https://anupam-ecommerce-python-backend.onrender.com/cart";
const USER_ID = "test-user";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${PRODUCT_API}/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error("Error fetching product:", err.message);
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    } else {
      setError("Invalid product ID");
      setLoading(false);
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (!product || !product.id) return;
    setAdding(true);

    try {
      const payload = {
        items: [{ product_id: product.id, quantity: 1 }],
      };

      const response = await axios.post(`${CART_API}/${USER_ID}/add`, payload);
      console.log("Add to cart response:", response.data);
      alert("Product added to cart!");
      // TODO: refresh global cart state if needed
    } catch (error) {
      console.error("Error adding to cart:", error.response || error.message);
      alert("Failed to add to cart. Please try again.");
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <p>Loading product...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
      <Link to="/" className="text-indigo-600 hover:underline mb-4 inline-block">
        &larr; Back to Products
      </Link>

      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={product.thumbnail || product.images?.[0]}
          alt={product.title}
          className="w-full md:w-1/2 h-64 object-cover rounded"
        />

        <div className="md:w-1/2">
          <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
          <p className="text-indigo-600 font-bold text-xl mb-2">${product.price?.toFixed(2)}</p>
          <p className="text-gray-600 mb-4">{product.description}</p>

          <p className="text-sm text-gray-500 mb-2">
            Category: <span className="font-medium">{product.category}</span>
          </p>
          <p className="text-sm text-gray-500 mb-2">
            Rating: <span className="font-medium">{product.rating} ⭐</span>
          </p>

          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {adding ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
