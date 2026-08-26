import { db } from "./index";
import { categories, products, users, coupons, reviews, orders } from "./schema";
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_COUPONS, INITIAL_REVIEWS } from "./seed-data";
import { eq } from "drizzle-orm";

export async function seedDatabase(force = false) {
  try {
    // Check if products exist
    const existingProducts = await db.select().from(products).limit(1);
    if (existingProducts.length > 0 && !force) {
      return { success: true, message: "Database already initialized." };
    }

    if (force) {
      await db.delete(reviews);
      await db.delete(orders);
      await db.delete(coupons);
      await db.delete(products);
      await db.delete(categories);
      await db.delete(users);
    }

    // Insert categories
    for (const cat of INITIAL_CATEGORIES) {
      await db.insert(categories).values({
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
        icon: cat.icon,
        featured: cat.featured,
        itemCount: cat.itemCount,
      }).onConflictDoNothing();
    }

    // Insert products
    const insertedProducts: Array<{ id: number; slug: string }> = [];
    for (const prod of INITIAL_PRODUCTS) {
      const [inserted] = await db.insert(products).values({
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        price: prod.price,
        compareAtPrice: prod.compareAtPrice,
        costPrice: prod.costPrice,
        stock: prod.stock,
        categorySlug: prod.categorySlug,
        categoryName: prod.categoryName,
        brand: prod.brand,
        rating: prod.rating,
        reviewCount: prod.reviewCount,
        images: prod.images,
        tags: prod.tags,
        specs: prod.specs,
        colors: prod.colors,
        sizes: prod.sizes,
        sku: prod.sku,
        isFeatured: prod.isFeatured,
        isTrending: prod.isTrending,
        isNewArrival: prod.isNewArrival,
        status: prod.status,
      }).returning({ id: products.id, slug: products.slug });
      if (inserted) insertedProducts.push(inserted);
    }

    // Insert coupons
    for (const coup of INITIAL_COUPONS) {
      await db.insert(coupons).values({
        code: coup.code,
        description: coup.description,
        discountType: coup.discountType,
        discountValue: coup.discountValue,
        minSpend: coup.minSpend,
        maxDiscount: coup.maxDiscount,
        isActive: coup.isActive,
      }).onConflictDoNothing();
    }

    // Insert default demo users (Customer and Admin)
    const [demoCustomer] = await db.insert(users).values({
      name: "Alex Morgan (Demo Customer)",
      email: "customer@apexmart.io",
      password: "password123",
      role: "customer",
      avatar: "https://images.pexels.com/photos/6633650/pexels-photo-6633650.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=200&w=200",
      phone: "+1 (555) 349-8201",
      addresses: [
        {
          id: "addr_1",
          label: "Home",
          street: "742 Evergreen Terrace",
          city: "San Francisco",
          state: "CA",
          zipCode: "94107",
          country: "United States",
          isDefault: true,
        },
        {
          id: "addr_2",
          label: "Office",
          street: "100 Market St Suite 400",
          city: "San Francisco",
          state: "CA",
          zipCode: "94105",
          country: "United States",
          isDefault: false,
        },
      ],
    }).returning({ id: users.id });

    await db.insert(users).values({
      name: "Sarah Sterling (Store Admin)",
      email: "admin@apexmart.io",
      password: "adminpassword123",
      role: "admin",
      avatar: "https://images.pexels.com/photos/3184451/pexels-photo-3184451.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=200&w=200",
      phone: "+1 (555) 902-1844",
      addresses: [
        {
          id: "addr_admin",
          label: "Apex HQ",
          street: "500 Howard Street, Fl 12",
          city: "San Francisco",
          state: "CA",
          zipCode: "94105",
          country: "United States",
          isDefault: true,
        },
      ],
    }).onConflictDoNothing();

    // Map inserted products to slug
    const prodList = await db.select({ id: products.id, slug: products.slug }).from(products);
    const prodMap = new Map(prodList.map((p) => [p.slug, p.id]));

    // Insert reviews
    for (const rev of INITIAL_REVIEWS) {
      const prodId = prodMap.get(rev.productSlug);
      if (prodId) {
        await db.insert(reviews).values({
          productId: prodId,
          userId: demoCustomer?.id || 1,
          userName: rev.userName,
          userAvatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(rev.userName)}`,
          rating: rev.rating,
          title: rev.title,
          comment: rev.comment,
          verifiedPurchase: rev.verifiedPurchase,
          helpfulCount: rev.helpfulCount,
        });
      }
    }

    // Insert sample orders for rich metrics, history, and real order tracking
    const orderSeeds = [
      {
        orderNumber: "APX-89210",
        customerName: "Alex Morgan",
        customerEmail: "customer@apexmart.io",
        customerPhone: "+1 (555) 349-8201",
        shippingAddress: {
          street: "742 Evergreen Terrace",
          city: "San Francisco",
          state: "CA",
          zipCode: "94107",
          country: "United States",
        },
        items: [
          {
            productId: prodMap.get("apex-anc-pro-headphones") || 1,
            name: "Apex ANC Pro Wireless Studio Headphones",
            slug: "apex-anc-pro-headphones",
            price: 299.99,
            quantity: 1,
            image: "https://images.pexels.com/photos/577768/pexels-photo-577768.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
            color: "Space Gray",
          },
          {
            productId: prodMap.get("minimalist-leather-desk-pad") || 9,
            name: "Minimalist Leather Desk Pad & Cable Rail",
            slug: "minimalist-leather-desk-pad",
            price: 48.0,
            quantity: 1,
            image: "https://images.pexels.com/photos/4087178/pexels-photo-4087178.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
            color: "Caramel Tan",
            size: "Large (35x16)",
          },
        ],
        subtotal: "347.99",
        discount: "52.20",
        shippingFee: "0.00",
        tax: "24.40",
        total: "320.19",
        couponCode: "SAVE15",
        paymentMethod: "card",
        paymentStatus: "paid",
        orderStatus: "shipped",
        trackingNumber: "APX-TRK-9941824",
        carrier: "FedEx Express (2-Day)",
        notes: "Leave at front porch inside parcel locker.",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        orderNumber: "APX-77412",
        customerName: "Alex Morgan",
        customerEmail: "customer@apexmart.io",
        customerPhone: "+1 (555) 349-8201",
        shippingAddress: {
          street: "742 Evergreen Terrace",
          city: "San Francisco",
          state: "CA",
          zipCode: "94107",
          country: "United States",
        },
        items: [
          {
            productId: prodMap.get("chronos-ultra-smartwatch") || 3,
            name: "Chronos Ultra Titanium Smartwatch",
            slug: "chronos-ultra-smartwatch",
            price: 349.0,
            quantity: 1,
            image: "https://images.pexels.com/photos/9528216/pexels-photo-9528216.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
            color: "Titanium Gray",
            size: "46mm",
          },
        ],
        subtotal: "349.00",
        discount: "0.00",
        shippingFee: "0.00",
        tax: "28.80",
        total: "377.80",
        paymentMethod: "apple_pay",
        paymentStatus: "paid",
        orderStatus: "delivered",
        trackingNumber: "APX-TRK-8819031",
        carrier: "UPS Next Day Air",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        orderNumber: "APX-65109",
        customerName: "Jessica Taylor",
        customerEmail: "jessica.t@example.com",
        customerPhone: "+1 (555) 883-9102",
        shippingAddress: {
          street: "1200 Beacon St Apt 5",
          city: "Boston",
          state: "MA",
          zipCode: "02116",
          country: "United States",
        },
        items: [
          {
            productId: prodMap.get("lumiere-botanical-restorative-serum") || 12,
            name: "Lumière Botanical Restorative Serum & Facial Oil",
            slug: "lumiere-botanical-restorative-serum",
            price: 68.0,
            quantity: 2,
            image: "https://images.pexels.com/photos/4202321/pexels-photo-4202321.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
          },
        ],
        subtotal: "136.00",
        discount: "20.40",
        shippingFee: "0.00",
        tax: "9.54",
        total: "125.14",
        couponCode: "SAVE15",
        paymentMethod: "paypal",
        paymentStatus: "paid",
        orderStatus: "delivered",
        trackingNumber: "APX-TRK-7481902",
        carrier: "USPS Priority",
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      },
      {
        orderNumber: "APX-94812",
        customerName: "Michael Vance",
        customerEmail: "mvance@domain.io",
        customerPhone: "+1 (555) 441-9988",
        shippingAddress: {
          street: "450 5th Ave",
          city: "New York",
          state: "NY",
          zipCode: "10018",
          country: "United States",
        },
        items: [
          {
            productId: prodMap.get("artisan-barista-gooseneck-kettle") || 10,
            name: "Artisan Pour-Over Goose Neck Barista Kettle",
            slug: "artisan-barista-gooseneck-kettle",
            price: 165.0,
            quantity: 1,
            image: "https://images.pexels.com/photos/7622818/pexels-photo-7622818.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
            color: "Matte Black with Walnut",
          },
          {
            productId: prodMap.get("handcrafted-ceramic-mug-set") || 11,
            name: "Handcrafted Terracotta & Ceramic Mug Set",
            slug: "handcrafted-ceramic-mug-set",
            price: 42.0,
            quantity: 2,
            image: "https://images.pexels.com/photos/4466240/pexels-photo-4466240.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
            color: "Speckled Sand",
          },
        ],
        subtotal: "249.00",
        discount: "0.00",
        shippingFee: "0.00",
        tax: "21.16",
        total: "270.16",
        paymentMethod: "card",
        paymentStatus: "paid",
        orderStatus: "processing",
        trackingNumber: "APX-TRK-PENDING",
        carrier: "FedEx Standard",
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      },
    ];

    for (const o of orderSeeds) {
      await db.insert(orders).values({
        orderNumber: o.orderNumber,
        userId: demoCustomer?.id || 1,
        customerName: o.customerName,
        customerEmail: o.customerEmail,
        customerPhone: o.customerPhone,
        shippingAddress: o.shippingAddress,
        items: o.items,
        subtotal: o.subtotal,
        discount: o.discount,
        shippingFee: o.shippingFee,
        tax: o.tax,
        total: o.total,
        couponCode: o.couponCode,
        paymentMethod: o.paymentMethod,
        paymentStatus: o.paymentStatus,
        orderStatus: o.orderStatus,
        trackingNumber: o.trackingNumber,
        carrier: o.carrier,
        notes: o.notes,
        createdAt: o.createdAt,
      });
    }

    return { success: true, message: "Database seeded successfully!" };
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}
