"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const Cart = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchCartAndProducts = async () => {
      const token = localStorage.getItem("authToken");
      const userRole = localStorage.getItem("userRole");

      if (!token || userRole !== "buyer") {
        router.push("/login");
        return;
      }

      setRole(userRole || "");

      try {
        // Fetch cart items
        const cartResponse = await axios.get("/api/buyers/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const cartProductIds = cartResponse.data;

        // Fetch product details
        const productResponses = await Promise.all(
          cartProductIds.map(({ productId }: { productId: number }) =>
            axios.get(`/api/products/${productId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
          )
        );

        setProducts(productResponses.map((response) => response.data[0]));
        setCartItems(cartProductIds);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching cart and products:", err);
        setIsLoading(false);
      }
    };

    fetchCartAndProducts();
  }, [router]);

  const handleRemoveFromCart = async (productId: string) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      await axios.delete(`/api/buyers/cart/remove/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(products.filter((product) => product.id !== productId));
      setCartItems(cartItems.filter((item) => item.productId !== productId));
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-4 bg-gray-900 text-white shadow-md rounded-lg mb-8">
        <div className="flex items-center space-x-6">
          <h1 className="text-2xl font-semibold">E-com</h1>
        </div>
        <div className="flex space-x-6">
          <button
            className="bg-blue-600 px-6 py-2 rounded-md hover:bg-blue-700 transition"
            onClick={() => router.push("/products")}
          >
            Products
          </button>
          <button
            className="bg-green-600 px-6 py-2 rounded-md hover:bg-green-700 transition"
            onClick={() => router.push("/cart")}
          >
            Cart
          </button>
          <button
            className="bg-red-600 px-6 py-2 rounded-md hover:bg-red-700 transition"
            onClick={() => {
              localStorage.removeItem("authToken");
              localStorage.removeItem("userRole");
              router.push("/login");
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="p-6 bg-gray-100 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Cart
        </h1>
        {isLoading ? (
          <div className="text-center text-gray-600">Loading...</div>
        ) : products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="border border-gray-200 rounded-lg p-6 mb-4 shadow-md bg-white"
            >
              <h2 className="text-xl font-semibold mb-2 text-gray-700">
                {product.name}
              </h2>
              <p className="text-gray-600">{product.description}</p>
              <p className="text-gray-500 text-sm">Category: {product.category}</p>
              <p className="text-gray-800 font-bold">Price: ${product.price}</p>
              <div className="mt-4">
                <button
                  onClick={() => handleRemoveFromCart(product.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                >
                  Remove from Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">Your cart is empty</div>
        )}
      </div>
    </div>
  );
};

export default Cart;
