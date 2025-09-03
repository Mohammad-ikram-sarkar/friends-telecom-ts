"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  image?: string;
};

type CheckoutState = {
  items: CartItem[];
};

type CheckoutContextType = {
  checkoutState: CheckoutState;
  setCheckoutState: React.Dispatch<React.SetStateAction<CheckoutState>>;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCheckout: () => void;
};

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [checkoutState, setCheckoutState] = useState<CheckoutState>({ items: [] });

  // ✅ Add item (merge if exists, else add new)
    const addItem = (item: CartItem) => {
    setCheckoutState((prev) => {
      const existing = prev.items.find((i) => i.id === item.id);
      if (existing) {
        return {
          items: prev.items.map((i) =>
            i.id === item.id ? { ...i, quantity: (i.quantity || 1) + (item.quantity || 1) } : i
          ),
        };
      }
      return { items: [...prev.items, { ...item, quantity: item.quantity || 1 }] };
    });
  };

  // ✅ Remove item
  const removeItem = (id: string) => {
    setCheckoutState((prev) => ({
      items: prev.items.filter((i) => i.id !== id),
    }));
  };
// inside CheckoutProvider
React.useEffect(() => {
  console.log("Checkout state updated:", checkoutState);
}, [checkoutState]);

  const clearCheckout = () => {
    setCheckoutState({ items: [] });
  };

  return (
    <CheckoutContext.Provider value={{ checkoutState, setCheckoutState, addItem, removeItem, clearCheckout }}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (!context) throw new Error("useCheckout must be used inside CheckoutProvider");
  return context;
}
