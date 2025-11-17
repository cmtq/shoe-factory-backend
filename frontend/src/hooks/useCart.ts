import { useState, useEffect } from 'react';
import type { CartItem, CustomizationOptions } from '../types';

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existingItemIndex = prev.findIndex(
        (i) =>
          i.product.id === item.product.id &&
          i.size === item.size &&
          JSON.stringify(i.customization) === JSON.stringify(item.customization)
      );

      if (existingItemIndex > -1) {
        const newCart = [...prev];
        newCart[existingItemIndex].quantity += item.quantity;
        return newCart;
      }

      return [...prev, item];
    });
  };

  const removeFromCart = (productId: number, size: number, customization?: CustomizationOptions) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.size === size &&
            JSON.stringify(item.customization) === JSON.stringify(customization)
          )
      )
    );
  };

  const updateQuantity = (
    productId: number,
    size: number,
    quantity: number,
    customization?: CustomizationOptions
  ) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId &&
        item.size === size &&
        JSON.stringify(item.customization) === JSON.stringify(customization)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product.discountPrice || item.product.price;
      return total + price * item.quantity;
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  };
};
