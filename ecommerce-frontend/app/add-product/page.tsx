"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Navbar from '@/component/Nav';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [role, setRole] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkUserRole = () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/login');
        return;
      }

      const userRole = localStorage.getItem('userRole');
      if (userRole !== 'seller') {
        router.push('/products');
        return;
      }
      setRole(userRole);
    };

    checkUserRole();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      await axios.post('/api/products/add', {
        name,
        category,
        description,
        price,
        discount
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      router.push('/products');
    } catch (err) {
      console.error('Error adding product:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
        <Navbar/>
      <h1 className="text-3xl font-bold mb-4">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name">Product Name:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded-md p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="category">Category:</label>
          <input
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded-md p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded-md p-2 w-full"
            rows={4}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="price">Price:</label>
          <input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border rounded-md p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="discount">Discount:</label>
          <input
            id="discount"
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="border rounded-md p-2 w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
