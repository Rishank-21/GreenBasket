import connectDB from "@/lib/db";
import emitEventHandler from "@/lib/emitEventHandler";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST (request:NextRequest){
    try {
        await connectDB();
        const { orderId, otp } = await request.json();
        if(!orderId || !otp){
            return NextResponse.json({ message: "Order ID and OTP are required" }, { status: 400 });
        }
        const order = await Order.findById(orderId);
        if(!order){
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }
        if(order.deliveryOtp !== otp){
            return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
        }
        order.status = "delivered";
        order.deliveryOtpVerification = true;
        order.deliveredAt = new Date();
        await order.save();
        await emitEventHandler("order-status-update", {orderId: order._id, status: order.status})

        await DeliveryAssignment.updateOne({ order: orderId }, {$set : {assignedTo: null, status: "completed"}});
        return NextResponse.json({ message: "Delivery completed successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error occurred while verifying OTP" }, { status: 500 });
    }
}