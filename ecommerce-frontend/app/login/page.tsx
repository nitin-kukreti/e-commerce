/* eslint-disable react/no-unescaped-entities */
// app/login/page.tsx

"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { isAuthenticated } from '@/utils/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/products'); // Redirect to products if already logged in
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('api/auth/login', { email, password });
      const token = response.data.token;
      localStorage.setItem('authToken', token);

      // Decode the token to get the user role
      const decodedToken: any = jwtDecode(token);
      localStorage.setItem('userRole', decodedToken.role);

      if (response.status === 200) {
        // Redirect to products page on successful login
        router.push('/products');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || 'Login failed');
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Login</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label className="block">
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border p-2 w-full mt-1"
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block">
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border p-2 w-full mt-1"
            />
          </label>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="bg-blue-500 text-white p-2 mt-4">
          Login
        </button>
      </form>
      <div className="mt-4">
        <p>Don't have an account?</p>
        <a href="/register" className="text-blue-500 hover:underline">
          Register here
        </a>
      </div>
    </div>
  );
};

export default Login;
