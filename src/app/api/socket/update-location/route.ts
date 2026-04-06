import connectDB from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
try {
    await connectDB()
    const {userId, location} = await request.json();
    if(!userId || !location) return NextResponse.json({error: "Missing userId or location"}, {status:400});
    const user = await User.findByIdAndUpdate(userId, {location}, {new: true});
    if(!user) return NextResponse.json({error: "User not found"}, {status:404});
    return NextResponse.json({message: "Location updated successfully"},{status:200});
} catch (error) {
    return NextResponse.json({error: "Failed to update location"}, {status:500});
}
}