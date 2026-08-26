"use client";

import React from "react";
import { ToastProvider } from "./ToastContext";
import { AuthProvider } from "./AuthContext";
import { CurrencyProvider } from "./CurrencyContext";
import { CartProvider } from "./CartContext";
import { WishlistProvider } from "./WishlistContext";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <CurrencyProvider>
          <CartProvider>
            <WishlistProvider>
              {children}
            </WishlistProvider>
          </CartProvider>
        </CurrencyProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
