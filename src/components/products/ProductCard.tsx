"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Heart,
  Eye,
  ShoppingBag,
  Star,
  Check,
  Sparkles,
  Zap,
} from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCurrency } from "@/context/CurrencyContext";
import { QuickViewModal } from "./QuickViewModal";

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
}

export function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { formatPrice } = useCurrency();

  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const isWishlisted = isInWishlist(product.id);

  const priceNum = parseFloat(product.price) || 0;
  const compareAtNum = product.compareAtPrice ? parseFloat(product.compareAtPrice) : 0;
  const discountPercent = compareAtNum > priceNum ? Math.round(((compareAtNum - priceNum) / compareAtNum) * 100) : 0;

  if (viewMode === "list") {
    return (
      <>
        <div className="flex flex-col sm:flex-row gap-5 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all group">
          {/* Thumbnail */}
          <div className="relative w-full sm:w-48 h-48 rounded-xl overflow-hidden bg-slate-800 shrink-0">
            <Link href={`/products/${product.slug}`}>
              <img
                src={product.images?.[0]}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </Link>

            {discountPercent > 0 && (
              <span className="absolute top-2.5 left-2.5 bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-md">
                -{discountPercent}%
              </span>
            )}

            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-2.5 right-2.5 p-2 rounded-xl backdrop-blur-md transition-all ${
                isWishlisted
                  ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30"
                  : "bg-slate-900/80 text-slate-300 hover:text-white"
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? "fill-white" : ""}`} />
            </button>
          </div>

          {/* Details */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold uppercase tracking-wider">
                <span>{product.brand}</span>
                <span>•</span>
                <span className="text-slate-400 font-normal">{product.categoryName}</span>
              </div>

              <Link href={`/products/${product.slug}`}>
                <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors mt-1">
                  {product.name}
                </h3>
              </Link>

              <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                {product.description}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-3 text-xs">
                <div className="flex items-center text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="ml-1 font-bold text-slate-200">{product.rating || "4.8"}</span>
                </div>
                <span className="text-slate-500">({product.reviewCount || 0} reviews)</span>
                {product.stock <= 5 && product.stock > 0 && (
                  <span className="text-amber-400 font-semibold ml-2">Only {product.stock} left in stock!</span>
                )}
              </div>
            </div>

            {/* Price and Actions */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-black text-emerald-400">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-xs text-slate-500 line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuickViewOpen(true)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>Quick View</span>
                </button>

                <button
                  onClick={() => addToCart(product)}
                  disabled={product.stock <= 0}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{product.stock <= 0 ? "Out of Stock" : "Add to Bag"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <QuickViewModal
          product={product}
          isOpen={quickViewOpen}
          onClose={() => setQuickViewOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <div className="group relative rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 transition-all duration-300 flex flex-col overflow-hidden hover:shadow-2xl hover:shadow-indigo-950/30">
        {/* Media Container */}
        <div className="relative aspect-square overflow-hidden bg-slate-800">
          <Link href={`/products/${product.slug}`} className="block w-full h-full">
            <img
              src={product.images?.[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discountPercent > 0 && (
              <span className="bg-rose-600/95 backdrop-blur-md text-white text-[11px] font-black px-2 py-0.5 rounded-md shadow-md">
                -{discountPercent}%
              </span>
            )}
            {product.isNewArrival && (
              <span className="bg-indigo-600/95 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-md uppercase tracking-wider">
                New
              </span>
            )}
            {product.isTrending && (
              <span className="bg-amber-500/95 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md shadow-md uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3 h-3 fill-slate-950" /> Hot
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={() => toggleWishlist(product)}
            aria-label="Toggle Wishlist"
            className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all ${
              isWishlisted
                ? "bg-rose-500 text-white shadow-lg shadow-rose-500/40"
                : "bg-slate-900/70 text-slate-300 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? "fill-white" : ""}`} />
          </button>

          {/* Hover Quick Action Buttons */}
          <div className="absolute inset-x-3 bottom-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => setQuickViewOpen(true)}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-900 backdrop-blur-md text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-lg border border-slate-700/60 transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Quick View</span>
            </button>
            <button
              onClick={() => addToCart(product)}
              disabled={product.stock <= 0}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
              title="Add to Cart"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-indigo-400 font-semibold tracking-wider text-[11px] uppercase">
                {product.brand}
              </span>
              <span className="text-slate-400 text-[11px]">{product.categoryName}</span>
            </div>

            <Link href={`/products/${product.slug}`}>
              <h3 className="font-semibold text-sm text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
                {product.name}
              </h3>
            </Link>

            {/* Rating */}
            <div className="flex items-center gap-1.5 mt-2 text-xs">
              <div className="flex items-center text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span className="ml-1 font-bold text-slate-200">{product.rating || "4.8"}</span>
              </div>
              <span className="text-slate-500">({product.reviewCount || 0})</span>
            </div>
          </div>

          {/* Pricing and Stock */}
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-black text-emerald-400">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-xs text-slate-500 line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>
              {product.stock <= 5 && product.stock > 0 && (
                <p className="text-[10px] text-amber-400 font-medium">Only {product.stock} left!</p>
              )}
            </div>

            <button
              onClick={() => addToCart(product)}
              disabled={product.stock <= 0}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-semibold transition-all border border-slate-700/60 hover:border-indigo-500 disabled:opacity-40"
            >
              {product.stock <= 0 ? "Sold Out" : "+ Add"}
            </button>
          </div>
        </div>
      </div>

      <QuickViewModal
        product={product}
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </>
  );
}
