import { NextResponse } from "next/server";
import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(req: Request) {
  try {
    const { phone, message } = await req.json();

    const response = await client.messages.create({
      from: "whatsapp:+14155238886",
      to: `whatsapp:+91${phone}`,
      body: message,
    });

    return NextResponse.json({ success: true, response });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false });
  }
}