// app/layout.js
"use client";  // 👈 ADD THIS at the top
import './globals.css';
import ClientProviders from './ClientProviders';
import { CartProvider } from './context/CartContext';
import RouteLoader from './components/RouteLoader';
import Loading from './components/loading';
import { Inter } from 'next/font/google';
import React, { useState, useEffect } from "react";  // 👈 Also import React hooks
import AOS from 'aos';
import 'aos/dist/aos.css';
const inter = Inter({ subsets: ['latin'] });

const metadata = {
  title: 'PharmaGuard 24/7',
  description: 'Your trusted online pharmacy',
};

export default function RootLayout({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <ClientProviders>

          <RouteLoader />   {/* 👈 show this globally */}

          {loading ? <Loading /> : children}
          </ClientProviders>

        </CartProvider>
      </body>
    </html>
  );
}