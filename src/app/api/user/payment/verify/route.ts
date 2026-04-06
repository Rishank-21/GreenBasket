import connectDB from "@/lib/db";
import emitEventHandler from "@/lib/emitEventHandler";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const sessionId = req.nextUrl.searchParams.get("session_id");
    const orderId = req.nextUrl.searchParams.get("orderId");

    if (!sessionId || !orderId) {
      return NextResponse.json(
        { message: "Missing orderId or session_id" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (
      session.payment_status !== "paid" ||
      session.metadata?.orderId !== orderId
    ) {
      return NextResponse.json(
        { message: "Payment is not verified yet" },
        { status: 400 }
      );
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { isPaid: true },
      { new: true }
    ).populate("assignedDeliveryBoy");

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    await emitEventHandler("order-payment-update", {
      orderId: order._id,
      isPaid: true,
    });

    return NextResponse.json(
      { message: "Payment verified successfully", order },
      { status: 200 }
    );
  } catch (error) {
    console.error("Stripe payment verification failed:", error);
    return NextResponse.json(
      { message: "Unable to verify payment" },
      { status: 500 }
    );
  }
}
