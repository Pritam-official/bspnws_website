import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import HandmadeMaterial from "@/models/HandmadeMaterial";
import { uploadToCloudinary } from "@/lib/cloudinary";

// GET all handmade materials
export async function GET() {
    try {
        await connectDB();
        const materials = await HandmadeMaterial.find({}).sort({ createdAt: -1 });
        return NextResponse.json(materials, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST a new handmade material
export async function POST(req: Request) {
    try {
        await connectDB();
        const data = await req.json();

        if (!data.name || !data.description) {
            return NextResponse.json({ error: "Missing required fields: name or description" }, { status: 400 });
        }

        // Upload image to Cloudinary if provided as a Base64 data URI
        if (data.image && data.image.startsWith("data:")) {
            try {
                const cloudinaryUrl = await uploadToCloudinary(data.image, "handmade_materials");
                data.image = cloudinaryUrl;
            } catch (err: any) {
                console.error("Cloudinary upload failed for handmade material. Saving Base64 fallback.", err);
            }
        }

        const newMaterial = await HandmadeMaterial.create(data);
        return NextResponse.json(newMaterial, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
