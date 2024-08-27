// app/page.tsx
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      router.push('/products');

    } else {
      router.push('/login');

    }
  }, [router]);


  return null;
};

export default Home;
