import { auth } from "@/auth";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session.user)
      return NextResponse.json(
        { message: "session not found" },
        { status: 404 }
      );
    const user = await User.findOne({ email: session.user.email }).select(
      "-password"
    );
    if (!user)
      return NextResponse.json({ message: "User Not Found" }, { status: 400 });

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
