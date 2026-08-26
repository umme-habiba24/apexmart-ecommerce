"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CurrencyCode } from "@/types";

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (amountInUSD: number | string) => string;
  rates: Record<CurrencyCode, number>;
  symbols: Record<CurrencyCode, string>;
}

const RATES: Record<CurrencyCode, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  CAD: 1.36,
  INR: 83.5,
  JPY: 154.0,
};

const SYMBOLS: Record<CurrencyCode, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  CAD: "CA$",
  INR: "₹",
  JPY: "¥",
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("USD");

  useEffect(() => {
    const saved = localStorage.getItem("apex_currency") as CurrencyCode;
    if (saved && RATES[saved]) {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    localStorage.setItem("apex_currency", code);
  };

  const formatPrice = (amountInUSD: number | string): string => {
    const numeric = typeof amountInUSD === "string" ? parseFloat(amountInUSD) || 0 : amountInUSD;
    const rate = RATES[currency] || 1;
    const converted = numeric * rate;
    const symbol = SYMBOLS[currency] || "$";

    if (currency === "JPY") {
      return `${symbol}${Math.round(converted).toLocaleString()}`;
    }

    if (currency === "INR") {
      return `${symbol}${converted.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }

    return `${symbol}${converted.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        rates: RATES,
        symbols: SYMBOLS,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
