"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { InternshipTourModal } from "@/components/layout/InternshipTourModal";
import { ProductCard } from "@/components/products/ProductCard";
import { Product, Review } from "@/types";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  Star,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Plus,
  Minus,
  Sparkles,
  ChevronRight,
  Send,
  MessageSquare,
  Package,
} from "lucide-react";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  const { success, error } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [related, setRelated] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"specs" | "reviews" | "shipping">("specs");
  const [tourOpen, setTourOpen] = useState(false);

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/products/${resolvedParams.id}`);
        const data = await res.json();
        if (data.product) {
          setProduct(data.product);
          setSelectedColor(data.product.colors?.[0] || "");
          setSelectedSize(data.product.sizes?.[0] || "");
          setReviews(data.reviews || []);
          setRelated(data.related || []);
        }
      } catch (err) {
        console.error("Failed to load product", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadProduct();
  }, [resolvedParams.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col">
        <Header />
        <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-20 text-center space-y-4">
          <h2 className="text-2xl font-bold">Product Not Found</h2>
          <p className="text-slate-400 text-sm">The product you are looking for does not exist or has been removed.</p>
          <Link href="/products" className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold">
            Back to Catalog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  const images = product.images && product.images.length > 0 ? product.images : ["/images/placeholder.jpg"];

  const handleAddToCart = () => {
    addToCart(product, quantity, { color: selectedColor, size: selectedSize });
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, { color: selectedColor, size: selectedSize });
    router.push("/checkout");
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewComment.trim()) {
      error("Please enter a review headline and comment", "Missing fields");
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          userId: user?.id || null,
          userName: user?.name || "Verified Customer",
          userAvatar: user?.avatar,
          rating: reviewRating,
          title: reviewTitle,
          comment: reviewComment,
        }),
      });

      const data = await res.json();
      if (data.success && data.review) {
        setReviews([data.review, ...reviews]);
        setReviewTitle("");
        setReviewComment("");
        success("Thank you for your review! Product rating has been updated.", "Review Submitted");
      }
    } catch {
      error("Failed to post review. Please try again.", "Error");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const priceNum = parseFloat(product.price) || 0;
  const compareAtNum = product.compareAtPrice ? parseFloat(product.compareAtPrice) : 0;
  const discountPercent = compareAtNum > priceNum ? Math.round(((compareAtNum - priceNum) / compareAtNum) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header onOpenTour={() => setTourOpen(true)} />
      <CartDrawer />
      <InternshipTourModal isOpen={tourOpen} onClose={() => setTourOpen(false)} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/products" className="hover:text-white transition-colors">Products</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href={`/products?category=${product.categorySlug}`} className="hover:text-white transition-colors">
            {product.categoryName}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-200 font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Top Product Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
              <img
                src={images[selectedImage] || images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
              />

              {discountPercent > 0 && (
                <span className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-black px-3 py-1 rounded-lg shadow-lg">
                  -{discountPercent}% OFF
                </span>
              )}

              <button
                onClick={() => toggleWishlist(product)}
                className={`absolute top-4 right-4 p-3 rounded-2xl backdrop-blur-md transition-all ${
                  isWishlisted
                    ? "bg-rose-500 text-white shadow-xl shadow-rose-500/40"
                    : "bg-slate-900/80 text-slate-300 hover:text-white"
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-white" : ""}`} />
              </button>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImage === idx ? "border-indigo-500 scale-105 shadow-md shadow-indigo-500/20" : "border-slate-800 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Purchase Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-indigo-400 font-bold uppercase tracking-widest">{product.brand}</span>
                <span className="text-slate-400">SKU: {product.sku || "APX-PRO"}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Ratings and Reviews */}
              <div className="flex items-center gap-3 mt-3 text-xs">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="ml-1 font-bold text-slate-100">{product.rating || "4.9"}</span>
                </div>
                <span className="text-slate-400">({reviews.length || product.reviewCount || 0} reviews)</span>
                <span className="h-3 w-px bg-slate-700" />
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Authentic
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Total Price</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl font-black text-emerald-400">
                    {formatPrice(product.price)}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-sm text-slate-500 line-through">
                      {formatPrice(product.compareAtPrice)}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    product.stock > 0
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                  }`}
                >
                  {product.stock > 0 ? `In Stock (${product.stock})` : "Sold Out"}
                </span>
                {product.stock <= 5 && product.stock > 0 && (
                  <p className="text-[11px] text-amber-400 font-semibold mt-1">
                    Hurry! Only {product.stock} left
                  </p>
                )}
              </div>
            </div>

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Color / Finish: <span className="text-indigo-400 font-semibold">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                        selectedColor === c
                          ? "border-indigo-500 bg-indigo-600/20 text-indigo-300 shadow-md"
                          : "border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && product.sizes[0] !== "Standard" && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Size / Option: <span className="text-indigo-400 font-semibold">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                        selectedSize === s
                          ? "border-indigo-500 bg-indigo-600/20 text-indigo-300 shadow-md"
                          : "border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Add To Cart */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-slate-800 rounded-xl bg-slate-900 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-bold text-white min-w-[32px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="p-2 text-slate-400 hover:text-white transition-colors disabled:opacity-40"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-40 shadow-lg"
                >
                  <ShoppingBag className="w-4 h-4 text-indigo-400" />
                  <span>Add to Bag</span>
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-indigo-500 text-white font-black text-sm shadow-xl shadow-indigo-600/30 transition-all active:scale-[0.99] disabled:opacity-40"
              >
                Instant Express Checkout
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-800/80 text-center text-[11px] text-slate-400">
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
                <Truck className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
                <span>Free 2-Day Shipping</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
                <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <span>2-Year Warranty</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
                <RotateCcw className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                <span>30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed In-Depth Information: Specs, Shipping, Reviews */}
        <section className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
          {/* Tab Navigation */}
          <div className="flex border-b border-slate-800 bg-slate-900/80 px-6">
            <button
              onClick={() => setActiveTab("specs")}
              className={`py-4 px-5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === "specs"
                  ? "border-indigo-500 text-indigo-400 bg-indigo-500/10"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sparkles className="w-4 h-4" /> Description & Specifications
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`py-4 px-5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === "reviews"
                  ? "border-indigo-500 text-indigo-400 bg-indigo-500/10"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <MessageSquare className="w-4 h-4" /> Customer Reviews ({reviews.length})
            </button>
            <button
              onClick={() => setActiveTab("shipping")}
              className={`py-4 px-5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === "shipping"
                  ? "border-indigo-500 text-indigo-400 bg-indigo-500/10"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Truck className="w-4 h-4" /> Shipping & Guarantee
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 sm:p-8">
            {activeTab === "specs" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-white mb-2">Product Overview</h3>
                  <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                    {product.description}
                  </p>
                </div>

                {product.specs && Object.keys(product.specs).length > 0 && (
                  <div>
                    <h3 className="text-base font-bold text-white mb-3">Technical Specifications</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
                      {Object.entries(product.specs).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs"
                        >
                          <span className="text-slate-400 font-medium">{key}</span>
                          <span className="font-bold text-white text-right">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-8">
                {/* Write a Review Section */}
                <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 max-w-2xl">
                  <h4 className="font-bold text-white text-sm mb-1 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Write a Verified Buyer Review
                  </h4>
                  <p className="text-xs text-slate-400 mb-4">
                    Share your authentic experience with this product to help the community.
                  </p>

                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    {/* Star selector */}
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        Your Star Rating
                      </label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setReviewRating(star)}
                            className="p-1 text-amber-400 hover:scale-110 transition-transform"
                          >
                            <Star
                              className={`w-5 h-5 ${star <= reviewRating ? "fill-amber-400" : "text-slate-600"}`}
                            />
                          </button>
                        ))}
                        <span className="text-xs font-bold text-slate-300 ml-2">{reviewRating} of 5 Stars</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Review Title
                      </label>
                      <input
                        type="text"
                        required
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        placeholder="e.g. Sublime acoustic fidelity and battery life"
                        className="w-full bg-slate-900 border border-slate-700 text-xs rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Detailed Feedback
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Tell others what you loved about this gear..."
                        className="w-full bg-slate-900 border border-slate-700 text-xs rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-indigo-600/30 disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmittingReview ? "Publishing Review..." : "Submit Review"}</span>
                    </button>
                  </form>
                </div>

                {/* List of customer reviews */}
                <div className="space-y-4">
                  <h4 className="font-bold text-white text-base">
                    Customer Ratings & Feedback ({reviews.length})
                  </h4>

                  {reviews.length === 0 ? (
                    <p className="text-xs text-slate-400">No reviews yet. Be the first to leave a review!</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {reviews.map((rev) => (
                        <div
                          key={rev.id}
                          className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-300">
                                {rev.userName?.[0] || "U"}
                              </div>
                              <div>
                                <h5 className="font-semibold text-xs text-white">{rev.userName}</h5>
                                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> Verified Buyer
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center text-amber-400">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${i < rev.rating ? "fill-amber-400" : "text-slate-600"}`}
                                />
                              ))}
                            </div>
                          </div>

                          <h5 className="font-bold text-sm text-slate-200">{rev.title}</h5>
                          <p className="text-xs text-slate-400 leading-relaxed">{rev.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="space-y-4 text-xs text-slate-300 max-w-2xl leading-relaxed">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <Truck className="w-4 h-4 text-indigo-400" />
                    Express Worldwide Shipping
                  </h4>
                  <p>
                    All in-stock orders placed before 3:00 PM EST ship the same business day from our automated fulfillment centers in San Francisco and Amsterdam.
                  </p>
                  <ul className="space-y-1 text-slate-400 pt-1">
                    <li>• <strong>Standard Shipping:</strong> 3-5 business days (Free over $99)</li>
                    <li>• <strong>FedEx 2-Day Air:</strong> 2 business days ($9.99)</li>
                    <li>• <strong>Overnight Priority:</strong> Next business day delivery ($19.99)</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-purple-400" />
                    30-Day Hassle-Free Returns & Warranty
                  </h4>
                  <p>
                    If you are not 100% satisfied with your merchandise, return it within 30 days for a full refund or exchange. Each product includes our comprehensive 2-year manufacturer warranty.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Related Products Carousel */}
        {related.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-white">Related Products</h3>
              <Link
                href={`/products?category=${product.categorySlug}`}
                className="text-xs text-indigo-400 hover:underline font-semibold"
              >
                View category →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
