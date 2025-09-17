import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const PRODUCT_API = "https://anupam-ecommerce-python-backend.onrender.com/products";
const CART_API = "https://anupam-ecommerce-python-backend.onrender.com/cart";
const USER_ID = "test-user";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);

  const [cart, setCart] = useState({ items: [] });
  const [productsMap, setProductsMap] = useState({}); // productId -> product details
  const [loadingCart, setLoadingCart] = useState(false);

  // Fetch product details
  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoadingProduct(true);
        const res = await axios.get(`${PRODUCT_API}/${id}`);
        setProduct(res.data);
      } catch (err) {
        setError("Failed to load product details.");
      } finally {
        setLoadingProduct(false);
      }
    }
    if (id) fetchProduct();
  }, [id]);

  // Fetch cart items & product details for cart
  async function fetchCart() {
    try {
      setLoadingCart(true);
      const cartRes = await axios.get(`${CART_API}/${USER_ID}`);
      setCart(cartRes.data);

      const productIds = cartRes.data.items.map(i => i.product_id);

      if (productIds.length === 0) {
        setProductsMap({});
        setLoadingCart(false);
        return;
      }

      const productsRes = await axios.get(PRODUCT_API);
      const filtered = productsRes.data.data.filter(p => productIds.includes(p.id));

      const map = {};
      filtered.forEach(p => {
        map[p.id] = p;
      });
      setProductsMap(map);
    } catch (e) {
      console.error("Failed to fetch cart", e);
    } finally {
      setLoadingCart(false);
    }
  }

  // Load cart on mount too
  useEffect(() => {
    fetchCart();
  }, []);

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    try {
      await axios.post(`${CART_API}/${USER_ID}/add`, {
        items: [{ product_id: product.id, quantity: 1 }],
      });
      alert("Added to cart!");
      await fetchCart(); // refresh cart data to show update
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart.");
    } finally {
      setAdding(false);
    }
  };

  if (loadingProduct) return <p>Loading product...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div style={{ maxWidth: 700, margin: "auto", padding: 20 }}>
      <h1>{product.title}</h1>
      <img
        src={product.thumbnail || product.images?.[0]}
        alt={product.title}
        style={{ width: "100%", maxHeight: 300, objectFit: "cover", borderRadius: 8 }}
      />
      <p>{product.description}</p>
      <p>
        <strong>Price:</strong> ${product.price.toFixed(2)}
      </p>
      <button onClick={handleAddToCart} disabled={adding}>
        {adding ? "Adding..." : "Add to Cart"}
      </button>

      <hr style={{ margin: "30px 0" }} />

      <h2>Your Cart</h2>
      {loadingCart && <p>Loading cart...</p>}

      {!loadingCart && cart.items.length === 0 && <p>Your cart is empty.</p>}

      {!loadingCart &&
        cart.items.map(({ product_id, quantity }) => {
          const prod = productsMap[product_id];
          if (!prod) return null;
          return (
            <div
              key={product_id}
              style={{
                display: "flex",
                alignItems: "center",
                borderBottom: "1px solid #ccc",
                padding: "10px 0",
              }}
            >
              <img
                src={prod.thumbnail || prod.images?.[0]}
                alt={prod.title}
                style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4, marginRight: 15 }}
              />
              <div>
                <p style={{ margin: 0 }}>{prod.title}</p>
                <p style={{ margin: 0 }}>
                  Qty: <strong>{quantity}</strong> | Price: ${prod.price.toFixed(2)}
                </p>
                <p style={{ margin: 0, fontWeight: "bold" }}>
                  Total: ${(prod.price * quantity).toFixed(2)}
                </p>
              </div>
            </div>
          );
        })}
    </div>
  );
}
