"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, Product, Coupon } from "@/types";
import { useToast } from "./ToastContext";

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: Product, quantity?: number, options?: { color?: string; size?: string }) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  coupon: Coupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  totalItems: number;
  freeShippingThreshold: number;
  amountUntilFreeShipping: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 99;
const STANDARD_SHIPPING_RATE = 9.99;
const TAX_RATE = 0.08;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const { success, error, info } = useToast();

  useEffect(() => {
    try {
      const saved = localStorage.getItem("apex_cart");
      if (saved) {
        setCart(JSON.parse(saved));
      }
      const savedCoupon = localStorage.getItem("apex_coupon");
      if (savedCoupon) {
        setCoupon(JSON.parse(savedCoupon));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("apex_cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cart]);

  useEffect(() => {
    if (coupon) {
      localStorage.setItem("apex_coupon", JSON.stringify(coupon));
    } else {
      localStorage.removeItem("apex_coupon");
    }
  }, [coupon]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const addToCart = (
    product: Product,
    quantity = 1,
    options?: { color?: string; size?: string }
  ) => {
    const selectedColor = options?.color || product.colors?.[0] || "";
    const selectedSize = options?.size || product.sizes?.[0] || "";
    const cartItemId = `${product.id}_${selectedColor}_${selectedSize}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: newQty } : item
        );
      } else {
        const newItem: CartItem = {
          id: cartItemId,
          productId: product.id,
          slug: product.slug,
          name: product.name,
          price: parseFloat(product.price) || 0,
          compareAtPrice: product.compareAtPrice ? parseFloat(product.compareAtPrice) : undefined,
          quantity: Math.min(quantity, product.stock),
          image: product.images?.[0] || "",
          selectedColor,
          selectedSize,
          stock: product.stock,
        };
        return [...prev, newItem];
      }
    });

    success(`Added ${product.name} to your cart`, "Cart Updated");
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => {
      const item = prev.find((i) => i.id === cartItemId);
      if (item) {
        info(`Removed ${item.name} from cart`);
      }
      return prev.filter((i) => i.id !== cartItemId);
    });
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const clampedQty = Math.min(quantity, item.stock || 99);
          return { ...item, quantity: clampedQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setCoupon(null);
  };

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, message: "Please enter a valid coupon code." };
    }

    try {
      const res = await fetch(`/api/coupons?code=${cleanCode}`);
      const data = await res.json();

      if (!data.coupon) {
        error("Invalid promo code. Try SAVE15 or APEX20", "Coupon Failed");
        return { success: false, message: "Coupon code not found or expired." };
      }

      const found = data.coupon as Coupon;
      const minSpend = parseFloat(found.minSpend || "0");
      if (subtotal < minSpend) {
        error(`This coupon requires a minimum subtotal of $${minSpend}`, "Minimum Spend Required");
        return { success: false, message: `Minimum spend of $${minSpend} required.` };
      }

      setCoupon(found);
      success(`Coupon "${found.code}" applied! Discount added.`, "Coupon Applied");
      return { success: true, message: `Coupon applied: ${found.description}` };
    } catch {
      // Fallback local coupon check
      if (cleanCode === "SAVE15") {
        const c: Coupon = {
          id: 1,
          code: "SAVE15",
          description: "15% discount on your order",
          discountType: "percent",
          discountValue: "15.00",
          minSpend: "50.00",
        };
        setCoupon(c);
        success("Coupon SAVE15 applied! 15% off.", "Coupon Applied");
        return { success: true, message: "15% off applied!" };
      }
      if (cleanCode === "APEX20") {
        const c: Coupon = {
          id: 2,
          code: "APEX20",
          description: "20% VIP storewide discount",
          discountType: "percent",
          discountValue: "20.00",
          minSpend: "100.00",
        };
        setCoupon(c);
        success("Coupon APEX20 applied! 20% off.", "Coupon Applied");
        return { success: true, message: "20% off applied!" };
      }
      if (cleanCode === "FREESHIP") {
        const c: Coupon = {
          id: 4,
          code: "FREESHIP",
          description: "Free express shipping",
          discountType: "fixed",
          discountValue: "15.00",
        };
        setCoupon(c);
        success("Free Shipping coupon applied!", "Coupon Applied");
        return { success: true, message: "Free Shipping coupon applied!" };
      }
      error("Coupon not recognized. Try SAVE15 or APEX20", "Coupon Failed");
      return { success: false, message: "Coupon not recognized." };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    info("Coupon removed.");
  };

  // Computations
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  let discount = 0;
  if (coupon && subtotal > 0) {
    if (coupon.discountType === "percent") {
      const pct = parseFloat(coupon.discountValue) || 0;
      discount = (subtotal * pct) / 100;
      if (coupon.maxDiscount) {
        const max = parseFloat(coupon.maxDiscount);
        if (discount > max) discount = max;
      }
    } else if (coupon.discountType === "fixed") {
      discount = parseFloat(coupon.discountValue) || 0;
      if (discount > subtotal) discount = subtotal;
    }
  }

  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || coupon?.code === "FREESHIP";
  const shippingFee = subtotal === 0 ? 0 : isFreeShipping ? 0 : STANDARD_SHIPPING_RATE;
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = taxableAmount * TAX_RATE;
  const total = taxableAmount + shippingFee + tax;
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const amountUntilFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        coupon,
        applyCoupon,
        removeCoupon,
        subtotal,
        discount,
        shippingFee,
        tax,
        total,
        totalItems,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        amountUntilFreeShipping,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
