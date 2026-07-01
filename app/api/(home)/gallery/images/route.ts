import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import GalleryImage from "@/models/GalleryImage";

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        const type = searchParams.get("type");

        if (id) {
            const item = await GalleryImage.findById(id);
            if (!item) {
                return NextResponse.json({ error: "Gallery item not found" }, { status: 404 });
            }
            return NextResponse.json(item, { status: 200 });
        }

        const filter: any = {};
        if (type) {
            filter.type = type;
        }

        const items = await GalleryImage.find(filter).sort({ date: -1, createdAt: -1 });
        return NextResponse.json(items, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
