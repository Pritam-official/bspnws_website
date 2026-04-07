import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Officer from "@/models/Officer";

// GET all officers
export async function GET() {
    try {
        await connectDB();
        const officers = await Officer.find({}).sort({ createdAt: -1 });
        return NextResponse.json(officers, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST new officer
export async function POST(req: Request) {
    try {
        await connectDB();
        const data = await req.json();
        
        if (!data.name || !data.designation || !data.joiningDate) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newOfficer = await Officer.create(data);
        return NextResponse.json(newOfficer, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
