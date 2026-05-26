import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Programme from "@/models/Programme";
import { uploadToCloudinary } from "@/lib/cloudinary";

// GET all programmes (supports type filtering)
export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type");

        let filter = {};
        if (type === "recently-held" || type === "upcoming") {
            filter = { type };
        }

        const programmes = await Programme.find(filter).sort({ date: -1, createdAt: -1 });
        return NextResponse.json(programmes, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST a new programme
export async function POST(req: Request) {
    try {
        await connectDB();
        const data = await req.json();

        const { title, shortDescription, fullDescription, date, location, type } = data;

        if (!title || !shortDescription || !fullDescription || !date || !location || !type) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (type !== "recently-held" && type !== "upcoming") {
            return NextResponse.json({ error: "Invalid programme type" }, { status: 400 });
        }

        // Upload image to Cloudinary if provided as a Base64 data URI
        if (data.image && data.image.startsWith("data:")) {
            try {
                const cloudinaryUrl = await uploadToCloudinary(data.image, "programmes");
                data.image = cloudinaryUrl;
            } catch (err: any) {
                console.error("Cloudinary upload failed for programme. Saving Base64 fallback.", err);
            }
        }

        const newProgramme = await Programme.create(data);
        return NextResponse.json(newProgramme, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
