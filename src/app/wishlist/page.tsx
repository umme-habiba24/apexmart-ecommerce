"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { InternshipTourModal } from "@/components/layout/InternshipTourModal";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { ProductCard } from "@/components/products/ProductCard";
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function WishlistPage() {
  const { wishlist, clearWishlist, removeFromWishlist } = useWishlist();
  const { addToCart, openCart } = useCart();
  const { formatPrice } = useCurrency();
  const [tourOpen, setTourOpen] = useState(false);

  const handleMoveAllToCart = () => {
    wishlist.forEach((item) => {
      addToCart(item, 1);
    });
    openCart();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header onOpenTour={() => setTourOpen(true)} />
      <CartDrawer />
      <InternshipTourModal isOpen={tourOpen} onClose={() => setTourOpen(false)} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-200 font-medium">My Wishlist</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <Heart className="w-7 h-7 text-rose-500 fill-rose-500" />
              <span>Saved Items & Wishlist</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              You have {wishlist.length} {wishlist.length === 1 ? "product" : "products"} saved in your wishlist
            </p>
          </div>

          {wishlist.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={clearWishlist}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-rose-400 border border-slate-800 text-xs font-semibold transition-colors"
              >
                Clear Wishlist
              </button>

              <button
                onClick={handleMoveAllToCart}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Move All to Bag</span>
              </button>
            </div>
          )}
        </div>

        {/* Wishlist Grid */}
        {wishlist.length === 0 ? (
          <div className="py-20 text-center rounded-3xl bg-slate-900/60 border border-slate-800 p-8 space-y-4 max-w-md mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-rose-400/80 shadow-inner">
              <Heart className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Your Wishlist is Empty</h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Save items you love by tapping the heart icon on any product in our store.
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
