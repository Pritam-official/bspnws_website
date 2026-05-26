import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import HandmadeMaterial from "@/models/HandmadeMaterial";
import { uploadToCloudinary } from "@/lib/cloudinary";

// PUT/PATCH to update a handmade material
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const data = await req.json();

        // If a new base64 image is uploaded, send it to Cloudinary
        if (data.image && data.image.startsWith("data:")) {
            try {
                const cloudinaryUrl = await uploadToCloudinary(data.image, "handmade_materials");
                data.image = cloudinaryUrl;
            } catch (err: any) {
                console.error("Cloudinary upload failed during handmade material update. Saving Base64 fallback.", err);
            }
        }

        const updatedMaterial = await HandmadeMaterial.findByIdAndUpdate(id, data, { new: true, runValidators: true });

        if (!updatedMaterial) {
            return NextResponse.json({ error: "Material not found" }, { status: 404 });
        }

        return NextResponse.json(updatedMaterial, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE a handmade material
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;

        const deletedMaterial = await HandmadeMaterial.findByIdAndDelete(id);

        if (!deletedMaterial) {
            return NextResponse.json({ error: "Material not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Material deleted successfully" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
