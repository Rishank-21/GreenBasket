import connectDB from "@/lib/db";
import emitEventHandler from "@/lib/emitEventHandler";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { userId, items, paymentMethod, totalAmount, address } =
      await req.json();
    if (!items || !paymentMethod || !totalAmount || !address || !userId)
      throw new Error("All fields are required");

    if (paymentMethod !== "online") {
      return NextResponse.json(
        { message: "Invalid payment method for Stripe checkout" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user)
      return NextResponse.json({ message: "User Not Found" }, { status: 404 });

    const newOrder = await Order.create({
      user: userId,
      items,
      paymentMethod,
      totalAmount,
      address,
    });

    await emitEventHandler("new-order", newOrder);

    const requestOrigin = req.nextUrl.origin;
    const baseUrl =
      process.env.NEXT_BASE_URL?.trim() || requestOrigin || "http://localhost:3000";
    const amountInPaise = Math.round(Number(totalAmount) * 100);

    if (!Number.isFinite(amountInPaise) || amountInPaise <= 0) {
      return NextResponse.json(
        { message: "Invalid order total" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${baseUrl}/user/order-success?orderId=${newOrder._id.toString()}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/user/order-cancel?orderId=${newOrder._id.toString()}`,
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "GreenBasket Order Payment",
            },
            unit_amount: amountInPaise,
          },
          quantity: 1,
        },
      ],
      metadata: { orderId: newOrder._id.toString() },
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (error) {
    console.error("Stripe checkout session creation failed:", error);
    return NextResponse.json(
      { error: "Unable to start online payment" },
      { status: 500 }
    );
  }
}
