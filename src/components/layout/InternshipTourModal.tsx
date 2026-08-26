"use client";

import React, { useState } from "react";
import {
  X,
  Sparkles,
  Database,
  Layers,
  Code2,
  CheckCircle2,
  Package,
  ShoppingCart,
  TrendingUp,
  Tag,
  RefreshCw,
  Terminal,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";

interface InternshipTourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InternshipTourModal({ isOpen, onClose }: InternshipTourModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "architecture" | "database" | "demo">("overview");
  const [isResetting, setIsResetting] = useState(false);
  const { loginAs, user } = useAuth();
  const { addToCart, openCart } = useCart();
  const { success, error } = useToast();
  const router = useRouter();

  if (!isOpen) return null;

  const handleResetDb = async () => {
    setIsResetting(true);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        success("Database reset with fresh sample products, orders, and reviews!", "Database Seeded");
        setTimeout(() => {
          window.location.reload();
        }, 800);
      }
    } catch {
      error("Failed to reset database", "Error");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Internship Project Showcase & Architecture
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  ApexMart E-Commerce
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Fullstack Next.js (App Router), PostgreSQL, Drizzle ORM & Tailwind CSS
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-900/50">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "overview"
                ? "border-indigo-500 text-indigo-400 bg-indigo-500/10"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Project Overview
          </button>
          <button
            onClick={() => setActiveTab("architecture")}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "architecture"
                ? "border-indigo-500 text-indigo-400 bg-indigo-500/10"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Tech Stack & Architecture
          </button>
          <button
            onClick={() => setActiveTab("database")}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "database"
                ? "border-indigo-500 text-indigo-400 bg-indigo-500/10"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Database className="w-3.5 h-3.5" /> Database ERD & Schema
          </button>
          <button
            onClick={() => setActiveTab("demo")}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "demo"
                ? "border-indigo-500 text-indigo-400 bg-indigo-500/10"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-amber-400" /> Interactive Demo Shortcuts
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          {activeTab === "overview" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20">
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                  Key Engineering Highlights
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span><strong>Dynamic Catalog:</strong> Real-time category filtering, price range slider, brand picking, star ratings & search debounce.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span><strong>Cart & Promo Engine:</strong> Sliding drawer, Free Shipping bar ($99 threshold), promo codes (<code>SAVE15</code>, <code>APEX20</code>).</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span><strong>Full Checkout Flow:</strong> Express shipping selector, live card preview, inventory deduction on purchase, and confetti celebration.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span><strong>Order Tracking:</strong> Visual 5-stage shipment timeline, courier tracking numbers, and printable invoices.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                    <span><strong>Admin Analytics Portal:</strong> Revenue charts (Recharts), low-stock badges, order status updater, and product catalog management.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                    <span><strong>Multi-Currency Engine:</strong> Live pricing conversions for USD, EUR, GBP, CAD, INR, and JPY.</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                  <Package className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                  <h5 className="font-bold text-white text-base">12+ Products</h5>
                  <p className="text-xs text-slate-400">Across 6 lifestyle categories</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                  <ShoppingCart className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                  <h5 className="font-bold text-white text-base">100% End-to-End</h5>
                  <p className="text-xs text-slate-400">Cart, Checkout, & Tracking</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                  <TrendingUp className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <h5 className="font-bold text-white text-base">Live Admin</h5>
                  <p className="text-xs text-slate-400">Real-time revenue metrics</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "architecture" && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
                <h4 className="font-bold text-white text-sm">System Architecture & Design Patterns</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <h5 className="font-semibold text-indigo-300">Frontend Layer</h5>
                    <ul className="space-y-1 text-slate-400">
                      <li>• Next.js 16 App Router with Server & Client components</li>
                      <li>• React 19 Context Providers (Cart, Wishlist, Currency, Auth)</li>
                      <li>• Tailwind CSS v4 design system with dark luxury theme</li>
                      <li>• Lucide icons & Recharts analytical charting</li>
                    </ul>
                  </div>

                  <div className="space-y-1.5">
                    <h5 className="font-semibold text-emerald-300">Backend & API Layer</h5>
                    <ul className="space-y-1 text-slate-400">
                      <li>• RESTful API endpoints (/api/products, /api/orders, /api/coupons)</li>
                      <li>• Multi-criteria SQL search & filtering with Drizzle ORM</li>
                      <li>• Atomic inventory deduction during order creation</li>
                      <li>• Dynamic product review rating recalculation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "database" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <div className="font-bold text-indigo-300 mb-1 flex items-center justify-between">
                    <span>products table</span>
                    <span className="text-[10px] text-slate-400">Drizzle pgTable</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    <code>id, name, slug, description, price, compareAtPrice, costPrice, stock, categorySlug, brand, rating, reviewCount, images (jsonb), specs (jsonb), colors (jsonb), sizes (jsonb)</code>
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <div className="font-bold text-emerald-300 mb-1 flex items-center justify-between">
                    <span>orders table</span>
                    <span className="text-[10px] text-slate-400">Drizzle pgTable</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    <code>id, orderNumber, userId, customerName, customerEmail, shippingAddress (jsonb), items (jsonb), subtotal, discount, shippingFee, tax, total, paymentMethod, orderStatus, trackingNumber</code>
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <div className="font-bold text-amber-300 mb-1 flex items-center justify-between">
                    <span>reviews table</span>
                    <span className="text-[10px] text-slate-400">Drizzle pgTable</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    <code>id, productId, userId, userName, userAvatar, rating, title, comment, verifiedPurchase, helpfulCount</code>
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  <div className="font-bold text-purple-300 mb-1 flex items-center justify-between">
                    <span>coupons table</span>
                    <span className="text-[10px] text-slate-400">Drizzle pgTable</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    <code>id, code, description, discountType, discountValue, minSpend, maxDiscount, timesUsed, isActive</code>
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "demo" && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Use these 1-click shortcuts to quickly evaluate and demo various user journeys during your presentation or evaluation.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    loginAs("admin");
                    onClose();
                    router.push("/admin");
                    success("Logged in as Store Admin Sarah Sterling", "Admin Mode");
                  }}
                  className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 hover:border-purple-400 text-left transition-all group"
                >
                  <div className="font-bold text-purple-300 text-sm flex items-center justify-between">
                    <span>Switch to Admin Panel</span>
                    <ExternalLink className="w-4 h-4 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Inspect revenue charts, modify product stocks, and manage order statuses.
                  </p>
                </button>

                <button
                  onClick={() => {
                    loginAs("customer");
                    onClose();
                    router.push("/track-order");
                    success("Viewing customer order tracker", "Order Tracking");
                  }}
                  className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 hover:border-emerald-400 text-left transition-all group"
                >
                  <div className="font-bold text-emerald-300 text-sm flex items-center justify-between">
                    <span>Track Sample Order (APX-89210)</span>
                    <ExternalLink className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    View 5-stage shipment timeline, courier route, and printable invoice receipt.
                  </p>
                </button>

                <button
                  onClick={() => {
                    loginAs("customer");
                    onClose();
                    router.push("/checkout");
                  }}
                  className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 hover:border-indigo-400 text-left transition-all group"
                >
                  <div className="font-bold text-indigo-300 text-sm flex items-center justify-between">
                    <span>Test Checkout Page</span>
                    <ExternalLink className="w-4 h-4 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Simulate card payment, apply coupon SAVE15, and view confetti celebration.
                  </p>
                </button>

                <button
                  onClick={handleResetDb}
                  disabled={isResetting}
                  className="p-4 rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-500 text-left transition-all group"
                >
                  <div className="font-bold text-amber-300 text-sm flex items-center justify-between">
                    <span>{isResetting ? "Resetting Database..." : "Reset Database & Seed Fresh Data"}</span>
                    <RefreshCw className={`w-4 h-4 text-amber-400 ${isResetting ? "animate-spin" : ""}`} />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Restores all 12 products, test reviews, orders, and active coupons.
                  </p>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Currently logged in:</span>
            <strong className="text-white capitalize">{user?.name || "Guest"} ({user?.role || "Customer"})</strong>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-md shadow-indigo-600/30"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
