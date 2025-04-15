// app/layout.js
import './globals.css';
import { Inter } from 'next/font/google';
import ClientProviders from './ClientProviders';
import { CartProvider } from './context/CartContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'PharmaGuard 24/7',
  description: 'Your trusted online pharmacy',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <ClientProviders>
            {children}
          </ClientProviders>
        </CartProvider>
      </body>
    </html>
  );
}