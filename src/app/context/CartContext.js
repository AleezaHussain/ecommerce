"use client";
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [uniqueItemsCount, setUniqueItemsCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [userId, setUserId] = useState(null);

  // Calculate cart metrics
  const calculateCartMetrics = (items) => {
    const uniqueCount = items.length;
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return { uniqueCount, total };
  };

  // Load user and cart on initial render
  useEffect(() => {
    const loadCart = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
  
        if (token && user?.id) {
          setUserId(user.id);
          await fetchUserCart(user.id);
        } else {
          // Instead of immediately loading guest cart here — we delay it
          console.warn("Guest mode detected but NOT loading guest cart immediately");
          setCart([]);  // 🛑 Empty cart if not logged in
        }
      } catch (error) {
        console.error("Failed to load cart:", error);
        setCart([]);  // 🛑 Empty cart if error
      } finally {
        setIsInitialized(true);
      }
    };
  
    loadCart();
  }, []);
  

  const loadGuestCart = () => {
    const savedCart = localStorage.getItem('pharmacy-guest-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
        updateCartMetrics(parsedCart);
      } catch (error) {
        console.error("Failed to parse guest cart", error);
      }
    }
  };
  
  const loadLocalCart = () => {
    const savedCart = localStorage.getItem('pharmacy-guest-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
        updateCartMetrics(parsedCart);
      } catch (error) {
        console.error("Failed to parse local cart", error);
      }
    }
  };

  const fetchUserCart = async (userId) => {
    try {
      const token = localStorage.getItem('token');
if (!token) {
  console.warn("No token available for fetching cart");
  throw new Error('No authentication token');  // Catch this properly
}

const response = await fetch('/api/cart', {
  headers: {
    Authorization: `Bearer ${token}`
  }
});

      
      if (!response.ok) throw new Error('Failed to fetch user cart');
      
      const { items } = await response.json();
      setCart(items || []);
      updateCartMetrics(items || []);
    } catch (error) {
      console.error("Error fetching user cart:", error);
      throw error;
    }
  };

  const saveUserCart = async (items) => {
    const token = localStorage.getItem('token');
    if (!token || !userId) {
      // If no token, fallback to localStorage (guest user)
      console.log("Saving cart locally for guest user");
      localStorage.setItem('pharmacy-guest-cart', JSON.stringify(items));
      return { success: true };
    }
  
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ items })
      });
  
      const text = await response.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        console.error('Failed to parse JSON:', text);
        throw new Error('Invalid server response');
      }
  
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save cart');
      }
  
      return data;
    } catch (error) {
      console.error("Cart save error:", error);
      throw error;
    }
  };

  
  
  const updateCartMetrics = (items) => {
    const { uniqueCount, total } = calculateCartMetrics(items);
    setUniqueItemsCount(uniqueCount);
    setTotalPrice(total);
  };

  // Save cart when it changes
  useEffect(() => {
    if (!isInitialized) return;
    
    if (userId) {
      saveUserCart(cart).catch(console.error);
    } else {
      localStorage.setItem('pharmacy-guest-cart', JSON.stringify(cart));
    }
    
    updateCartMetrics(cart);
  }, [cart, userId]);

  const addToCart = (item) => {
    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(
        cartItem => cartItem.medicine_id === item.medicine_id
      );
      
      let newCart;
      if (existingIndex >= 0) {
        newCart = [...prevCart];
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: newCart[existingIndex].quantity + item.quantity
        };
      } else {
        newCart = [...prevCart, item];
      }
      
      return newCart;
    });
  };

  const removeFromCart = (medicineId) => {
    setCart(prevCart => prevCart.filter(item => item.medicine_id !== medicineId));
  };

  const updateCartItem = (medicineId, updates) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.medicine_id === medicineId ? { ...item, ...updates } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Merge guest cart with user cart after login
  // In your CartContext.js
const mergeCarts = async (userId, guestCart) => {
  try {
    // Fetch user's existing cart
    const response = await fetch('/api/cart', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    let userCart = [];
    if (response.ok) {
      const data = await response.json();
      userCart = data.items || [];
    }

    // Merge carts
    const mergedCart = [...userCart];
    
    guestCart.forEach(guestItem => {
      const existingItem = mergedCart.find(
        item => item.medicine_id === guestItem.medicine_id
      );
      
      if (existingItem) {
        existingItem.quantity += guestItem.quantity;
      } else {
        mergedCart.push(guestItem);
      }
    });
    
    // Save merged cart
    await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ items: mergedCart })
    });
    
    // Update local state
    setCart(mergedCart);
    updateCartMetrics(mergedCart);
    
    return mergedCart;
  } catch (error) {
    console.error('Error merging carts:', error);
    throw error;
  }
};
  return (
    <CartContext.Provider
  value={{
    cart,
    cartCount: uniqueItemsCount,
    uniqueItemsCount,
    totalPrice,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    mergeCarts,
    loadGuestCart  // 👈 add this
  }}
>

      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}