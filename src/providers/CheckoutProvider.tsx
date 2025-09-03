"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Type for cart items
type CartItem = {
  id: number;
  name: string;
  price: number;
};

// Checkout state type
type CheckoutState = {
  name?: string;
  image?: string;
  items?: CartItem[];

};

// Context type
type CheckoutContextType = {
  checkoutState: CheckoutState;
  setCheckoutState: React.Dispatch<React.SetStateAction<CheckoutState>>;
};

// Create context
const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

// Provider component
export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [checkoutState, setCheckoutState] = useState<CheckoutState>({ items: [] });
  console.log("Checkout State:", checkoutState);

  return (
    <CheckoutContext.Provider value={{ checkoutState, setCheckoutState }}>
      {children}
    </CheckoutContext.Provider>
  );
}

// Custom hook
export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (!context) throw new Error("useCheckout must be used inside CheckoutProvider");
  return context;
}
