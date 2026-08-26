# ApexMart — Fullstack E-Commerce Internship Project

ApexMart is a responsive fullstack e-commerce application built as an internship capstone project. It demonstrates a complete customer shopping journey, PostgreSQL-backed APIs, order fulfillment, product reviews, coupon calculations, multi-currency display, and an analytical administration dashboard.

> This project uses simulated authentication and payment methods for demonstration. It does not process real payments and should not be used as a production store without the security additions described below.

## Features

### Customer storefront
- Responsive premium storefront and category collections
- Debounced product search with autocomplete
- Category, brand, price, availability, and sorting filters
- Grid and list catalog views
- Product image galleries, specifications, variants, stock status, and related items
- Product quick-view modal
- Customer reviews with dynamic rating recalculation
- Persistent cart and wishlist using browser storage
- Quantity updates and free-shipping progress
- Percentage and fixed-value coupon support
- USD, EUR, GBP, CAD, INR, and JPY display currencies

### Checkout and fulfillment
- Shipping/contact form with a demo autofill option
- Standard, express, and overnight delivery tiers
- Simulated card, Apple Pay, PayPal, and cash-on-delivery choices
- Order creation in PostgreSQL with inventory deduction
- Order success receipt and celebration animation
- Five-stage visual order tracker
- Printable order receipts and invoices
- Customer order history

### Administrator portal
- Revenue, order, average order value, and stock KPIs
- Revenue and category sales charts
- Product creation, deletion, and inventory adjustment
- Order fulfillment status management
- Coupon creation and management
- Demo database reset and reseeding

## Technology Stack

- Next.js 16 with App Router
- React 19 and TypeScript
- PostgreSQL
- Drizzle ORM and Drizzle Kit
- Tailwind CSS 4
- Recharts
- Lucide React
- Canvas Confetti

## Main Routes

| Route | Purpose |
| --- | --- |
| `/` | Storefront homepage |
| `/products` | Searchable and filterable catalog |
| `/products/[id]` | Product details and reviews |
| `/cart` | Shopping cart and coupons |
| `/checkout` | Shipping and simulated payment flow |
| `/wishlist` | Saved products |
| `/track-order` | Order tracking timeline |
| `/account` | Customer profile and addresses |
| `/account/orders` | Order history and invoices |
| `/admin` | Analytics, products, orders, and coupons |

## Local Installation

### Prerequisites

- Node.js 20 or newer
- npm
- PostgreSQL 14 or newer

### 1. Clone and install

```bash
git clone <your-repository-url>
cd <repository-folder>
npm install
```

### 2. Configure the database

Copy the safe environment template:

```bash
cp .env.example .env
```

Update `DATABASE_URL` in `.env` with your PostgreSQL credentials. The default sandbox database used during development was:

```text
postgresql://postgres:postgres@127.0.0.1:5432/app_db
```

Create the database if necessary, then apply the schema:

```bash
npx drizzle-kit push
```

The included Drizzle configuration targets the local `app_db` database. For hosted deployments, update the Drizzle database configuration or pass your hosted database connection securely.

### 3. Start the application

```bash
npm run dev
```

Open `http://localhost:3000`. On the first catalog request, the app automatically inserts its demonstration data when the product table is empty.

## Demo Guide

1. Search for `headphones`, `smartwatch`, or `leather` in the header.
2. Open the catalog and test category, brand, stock, price, sorting, and view filters.
3. Open a product, choose a variant, submit a review, and add it to the cart.
4. Apply `SAVE15`, `APEX20`, `SUMMER50`, or `FREESHIP` where the minimum spend is satisfied.
5. Complete the simulated checkout with the prefilled demo address.
6. Track an existing sample order:
   - `APX-89210` — shipped
   - `APX-77412` — delivered
   - `APX-94812` — processing
7. Switch to Admin mode from the header and open `/admin` to demonstrate analytics and fulfillment management.

### Demonstration accounts

The role switcher is intentionally available in the header for an easy internship demonstration.

- Customer: `customer@apexmart.io`
- Administrator: `admin@apexmart.io`

These are simulated client-side roles, not production authentication credentials.

## Database Design

The Drizzle schema in `src/db/schema.ts` contains:

- `categories`
- `products`
- `users`
- `orders`
- `reviews`
- `coupons`
- `wishlists`
- `newsletter_subscribers`

Structured product specifications, variants, addresses, and order line items use PostgreSQL JSONB where flexible nested data is appropriate.

## API Overview

- `GET/POST /api/products`
- `GET/PATCH/DELETE /api/products/[id]`
- `GET /api/categories`
- `GET/POST /api/orders`
- `GET/PATCH /api/orders/[id]`
- `GET/POST /api/reviews`
- `GET/POST/PATCH /api/coupons`
- `GET /api/admin/stats`
- `POST /api/seed`
- `GET /api/health`

## Validation

The project has been validated with:

```bash
npx next typegen
npm exec tsc -- --noEmit --pretty false
npm run build
```

## Deployment

A typical deployment can use Vercel for Next.js and Neon, Supabase, Railway, or another managed PostgreSQL provider.

1. Push the repository without `.env`.
2. Create a managed PostgreSQL database.
3. Configure `DATABASE_URL` as a server-side deployment environment variable.
4. Apply the Drizzle schema to the hosted database.
5. Deploy the Next.js application.
6. Verify `/api/health`, checkout, order creation, and administration workflows.

## Production Limitations

Before accepting real users or payments, add:

- Secure server-side authentication and sessions
- Password hashing and account verification
- Server-side role authorization for all administration endpoints
- Stripe, Razorpay, or another real payment processor with webhook verification
- Runtime request validation, such as Zod
- Database transactions around order creation and inventory updates
- Rate limiting, CSRF protection, and an audit log
- Object storage and optimized product image uploads
- Email delivery for receipts and shipping notifications
- Automated unit, integration, and end-to-end tests
- Accessibility and security audits

## Customization Before Presentation

Replace repository placeholders with your own name, college/company, internship role, GitHub profile, LinkedIn profile, deployment URL, and screenshots. Add a short section describing the challenges you solved and what you learned.

## License

Created for educational, portfolio, and internship demonstration purposes.
