"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import NavBar from '@/component/Nav';

const EditProduct = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const router = useRouter();
  const { productId } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/products/${productId}`);
        setName(response.data[0].name);
        setCategory(response.data[0].category);
        setDescription(response.data[0].description);
        setPrice(response.data[0].price);
        setDiscount(response.data[0].discount);
      } catch (err) {
        console.error('Error fetching product:', err);
      }
    };

    const checkUserRole = () => {
      const userRole = localStorage.getItem('userRole');
      if (!userRole) {
        router.push('/login');
        return;
      }
      if (userRole !== 'seller') {
        router.push('/products');
        return null;
      }

    };

    fetchProduct();
    checkUserRole();
  }, [productId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      await axios.put(`/api/products/edit/${productId}`, {
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
      console.error('Error editing product:', err);
    }
  };

 

  return (
    <div className="max-w-4xl mx-auto p-4">
        <NavBar/>
      <h1 className="text-3xl font-bold mb-4">Edit Product</h1>
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
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
