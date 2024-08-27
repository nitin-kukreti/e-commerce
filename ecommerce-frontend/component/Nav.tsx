"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const [role, setRole] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    setRole(userRole || '');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    router.push('/login');
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-900 text-white shadow-md rounded-lg mb-8">
      <div className="flex items-center space-x-6">
        <h1 className="text-2xl font-semibold">E-com</h1>
      </div>
      <div className="flex space-x-6">
        <button
          className="bg-blue-600 px-6 py-2 rounded-md hover:bg-blue-700 transition"
          onClick={() => router.push('/products')}
        >
          Products
        </button>
        {role === 'seller' && (
          <button
            className="bg-green-600 px-6 py-2 rounded-md hover:bg-green-700 transition"
            onClick={() => router.push('/add-product')}
          >
            Add Product
          </button>
        )}
        {role === 'buyer' && (
          <button
            className="bg-green-600 px-6 py-2 rounded-md hover:bg-green-700 transition"
            onClick={() => router.push('/cart')}
          >
            Cart
          </button>
        )}
        <button
          className="bg-red-600 px-6 py-2 rounded-md hover:bg-red-700 transition"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
