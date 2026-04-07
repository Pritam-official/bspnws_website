import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

export async function GET() {
    try {
        await connectDB();
        return NextResponse.json({ message: "Connected to MongoDB successfully!" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
