import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { coupons } from "@/db/schema";
import { eq } from "drizzle-orm";
import { seedDatabase } from "@/db/seed";

export async function GET(req: NextRequest) {
  try {
    await seedDatabase(false);
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (code) {
      const found = await db
        .select()
        .from(coupons)
        .where(eq(coupons.code, code.toUpperCase()))
        .limit(1);

      if (!found || found.length === 0 || !found[0].isActive) {
        return NextResponse.json({ coupon: null, message: "Invalid or inactive coupon" }, { status: 404 });
      }

      return NextResponse.json({ coupon: found[0] });
    }

    const allCoupons = await db.select().from(coupons);
    return NextResponse.json({ coupons: allCoupons });
  } catch (error) {
    console.error("GET /api/coupons error:", error);
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, description, discountType, discountValue, minSpend, maxDiscount } = body;

    if (!code || !discountValue) {
      return NextResponse.json({ error: "Code and discount value are required" }, { status: 400 });
    }

    const [newCoupon] = await db
      .insert(coupons)
      .values({
        code: code.toUpperCase().trim(),
        description: description || `${discountValue}% off`,
        discountType: discountType || "percent",
        discountValue: discountValue.toString(),
        minSpend: minSpend ? minSpend.toString() : "0.00",
        maxDiscount: maxDiscount ? maxDiscount.toString() : null,
        isActive: true,
      })
      .returning();

    return NextResponse.json({ coupon: newCoupon, success: true }, { status: 201 });
  } catch (error) {
    console.error("POST /api/coupons error:", error);
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, isActive } = body;

    const [updated] = await db
      .update(coupons)
      .set({ isActive })
      .where(eq(coupons.id, parseInt(id, 10)))
      .returning();

    return NextResponse.json({ coupon: updated, success: true });
  } catch (error) {
    console.error("PATCH /api/coupons error:", error);
    return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 });
  }
}
