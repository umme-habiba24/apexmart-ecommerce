"use client";

import React from "react";
import Link from "next/link";
import {
  Headphones,
  Watch,
  ShoppingBag,
  Laptop,
  Coffee,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Category } from "@/types";

interface CategoryGridProps {
  categories: Category[];
}

const ICON_MAP: Record<string, any> = {
  Headphones,
  Watch,
  ShoppingBag,
  Laptop,
  Coffee,
  Sparkles,
};

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Browse By Category
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Curated Collections
          </h2>
        </div>
        <Link
          href="/products"
          className="text-xs sm:text-sm font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group"
        >
          <span>View All Collections</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((cat) => {
          const IconComponent = (cat.icon && ICON_MAP[cat.icon]) || ShoppingBag;
          return (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 flex flex-col p-3 shadow-lg hover:shadow-indigo-950/40"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-800 mb-3">
                <img
                  src={cat.image || "/images/placeholder.jpg"}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors" />
                <div className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700/60 flex items-center justify-center text-indigo-400">
                  <IconComponent className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors truncate">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {cat.itemCount || 0} Products
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
