import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Notice from "@/models/Notice";

export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const targetAudience = searchParams.get("targetAudience") || "all";

        const query: any = {
            status: "published"
        };

        if (targetAudience === "volunteer") {
            query.targetAudience = "volunteer";
        } else {
            query.targetAudience = "all";
        }

        const notices = await Notice.find(query).sort({ createdAt: -1 });
        return NextResponse.json(notices, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
