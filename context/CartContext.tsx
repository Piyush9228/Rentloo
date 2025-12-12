
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Listing } from '../types';
import { useToast } from './ToastContext';

interface CartContextType {
  items: CartItem[];
  addToCart: (listing: Listing, days: number, startDate: Date) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    // Load from local storage if available
    const saved = localStorage.getItem('rentloo_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const { showToast } = useToast();

  useEffect(() => {
    localStorage.setItem('rentloo_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (listing: Listing, days: number, startDate: Date) => {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + days);
    const startIso = startDate.toISOString();
    const endIso = endDate.toISOString();

    // Check for duplicates
    const isDuplicate = items.some(
      item => item.listing.id === listing.id && 
              // Simple check: if dates overlap or are identical. 
              // For "Rent Now" usually exact match is the concern.
              item.startDate.split('T')[0] === startIso.split('T')[0]
    );

    if (isDuplicate) {
      // If it's already in the cart, we can optionally notify the user, 
      // but for "Rent Now" flow it's often better to just silently ensure presence 
      // or show a toast that it's already added.
      // We will simply return to avoid duplication.
      return; 
    }

    const newItem: CartItem = {
      id: Math.random().toString(36).substr(2, 9),
      listing,
      startDate: startIso,
      endDate: endIso,
      days,
      totalPrice: listing.pricePerDay * days
    };

    setItems(prev => [...prev, newItem]);
  };

  const removeFromCart = (cartItemId: string) => {
    setItems(prev => prev.filter(item => item.id !== cartItemId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const cartTotal = items.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, cartTotal, itemCount: items.length }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
