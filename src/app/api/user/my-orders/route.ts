import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    try {
        await connectDB()
        const session = await auth()
        const orders = await Order.find({user:session?.user?.id}).populate("user assignedDeliveryBoy").sort({createdAt:-1})
        if(!orders) return NextResponse.json({message : "orders not found"}, {status:404})
        return NextResponse.json(orders,{status:200})
    } catch (error) {
        return NextResponse.json({message:`order error ${error}`},{status:500})
    }
}