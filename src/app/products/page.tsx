"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductFilters } from "@/components/products/ProductFilters";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { InternshipTourModal } from "@/components/layout/InternshipTourModal";
import { Product, Category } from "@/types";
import {
  LayoutGrid,
  List,
  SlidersHorizontal,
  X,
  Search,
  Sparkles,
  Package,
} from "lucide-react";

function ProductsContent() {
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tourOpen, setTourOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter states
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get("brand") || "all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "featured");
  const [isFeatured, setIsFeatured] = useState(searchParams.get("featured") === "true");

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (data.categories) setCategories(data.categories);
      } catch (e) {
        console.error(e);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    // Sync search from URL if changed
    const urlSearch = searchParams.get("search");
    if (urlSearch !== null) setSearch(urlSearch);

    const urlCat = searchParams.get("category");
    if (urlCat !== null) setSelectedCategory(urlCat);

    const urlFeat = searchParams.get("featured");
    if (urlFeat !== null) setIsFeatured(urlFeat === "true");
  }, [searchParams]);

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (selectedCategory && selectedCategory !== "all") params.set("category", selectedCategory);
        if (selectedBrand && selectedBrand !== "all") params.set("brand", selectedBrand);
        if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString());
        if (priceRange[1] < 500) params.set("maxPrice", priceRange[1].toString());
        if (inStockOnly) params.set("inStock", "true");
        if (isFeatured) params.set("featured", "true");
        if (sortBy) params.set("sort", sortBy);

        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();
        setProducts(data.products || []);
        if (data.brands) setBrands(data.brands);
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, [search, selectedCategory, selectedBrand, priceRange, inStockOnly, isFeatured, sortBy]);

  const hasActiveFilters =
    Boolean(search) ||
    selectedCategory !== "all" ||
    selectedBrand !== "all" ||
    priceRange[0] > 0 ||
    priceRange[1] < 500 ||
    inStockOnly ||
    isFeatured;

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedBrand("all");
    setPriceRange([0, 500]);
    setInStockOnly(false);
    setIsFeatured(false);
    setSortBy("featured");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header onOpenTour={() => setTourOpen(true)} />
      <CartDrawer />
      <InternshipTourModal isOpen={tourOpen} onClose={() => setTourOpen(false)} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Store Catalog</span>
              {isFeatured && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Featured Only
                </span>
              )}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Showing {products.length} products available for immediate dispatch
            </p>
          </div>

          {/* View Mode & Mobile Filter Trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-white"
            >
              <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
              <span>Filters</span>
            </button>

            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "grid" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === "list" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium mr-1">Active Filters:</span>

            {search && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-indigo-300">
                <span>Keyword: "{search}"</span>
                <button onClick={() => setSearch("")} className="hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedCategory !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-indigo-300">
                <span>Category: {selectedCategory}</span>
                <button onClick={() => setSelectedCategory("all")} className="hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedBrand !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-indigo-300">
                <span>Brand: {selectedBrand}</span>
                <button onClick={() => setSelectedBrand("all")} className="hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {(priceRange[0] > 0 || priceRange[1] < 500) && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-indigo-300">
                <span>Price: ${priceRange[0]} - ${priceRange[1]}</span>
                <button onClick={() => setPriceRange([0, 500])} className="hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {inStockOnly && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
                <span>In Stock Only</span>
                <button onClick={() => setInStockOnly(false)} className="hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {isFeatured && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-950/60 border border-amber-500/30 text-amber-300">
                <span>Featured Only</span>
                <button onClick={() => setIsFeatured(false)} className="hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={handleResetFilters}
              className="text-rose-400 hover:underline font-semibold ml-2"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Layout with Sidebar and Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <ProductFilters
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              selectedBrand={selectedBrand}
              onSelectBrand={setSelectedBrand}
              brands={brands}
              inStockOnly={inStockOnly}
              onToggleInStock={setInStockOnly}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onResetFilters={handleResetFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>

          {/* Mobile Filter Drawer */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 p-4 bg-slate-950/80 backdrop-blur-md lg:hidden flex justify-end">
              <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 overflow-y-auto space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="font-bold text-base text-white">Filters</h3>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <ProductFilters
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={(cat) => {
                    setSelectedCategory(cat);
                    setMobileFilterOpen(false);
                  }}
                  priceRange={priceRange}
                  onPriceChange={setPriceRange}
                  selectedBrand={selectedBrand}
                  onSelectBrand={(b) => {
                    setSelectedBrand(b);
                    setMobileFilterOpen(false);
                  }}
                  brands={brands}
                  inStockOnly={inStockOnly}
                  onToggleInStock={setInStockOnly}
                  sortBy={sortBy}
                  onSortChange={(s) => {
                    setSortBy(s);
                    setMobileFilterOpen(false);
                  }}
                  onResetFilters={handleResetFilters}
                  hasActiveFilters={hasActiveFilters}
                />
              </div>
            </div>
          )}

          {/* Product Items Column */}
          <div className="lg:col-span-3 space-y-6">
            {isLoading ? (
              <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                {[...Array(6)].map((_, i) => (
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
            ) : products.length === 0 ? (
              <div className="py-20 text-center rounded-3xl bg-slate-900/40 border border-slate-800 p-8 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-slate-500">
                  <Package className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">No products found</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                    We couldn't find any products matching your current filter criteria.
                  </p>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} viewMode={viewMode} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading Catalog...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
