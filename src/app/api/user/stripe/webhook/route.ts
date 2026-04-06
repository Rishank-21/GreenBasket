import connectDB from "@/lib/db";
import emitEventHandler from "@/lib/emitEventHandler";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const rawBody = await req.text();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  let event: Stripe.Event;

  if (!sig || !webhookSecret) {
    return NextResponse.json(
      { message: "Missing Stripe webhook configuration" },
      { status: 400 }
    );
  }

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);
    return NextResponse.json({ message: "payment error" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await connectDB();
    await Order.findByIdAndUpdate(session.metadata?.orderId, { isPaid: true });
    await emitEventHandler("order-payment-update", {
      orderId: session.metadata?.orderId,
      isPaid: true,
    });
  }

  return NextResponse.json({ recieved: true }, { status: 200 });
}
