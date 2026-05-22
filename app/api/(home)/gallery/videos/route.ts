import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import GalleryVideo from "@/models/GalleryVideo";

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (id) {
            const item = await GalleryVideo.findById(id);
            if (!item) {
                return NextResponse.json({ error: "Gallery video not found" }, { status: 404 });
            }
            return NextResponse.json(item, { status: 200 });
        }

        const items = await GalleryVideo.find({}).sort({ date: -1, createdAt: -1 });
        return NextResponse.json(items, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
