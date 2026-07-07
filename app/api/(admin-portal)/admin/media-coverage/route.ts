import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import MediaCoverage from "@/models/MediaCoverage";
import { uploadToCloudinary } from "@/lib/cloudinary";

// GET all media coverage items
export async function GET() {
    try {
        await connectDB();
        const items = await MediaCoverage.find({}).sort({ createdAt: -1 });
        return NextResponse.json(items, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST a new media coverage item
export async function POST(req: Request) {
    try {
        await connectDB();
        const data = await req.json();

        if (!data.type || !data.title || !data.image) {
            return NextResponse.json({ error: "Missing required fields: type, title, or image" }, { status: 400 });
        }

        // Upload image to Cloudinary if provided as a Base64 data URI
        if (data.image && data.image.startsWith("data:")) {
            try {
                const cloudinaryUrl = await uploadToCloudinary(data.image, "media_coverage");
                data.image = cloudinaryUrl;
            } catch (err: any) {
                console.error("Cloudinary upload failed for media coverage. Saving Base64 fallback.", err);
            }
        }

        const newItem = await MediaCoverage.create(data);
        return NextResponse.json(newItem, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
