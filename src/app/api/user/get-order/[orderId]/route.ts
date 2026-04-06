import connectDB from "@/lib/db";
import Order from "@/models/order.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    await connectDB();

    const { orderId } = await params;
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json({ message: "invalid order id" }, { status: 400 });
    }

    const order = await Order.findById(orderId).populate("assignedDeliveryBoy");
    if (!order) {
      return NextResponse.json({ message: "order not found" }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: `server error ${error}` }, { status: 500 });
  }
}
