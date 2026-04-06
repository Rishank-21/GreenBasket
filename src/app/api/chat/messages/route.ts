import connectDB from '@/lib/db'
import Message from '@/models/message.model'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { roomId } = body

    if (!roomId) {
      return NextResponse.json({ error: 'missing roomId' }, { status: 400 })
    }

    await connectDB()

    const messages = await Message.find({ roomId }).sort({ createdAt: 1 })
    return NextResponse.json(messages)
  } catch (error) {
    console.error('Failed to fetch messages', error)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
// import connectDB from "@/lib/db";
// import Message from "@/models/message.model";
// import Order from "@/models/order.model";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req:NextRequest) {
//     try {
//         connectDB()
//         const {roomId} = await req.json()
//         let room = await Order.findById(roomId)
//         if(!room) return NextResponse.json({message:"room not found"},{status:404})
//         const messages = await Message.find({roomId:room._id})
//         return NextResponse.json(messages, {status:200})
//     } catch (error) {
//         return NextResponse.json({message:"get messages error"},{status:500})
//     }
// }