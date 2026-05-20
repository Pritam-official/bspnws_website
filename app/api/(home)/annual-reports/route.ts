import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import AnnualReport from "@/models/AnnualReport";

export async function GET() {
    try {
        await connectDB();
        const reports = await AnnualReport.find({}).sort({ createdAt: -1 });
        return NextResponse.json(reports, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
