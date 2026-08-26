import { pgTable, text, serial, integer, numeric, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  image: text("image"),
  icon: text("icon"),
  featured: boolean("featured").default(false),
  itemCount: integer("item_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  compareAtPrice: numeric("compare_at_price", { precision: 10, scale: 2 }),
  costPrice: numeric("cost_price", { precision: 10, scale: 2 }),
  stock: integer("stock").notNull().default(0),
  categorySlug: text("category_slug").notNull(),
  categoryName: text("category_name").notNull(),
  brand: text("brand").notNull(),
  rating: numeric("rating", { precision: 3, scale: 2 }).default("4.5"),
  reviewCount: integer("review_count").default(0),
  images: jsonb("images").$type<string[]>().notNull(),
  tags: jsonb("tags").$type<string[]>().default([]),
  specs: jsonb("specs").$type<Record<string, string>>().default({}),
  colors: jsonb("colors").$type<string[]>().default([]),
  sizes: jsonb("sizes").$type<string[]>().default([]),
  sku: text("sku"),
  isFeatured: boolean("is_featured").default(false),
  isTrending: boolean("is_trending").default(false),
  isNewArrival: boolean("is_new_arrival").default(false),
  status: text("status").default("active"), // active, draft, archived
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("customer"), // customer, admin
  avatar: text("avatar"),
  phone: text("phone"),
  addresses: jsonb("addresses").$type<Array<{
    id: string;
    label: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault?: boolean;
  }>>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  userId: integer("user_id"),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  shippingAddress: jsonb("shipping_address").$type<{
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }>().notNull(),
  items: jsonb("items").$type<Array<{
    productId: number;
    name: string;
    slug: string;
    price: number;
    quantity: number;
    image: string;
    color?: string;
    size?: string;
  }>>().notNull(),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  discount: numeric("discount", { precision: 10, scale: 2 }).default("0.00"),
  shippingFee: numeric("shipping_fee", { precision: 10, scale: 2 }).default("0.00"),
  tax: numeric("tax", { precision: 10, scale: 2 }).default("0.00"),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  couponCode: text("coupon_code"),
  paymentMethod: text("payment_method").notNull().default("card"), // card, paypal, apple_pay, cod
  paymentStatus: text("payment_status").default("paid"), // paid, pending, failed, refunded
  orderStatus: text("order_status").default("processing"), // processing, confirmed, shipped, delivered, cancelled
  trackingNumber: text("tracking_number"),
  carrier: text("carrier"),
  estimatedDelivery: timestamp("estimated_delivery"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  userId: integer("user_id"),
  userName: text("user_name").notNull(),
  userAvatar: text("user_avatar"),
  rating: integer("rating").notNull(),
  title: text("title").notNull(),
  comment: text("comment").notNull(),
  verifiedPurchase: boolean("verified_purchase").default(true),
  helpfulCount: integer("helpful_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  description: text("description").notNull(),
  discountType: text("discount_type").notNull(), // percent, fixed
  discountValue: numeric("discount_value", { precision: 10, scale: 2 }).notNull(),
  minSpend: numeric("min_spend", { precision: 10, scale: 2 }).default("0.00"),
  maxDiscount: numeric("max_discount", { precision: 10, scale: 2 }),
  validUntil: timestamp("valid_until"),
  usageLimit: integer("usage_limit").default(1000),
  timesUsed: integer("times_used").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const wishlists = pgTable("wishlists", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  productId: integer("product_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  status: text("status").default("subscribed"),
  createdAt: timestamp("created_at").defaultNow(),
});
