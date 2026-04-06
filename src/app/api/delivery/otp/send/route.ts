import connectDB from "@/lib/db";
import { sendMail } from "@/lib/mailer";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const { orderId } = await request.json();
        const order = await Order.findById(orderId).populate("user");
        if (!order) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        order.deliveryOtp = otp;
        await order.save();
        await sendMail(order.user.email, "Your Delivery OTP", `<p>Your OTP for order delivery is: <b>${otp}</b></p>`);
        return NextResponse.json({ message: "OTP sent successfully" }, { status: 200 });
     } catch (error) {
        return NextResponse.json({ message: "Error occurred while fetching order" }, { status: 500 });
    }
}