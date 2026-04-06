import { auth } from "@/auth";
import connectDB from "@/lib/db";
import DeliveryAssignment from "@/models/deliveryAssignment.model";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        await connectDB()
        const session = await auth()
        const deliveryBoyId = session?.user?.id
        if(!deliveryBoyId){
            return NextResponse.json({message:"Unauthorized"}, {status:401})
        }
        const activeAssignment = await DeliveryAssignment.findOne({
            assignedTo: deliveryBoyId,
            status: "assigned"
        }).populate("order").lean()

        if(!activeAssignment){
            return NextResponse.json({active:false}, {status:200})
        }
        return NextResponse.json({active:true, assignment:activeAssignment}, {status:200})
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error"
        return NextResponse.json({message:"Internal server error", error: message}, {status:500})
    }
}
