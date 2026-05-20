import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import VolunteerMembership from "@/models/VolunteerMembership";

// GET – admin fetches all membership records, optionally filtered by ?month=April
export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const date = searchParams.get("date");

        const query: Record<string, any> = {};

        if (date && date !== "All") {
            query.date = date;
        }

        const records = await VolunteerMembership.find(query).sort({ submittedAt: -1 });

        return NextResponse.json({ success: true, data: records }, { status: 200 });
    } catch (error: any) {
        console.error("Admin membership GET error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
