import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, products } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { seedDatabase } from "@/db/seed";

export async function GET(req: NextRequest) {
  try {
    await seedDatabase(false);
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");

    let query = db.select().from(orders);

    if (userId) {
      query = query.where(eq(orders.userId, parseInt(userId, 10))) as any;
    }

    if (status && status !== "all") {
      query = query.where(eq(orders.orderStatus, status)) as any;
    }

    const orderList = await query.orderBy(desc(orders.createdAt));

    return NextResponse.json({ orders: orderList });
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      subtotal,
      discount,
      shippingFee,
      tax,
      total,
      couponCode,
      paymentMethod,
      notes,
    } = body;

    if (!customerName || !customerEmail || !shippingAddress || !items || items.length === 0) {
      return NextResponse.json({ error: "Missing required order fields" }, { status: 400 });
    }

    // Generate unique order number and tracking
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `APX-${randomSuffix}`;
    const trackingNumber = `APX-TRK-${Math.floor(1000000 + Math.random() * 9000000)}`;

    const carrierOptions = ["FedEx Express", "UPS Ground", "DHL Priority"];
    const randomCarrier = carrierOptions[Math.floor(Math.random() * carrierOptions.length)];

    const estimatedDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

    // Insert order
    const [newOrder] = await db
      .insert(orders)
      .values({
        orderNumber,
        userId: userId || 1,
        customerName,
        customerEmail,
        customerPhone: customerPhone || "+1 (555) 000-0000",
        shippingAddress,
        items,
        subtotal: subtotal.toString(),
        discount: (discount || 0).toString(),
        shippingFee: (shippingFee || 0).toString(),
        tax: (tax || 0).toString(),
        total: total.toString(),
        couponCode: couponCode || null,
        paymentMethod: paymentMethod || "card",
        paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
        orderStatus: "processing",
        trackingNumber,
        carrier: randomCarrier,
        estimatedDelivery,
        notes: notes || "",
      })
      .returning();

    // Deduct stock from products
    for (const item of items) {
      if (item.productId && item.quantity) {
        await db
          .update(products)
          .set({
            stock: sql`GREATEST(0, ${products.stock} - ${item.quantity})`,
          })
          .where(eq(products.id, item.productId));
      }
    }

    return NextResponse.json({ order: newOrder, success: true }, { status: 201 });
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
