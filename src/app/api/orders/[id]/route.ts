import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq, or } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const isNumeric = /^\d+$/.test(id);

    let orderList;
    if (isNumeric) {
      orderList = await db.select().from(orders).where(eq(orders.id, parseInt(id, 10))).limit(1);
    } else {
      orderList = await db.select().from(orders).where(eq(orders.orderNumber, id)).limit(1);
    }

    if (!orderList || orderList.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order: orderList[0] });
  } catch (error) {
    console.error("GET /api/orders/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const isNumeric = /^\d+$/.test(id);
    const body = await req.json();

    const condition = isNumeric ? eq(orders.id, parseInt(id, 10)) : eq(orders.orderNumber, id);

    const [updated] = await db
      .update(orders)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(condition)
      .returning();

    return NextResponse.json({ order: updated, success: true });
  } catch (error) {
    console.error("PATCH /api/orders/[id] error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
