"use client";

import React from "react";
import { SlidersHorizontal, RotateCcw, Star, Check } from "lucide-react";
import { Category } from "@/types";

interface ProductFiltersProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  selectedBrand: string;
  onSelectBrand: (brand: string) => void;
  brands: string[];
  inStockOnly: boolean;
  onToggleInStock: (val: boolean) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export function ProductFilters({
  categories,
  selectedCategory,
  onSelectCategory,
  priceRange,
  onPriceChange,
  selectedBrand,
  onSelectBrand,
  brands,
  inStockOnly,
  onToggleInStock,
  sortBy,
  onSortChange,
  onResetFilters,
  hasActiveFilters,
}: ProductFiltersProps) {
  return (
    <div className="space-y-6 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-white">
      {/* Header with Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 font-bold text-sm text-white">
          <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
          <span>Filters</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-medium transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset All
          </button>
        )}
      </div>

      {/* Sort By Dropdown (mobile/sidebar) */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
        >
          <option value="featured">Featured & Best Selling</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Highest Customer Rating</option>
          <option value="newest">Newest Arrivals</option>
        </select>
      </div>

      {/* Categories */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Categories
        </label>
        <div className="space-y-1">
          <button
            onClick={() => onSelectCategory("all")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              selectedCategory === "all" || !selectedCategory
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <span>All Categories</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                selectedCategory === cat.slug
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span>{cat.name}</span>
              <span className="text-[10px] opacity-70">({cat.itemCount || 0})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="space-y-3 pt-3 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Price Range
          </label>
          <span className="text-xs font-mono font-bold text-emerald-400">
            ${priceRange[0]} - ${priceRange[1]}
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="500"
          step="10"
          value={priceRange[1]}
          onChange={(e) => onPriceChange([priceRange[0], parseInt(e.target.value, 10)])}
          className="w-full accent-indigo-500 bg-slate-800 cursor-pointer h-2 rounded-lg"
        />

        <div className="flex items-center gap-2">
          <div className="flex-1 bg-slate-800 rounded-xl px-2.5 py-1.5 border border-slate-700 flex items-center text-xs">
            <span className="text-slate-400 mr-1">$</span>
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => onPriceChange([Math.max(0, parseInt(e.target.value) || 0), priceRange[1]])}
              className="w-full bg-transparent text-white focus:outline-none"
            />
          </div>
          <span className="text-slate-500 text-xs">to</span>
          <div className="flex-1 bg-slate-800 rounded-xl px-2.5 py-1.5 border border-slate-700 flex items-center text-xs">
            <span className="text-slate-400 mr-1">$</span>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => onPriceChange([priceRange[0], Math.max(0, parseInt(e.target.value) || 500)])}
              className="w-full bg-transparent text-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div className="space-y-2.5 pt-3 border-t border-slate-800">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Brands
          </label>
          <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
            <button
              onClick={() => onSelectBrand("all")}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium ${
                selectedBrand === "all" || !selectedBrand
                  ? "bg-slate-800 text-indigo-400 font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>All Brands</span>
            </button>
            {brands.map((b) => (
              <button
                key={b}
                onClick={() => onSelectBrand(b)}
                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium ${
                  selectedBrand === b
                    ? "bg-slate-800 text-indigo-400 font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span>{b}</span>
                {selectedBrand === b && <Check className="w-3.5 h-3.5 text-indigo-400" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* In Stock Only Toggle */}
      <div className="pt-3 border-t border-slate-800">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-xs font-semibold text-slate-300">In Stock Items Only</span>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onToggleInStock(e.target.checked)}
            className="w-4 h-4 rounded text-indigo-600 bg-slate-800 border-slate-700 focus:ring-indigo-500"
          />
        </label>
      </div>
    </div>
  );
}
