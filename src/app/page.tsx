"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroBanner } from "@/components/home/HeroBanner";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FlashDealsSection } from "@/components/home/FlashDealsSection";
import { ProductCard } from "@/components/products/ProductCard";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { InternshipTourModal } from "@/components/layout/InternshipTourModal";
import { Product, Category } from "@/types";
import {
  Sparkles,
  Zap,
  TrendingUp,
  Award,
  Star,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<"featured" | "trending" | "new">("featured");
  const [isLoading, setIsLoading] = useState(true);
  const [tourOpen, setTourOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch("/api/products?limit=20"),
          fetch("/api/categories"),
        ]);
        const prodData = await prodRes.json();
        const catData = await catRes.json();

        if (prodData.products) setProducts(prodData.products);
        if (catData.categories) setCategories(catData.categories);
      } catch (err) {
        console.error("Failed to load initial storefront data", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const featuredProducts = products.filter((p) => p.isFeatured);
  const trendingProducts = products.filter((p) => p.isTrending);
  const newArrivals = products.filter((p) => p.isNewArrival);

  const displayedProducts =
    activeTab === "featured"
      ? featuredProducts.length > 0 ? featuredProducts : products.slice(0, 8)
      : activeTab === "trending"
      ? trendingProducts.length > 0 ? trendingProducts : products.slice(0, 8)
      : newArrivals.length > 0 ? newArrivals : products.slice(0, 8);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <Header onOpenTour={() => setTourOpen(true)} />
      <CartDrawer />
      <InternshipTourModal isOpen={tourOpen} onClose={() => setTourOpen(false)} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-16">
        {/* Hero Section */}
        <HeroBanner />

        {/* Curated Categories */}
        {categories.length > 0 && <CategoryGrid categories={categories} />}

        {/* Flash Deals with Live Countdown */}
        {products.length > 0 && <FlashDealsSection products={products} />}

        {/* Tabbed Product Discovery Showcase */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Premium Selection
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                Explore The Collection
              </h2>
            </div>

            {/* Tab switchers */}
            <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 self-start sm:self-auto">
              <button
                onClick={() => setActiveTab("featured")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "featured"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Featured</span>
              </button>

              <button
                onClick={() => setActiveTab("trending")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "trending"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Trending</span>
              </button>

              <button
                onClick={() => setActiveTab("new")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "new"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>New Arrivals</span>
              </button>
            </div>
          </div>

          {/* Grid of items */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-slate-900 border border-slate-800 p-4 space-y-3 animate-pulse"
                >
                  <div className="aspect-square rounded-xl bg-slate-800" />
                  <div className="h-4 bg-slate-800 rounded w-3/4" />
                  <div className="h-4 bg-slate-800 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center pt-6">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-white font-bold text-xs transition-all shadow-lg hover:border-indigo-500/50"
            >
              <span>View All {products.length} Products in Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Promotional Banner Callout */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 border border-indigo-500/30 p-8 sm:p-12 shadow-2xl">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" /> Exclusive Member Perks
            </span>
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Upgrade Your Everyday Carry & Workspace.
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed">
              Join thousands of professionals, audiophiles, and tastemakers who trust ApexMart for certified precision hardware and artisanal craftsmanship.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/products"
                className="px-6 py-3 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-100 transition-all shadow-lg"
              >
                Shop Current Offers
              </Link>
              <button
                onClick={() => setTourOpen(true)}
                className="px-6 py-3 rounded-xl bg-slate-950/60 hover:bg-slate-950 text-white border border-slate-700 font-semibold text-xs transition-colors"
              >
                View Project Architecture
              </button>
            </div>
          </div>
        </section>

        {/* Verified Customer Reviews Section */}
        <section className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Real Customer Stories
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Trusted by 10,000+ Audiophiles & Creators
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <h4 className="font-bold text-white text-base leading-snug">
                "The Apex ANC Pro headphones beat every pair I own."
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                The acoustic clarity on lossless audio tracks is unreal. Memory foam ear cushions are ultra-soft even with glasses. Noise cancellation wipes out city traffic completely.
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
                <div className="w-9 h-9 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-xs font-bold text-indigo-300">
                  AW
                </div>
                <div>
                  <h5 className="font-bold text-xs text-white">Alexander Wright</h5>
                  <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Verified Buyer • Apex ANC Pro
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <h4 className="font-bold text-white text-base leading-snug">
                "Chronos Ultra titanium watch is a masterpiece."
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                The sapphire glass has zero scratches after weeks of mountain trail running. The battery lasts an honest 14 days without charging. Highly recommend!
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
                <div className="w-9 h-9 rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-xs font-bold text-purple-300">
                  MC
                </div>
                <div>
                  <h5 className="font-bold text-xs text-white">Marcus Chen</h5>
                  <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Verified Buyer • Chronos Watch
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <h4 className="font-bold text-white text-base leading-snug">
                "Super fast 2-day delivery and flawless packaging."
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                The leather duffle bag aroma when opening the box was heavenly. Full-grain calfskin with heavy solid brass zippers. Fits my MacBook Pro effortlessly.
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
                <div className="w-9 h-9 rounded-full bg-pink-600/30 border border-pink-500/40 flex items-center justify-center text-xs font-bold text-pink-300">
                  SL
                </div>
                <div>
                  <h5 className="font-bold text-xs text-white">Sophia Lorenzi</h5>
                  <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Verified Buyer • Leather Duffle
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
