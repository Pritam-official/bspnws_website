import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Notice from "@/models/Notice";

export async function GET() {
    try {
        await connectDB();
        const notices = await Notice.find({}).sort({ createdAt: -1 });
        return NextResponse.json(notices, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
