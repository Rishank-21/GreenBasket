import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
try {
    await connectDB();
    const { role , mobile } = await req.json();
    const sesssion = await auth()
    const user = await User.findOneAndUpdate(
        {email: sesssion?.user?.email},
        {
            role,
            mobile
        },
        {new: true}
    );

    if(!user){
        return NextResponse.json({message: "User not found"}, {status: 404});
    }
    return NextResponse.json({message: "Role and Mobile updated successfully", user}, {status: 200});
} catch (error) {
    return NextResponse.json({message: "Internal Server Error"}, {status: 500});
}
}