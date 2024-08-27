"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Navbar from "@/component/Nav";

const Products = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [role, setRole] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await axios.get("/api/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            name: searchTerm,
            category: filterCategory,
          },
        });
        setProducts(response.data);

        // Extract role from the token
        const userRole = localStorage.getItem("userRole");
        setRole(userRole || "");
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, [router, searchTerm, filterCategory]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    router.push("/login");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterCategory(e.target.value);
  };

  const handleAddToCart = async (productId: string) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      await axios.post(
        `/api/buyers/cart/add`,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Product added to cart!");
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  const handleDelete = async (productId: string) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      await axios.delete(`/api/products/delete/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(products.filter((product) => product.id !== productId));
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  // Conditional rendering based on role
  const renderProductActions = () => {
    if (role === "seller") {
      return (
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          onClick={() => router.push("/add-product")}
        >
          Add Product
        </button>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Navbar */}
      <Navbar/>

      {/* Content */}
      <div className="p-6 bg-gray-100 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Products
        </h1>
        <div className="flex gap-6 mb-8">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="border border-gray-300 rounded-md p-3 w-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Filter by category..."
            value={filterCategory}
            onChange={handleCategoryChange}
            className="border border-gray-300 rounded-md p-3 w-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                className="border border-gray-200 rounded-lg p-6 shadow-lg bg-white"
              >
                <h2 className="text-2xl font-semibold mb-3 text-gray-700">
                  {product.name}
                </h2>
                <p className="text-gray-600 mb-3">{product.description}</p>
                <p className="text-gray-500 text-sm mb-2">Category: {product.category}</p>
                <p className="text-gray-800 font-bold mb-4">Price: ${product.price}</p>
                <div className="flex justify-between items-center">
                  {role === "seller" ? (
                    <>
                      <button
                        onClick={() =>
                          router.push(`/edit-product/${product.id}`)
                        }
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
                      >
                        Add to Cart
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-500">
              No products available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
