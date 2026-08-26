"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  Sparkles,
  ChevronDown,
  Menu,
  X,
  ShieldCheck,
  Zap,
  SlidersHorizontal,
  Package,
  Layers,
  Info,
  Check,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useAuth } from "@/context/AuthContext";
import { CurrencyCode, Product } from "@/types";

interface HeaderProps {
  onOpenTour?: () => void;
}

export function Header({ onOpenTour }: HeaderProps) {
  const router = useRouter();
  const { totalItems, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { currency, setCurrency, symbols, formatPrice } = useCurrency();
  const { user, isAdmin, loginAs } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search query
  useEffect(() => {
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    setIsSearching(true);
    searchTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}&limit=6`);
        const data = await res.json();
        setSearchResults(data.products || []);
        setShowSearchDropdown(true);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchDropdown(false);
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const currencies: CurrencyCode[] = ["USD", "EUR", "GBP", "CAD", "INR", "JPY"];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-lg">
      {/* Top Demo & Announcement Bar */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-950 text-xs py-1.5 px-4 border-b border-indigo-900/50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-indigo-500/20 text-indigo-300 font-medium px-2 py-0.5 rounded-full border border-indigo-400/30">
              <Sparkles className="w-3 h-3 text-amber-400" /> Internship Project Demo
            </span>
            <span className="hidden sm:inline text-slate-300">
              Enjoy 15% OFF with code <strong className="text-amber-300 font-mono tracking-wider">SAVE15</strong> • Free express shipping over $99
            </span>
          </div>

          <div className="flex items-center gap-3">
            {onOpenTour && (
              <button
                onClick={onOpenTour}
                className="text-slate-300 hover:text-white flex items-center gap-1 text-xs underline underline-offset-2 transition-colors font-medium"
              >
                <Info className="w-3.5 h-3.5 text-indigo-400" />
                Project Architecture & ERD
              </button>
            )}

            <div className="h-3 w-px bg-slate-700 hidden sm:block" />

            {/* Quick Demo Role Switcher */}
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <span className="text-slate-400">Mode:</span>
              <button
                onClick={() => loginAs("customer")}
                className={`px-2 py-0.5 rounded transition-colors text-[11px] font-medium ${
                  user?.role === "customer"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-800/80 hover:bg-slate-700 text-slate-300"
                }`}
              >
                Customer
              </button>
              <button
                onClick={() => loginAs("admin")}
                className={`px-2 py-0.5 rounded transition-colors text-[11px] font-medium ${
                  user?.role === "admin"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "bg-slate-800/80 hover:bg-slate-700 text-slate-300"
                }`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-200">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xl tracking-tight text-white flex items-center gap-1">
                  APEX<span className="text-indigo-400">.</span>MART
                </span>
                <span className="text-[10px] text-slate-400 -mt-1 font-medium tracking-widest uppercase">
                  Premium Store
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-300">
              <Link
                href="/products"
                className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                All Products
              </Link>
              <Link
                href="/products?featured=true"
                className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Featured
              </Link>
              <Link
                href="/products?category=audio"
                className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                Audio
              </Link>
              <Link
                href="/products?category=wearables"
                className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                Wearables
              </Link>
              <Link
                href="/products?category=fashion"
                className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                Fashion
              </Link>
              <Link
                href="/track-order"
                className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors flex items-center gap-1"
              >
                <Package className="w-3.5 h-3.5 text-emerald-400" />
                Order Tracking
              </Link>
            </nav>
          </div>

          {/* Search Bar */}
          <div ref={searchRef} className="relative flex-1 max-w-md hidden md:block">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (searchResults.length > 0) setShowSearchDropdown(true);
                  }}
                  placeholder="Search 4K headphones, titanium smartwatch, leather bag..."
                  className="w-full bg-slate-800/90 text-white placeholder-slate-400 text-sm rounded-full pl-10 pr-10 py-2 border border-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setShowSearchDropdown(false);
                    }}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>

            {/* Live Search Autocomplete Dropdown */}
            {showSearchDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 px-3">
                  <span>
                    {isSearching ? "Searching..." : `Found ${searchResults.length} results`}
                  </span>
                  <Link
                    href={`/products?search=${encodeURIComponent(searchQuery)}`}
                    onClick={() => setShowSearchDropdown(false)}
                    className="text-indigo-400 hover:underline font-medium"
                  >
                    View All →
                  </Link>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                  {searchResults.length === 0 && !isSearching ? (
                    <div className="p-4 text-center text-sm text-slate-400">
                      No products found for "{searchQuery}". Try "headphones", "smartwatch", or "leather".
                    </div>
                  ) : (
                    searchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        onClick={() => setShowSearchDropdown(false)}
                        className="flex items-center gap-3 p-3 hover:bg-slate-800/70 transition-colors group"
                      >
                        <img
                          src={product.images?.[0]}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover bg-slate-800 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-slate-200 group-hover:text-indigo-400 truncate transition-colors">
                            {product.name}
                          </h4>
                          <span className="text-xs text-slate-400">{product.categoryName}</span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-sm font-bold text-emerald-400">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Action Icons: Currency, Wishlist, Cart, Account */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 transition-colors"
                title="Change Currency"
              >
                <span>{currency}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {currencyDropdownOpen && (
                <div className="absolute right-0 mt-2 w-28 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-1 z-50">
                  {currencies.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setCurrency(c);
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left hover:bg-slate-800 transition-colors ${
                        currency === c ? "text-indigo-400 font-semibold" : "text-slate-300"
                      }`}
                    >
                      <span>{c} ({symbols[c]})</span>
                      {currency === c && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              className="relative p-2 rounded-xl text-slate-300 hover:text-rose-400 hover:bg-slate-800/60 transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Icon & Drawer Button */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-2 p-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-medium text-sm shadow-md shadow-indigo-600/20 transition-all active:scale-95"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline font-bold">{totalItems}</span>
              {totalItems > 0 && (
                <span className="sm:hidden absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-400 text-slate-950 text-xs font-black flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Account & Admin Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pl-2 pr-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition-colors"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover border border-indigo-500"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                    {user?.name?.[0] || "U"}
                  </div>
                )}
                <span className="text-xs font-medium text-slate-200 hidden md:inline max-w-[100px] truncate">
                  {user?.name?.split(" ")[0] || "Account"}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 divide-y divide-slate-800 animate-in fade-in duration-150">
                  <div className="px-4 py-2">
                    <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                    <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                    <span
                      className={`inline-block mt-1 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                        isAdmin ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      }`}
                    >
                      {user?.role || "customer"}
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/account"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                      <UserIcon className="w-4 h-4 text-indigo-400" />
                      My Profile & Saved Addresses
                    </Link>
                    <Link
                      href="/account/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                      <Package className="w-4 h-4 text-emerald-400" />
                      Order History & Invoices
                    </Link>
                    <Link
                      href="/track-order"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                      <ShieldCheck className="w-4 h-4 text-sky-400" />
                      Live Order Tracker
                    </Link>
                  </div>

                  {/* Admin Portal Shortcut */}
                  <div className="py-1">
                    <Link
                      href="/admin"
                      onClick={() => {
                        loginAs("admin");
                        setUserDropdownOpen(false);
                      }}
                      className="flex items-center justify-between px-4 py-2 text-xs font-semibold text-purple-300 hover:bg-purple-950/40 hover:text-purple-200"
                    >
                      <span className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-purple-400" />
                        Admin Dashboard
                      </span>
                      <span className="text-[10px] bg-purple-500/30 text-purple-200 px-1.5 py-0.5 rounded">
                        Full
                      </span>
                    </Link>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        loginAs(user?.role === "admin" ? "customer" : "admin");
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-indigo-300 hover:bg-slate-800 flex items-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      Switch to {user?.role === "admin" ? "Customer" : "Admin"} Mode
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 lg:hidden"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-900 px-4 pt-3 pb-6 space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-slate-800 text-white placeholder-slate-400 text-sm rounded-xl pl-10 pr-4 py-2.5 border border-slate-700"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>

          <nav className="flex flex-col space-y-1 text-sm font-medium">
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800"
            >
              All Products
            </Link>
            <Link
              href="/products?featured=true"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-amber-300 hover:bg-slate-800 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Featured Collection
            </Link>
            <Link
              href="/products?category=audio"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800"
            >
              Audio & Acoustics
            </Link>
            <Link
              href="/products?category=wearables"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800"
            >
              Wearables & Tech
            </Link>
            <Link
              href="/products?category=fashion"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800"
            >
              Fashion & Lifestyle
            </Link>
            <Link
              href="/track-order"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-emerald-400 hover:bg-slate-800 flex items-center gap-2"
            >
              <Package className="w-4 h-4" /> Track My Order
            </Link>
            <Link
              href="/admin"
              onClick={() => {
                loginAs("admin");
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 rounded-lg text-purple-400 hover:bg-slate-800 flex items-center gap-2 font-semibold"
            >
              <Layers className="w-4 h-4" /> Admin Analytics & Inventory
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
