// src/context/CartContext.js

import React, { createContext, useContext, useReducer } from 'react';

// --- 1. Define the Reducer Function ---
// The reducer handles all the logic for changing the cart state
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const item = action.payload;
      const existingItem = state.cartItems.find((i) => i.id === item.id);

      if (existingItem) {
        // If item already in cart, just increase quantity
        return {
          ...state,
          cartItems: state.cartItems.map((i) =>
            i.id === item.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      } else {
        // If new item, add it to the cart with quantity 1
        return {
          ...state,
          cartItems: [...state.cartItems, { ...item, qty: 1 }],
        };
      }
    }

    case 'REMOVE_FROM_CART': {
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (i) => i.id !== action.payload.id
        ),
      };
    }

    case 'INCREASE_QTY': {
      return {
        ...state,
        cartItems: state.cartItems.map((i) =>
          i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i
        ),
      };
    }

    case 'DECREASE_QTY': {
      const item = state.cartItems.find((i) => i.id === action.payload.id);
      // If quantity is 1, decrease will remove the item
      if (item.qty === 1) {
        return {
          ...state,
          cartItems: state.cartItems.filter(
            (i) => i.id !== action.payload.id
          ),
        };
      } else {
        // Otherwise, just decrease quantity
        return {
          ...state,
          cartItems: state.cartItems.map((i) =>
            i.id === action.payload.id ? { ...i, qty: i.qty - 1 } : i
          ),
        };
      }
    }

    default:
      return state;
  }
};

// --- 2. Create The Context ---
const CartContext = createContext();

// --- 3. Create the Provider Component ---
// This component will wrap your entire app
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    cartItems: [], // Initial state is an empty cart
  });

  // Helper functions that pages can call
  const addToCart = (item) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
  };

  const removeFromCart = (id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { id } });
  };

  const increaseQty = (id) => {
    dispatch({ type: 'INCREASE_QTY', payload: { id } });
  };

  const decreaseQty = (id) => {
    dispatch({ type: 'DECREASE_QTY', payload: { id } });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems: state.cartItems,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// --- 4. Create a custom hook for easy access ---
// This lets pages get the cart data with one line
export const useCart = () => {
  return useContext(CartContext);
};