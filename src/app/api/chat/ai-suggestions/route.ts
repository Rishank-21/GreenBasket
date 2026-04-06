import connectDB from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { message, role } = await request.json();

    if (!message || !role) {
      return NextResponse.json(
        { error: "Message and role are required" },
        { status: 400 }
      );
    }

    const prompt = `you are a professional delivery chatbot.
    
    you will be given : 
    -role: either "user" or "delivery_boy
    -last message: the last message sent in the conversation
    
    your task:
    --If role is "user" -> generate 3 short whatsapp-style reply suggestions that a user could send to the delivery boy.
    --If role is "delivery_boy" -> generate 3 short whatsapp-style reply suggestions that a delivery boy could send to the user.
    
    
    --Follow these rules:
    -Replies must watch the context of the last message.
    -Keep replies short, human-like (max 10 words).
    -Use emojis naturally(max one per reply).
    -No generic replies like "Okay" or "Thank you".
    -No numbering,No extra instructions, No extra text.
    -Just return comma-separated reply suggestions.
    
    -Return only the three reply suggestions. Comma-separated.
    
    Role: ${role}
    Last Message: ${message}`;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      },
    );
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Gemini request failed: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!replyText) {
      return NextResponse.json(
        { error: "No suggestions were returned by Gemini" },
        { status: 500 }
      );
    }

    const suggestions = replyText
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean)
      .slice(0, 3);

    return NextResponse.json({ suggestions }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Error generating response: ${error}` },
      { status: 500 },
    );
  }
}
