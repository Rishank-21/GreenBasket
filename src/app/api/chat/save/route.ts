import connectDB from '@/lib/db'
import Message from '@/models/message.model'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { roomId, text, senderId, time } = body

    if (!roomId || !text || !senderId) {
      return NextResponse.json({ error: 'missing fields' }, { status: 400 })
    }

    await connectDB()

    const saved = await Message.create({ roomId, text, senderId, time })
    return NextResponse.json(saved)
  } catch (error) {
    console.error('Failed to save message', error)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
// import connectDB from "@/lib/db";
// import Message from "@/models/message.model";
// import Order from "@/models/order.model";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();
//     const { senderId, text, roomId, time } = await req.json();
//     const room = await Order.findById(roomId);
//     if (!room)
//       return NextResponse.json({ message: "room not found" }, { status: 404 });
//     const message = await Message.create({
//       senderId,
//       roomId,
//       text,
//       time,
//     });
//     return NextResponse.json(message, {status:200})
//   } catch (error) {
//     return NextResponse.json(
//       { message: "save message error" },
//       { status: 500 },
//     );
//   }
// }
