import connectDB from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
try {
    await connectDB()
    const {userId, socketId} = await request.json();
    if(!userId || !socketId) return NextResponse.json({error: "Missing userId or socketId"}, {status:400});
    const user = await User.findByIdAndUpdate(userId, {socketId, isOnline: true}, {new: true});
    if(!user) return NextResponse.json({error: "User not found"}, {status:404});
    return NextResponse.json({message: "Socket ID updated successfully"},{status:200});
    
} catch (error) {
    return NextResponse.json({error: "Failed to update socket ID"}, {status:500});
}
}
