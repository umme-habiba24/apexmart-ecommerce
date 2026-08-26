export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  compareAtPrice?: string | null;
  costPrice?: string | null;
  stock: number;
  categorySlug: string;
  categoryName: string;
  brand: string;
  rating: string | null;
  reviewCount: number | null;
  images: string[];
  tags: string[];
  specs: Record<string, string>;
  colors: string[];
  sizes: string[];
  sku?: string | null;
  isFeatured: boolean | null;
  isTrending: boolean | null;
  isNewArrival: boolean | null;
  status: string | null;
  createdAt: string | Date | null;
  updatedAt?: string | Date | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  icon?: string | null;
  featured?: boolean | null;
  itemCount?: number | null;
}

export interface Review {
  id: number;
  productId: number;
  userId?: number | null;
  userName: string;
  userAvatar?: string | null;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase?: boolean | null;
  helpfulCount?: number | null;
  createdAt: string | Date | null;
}

export interface Coupon {
  id: number;
  code: string;
  description: string;
  discountType: "percent" | "fixed" | string;
  discountValue: string;
  minSpend?: string | null;
  maxDiscount?: string | null;
  isActive?: boolean | null;
}

export interface CartItem {
  id: string; // composite key: productId + color + size
  productId: number;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  quantity: number;
  image: string;
  selectedColor?: string;
  selectedSize?: string;
  stock: number;
}

export interface ShippingAddress {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
}

export interface OrderItem {
  productId: number;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image: string;
  color?: string;
  size?: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  userId?: number | null;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: string;
  discount: string;
  shippingFee: string;
  tax: string;
  total: string;
  couponCode?: string | null;
  paymentMethod: "card" | "paypal" | "apple_pay" | "cod" | string;
  paymentStatus: "paid" | "pending" | "failed" | "refunded" | string;
  orderStatus: "processing" | "confirmed" | "shipped" | "delivered" | "cancelled" | string;
  trackingNumber?: string | null;
  carrier?: string | null;
  estimatedDelivery?: string | Date | null;
  notes?: string | null;
  createdAt: string | Date | null;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "customer" | "admin";
  avatar?: string | null;
  phone?: string | null;
  addresses?: Array<{
    id: string;
    label: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault?: boolean;
  }>;
}

export type CurrencyCode = "USD" | "EUR" | "GBP" | "CAD" | "INR" | "JPY";
