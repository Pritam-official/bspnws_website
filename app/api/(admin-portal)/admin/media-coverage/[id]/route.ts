import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import MediaCoverage from "@/models/MediaCoverage";
import { uploadToCloudinary } from "@/lib/cloudinary";

// PUT/PATCH to update a media coverage item
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const data = await req.json();

        // If a new base64 image is uploaded, send it to Cloudinary
        if (data.image && data.image.startsWith("data:")) {
            try {
                const cloudinaryUrl = await uploadToCloudinary(data.image, "media_coverage");
                data.image = cloudinaryUrl;
            } catch (err: any) {
                console.error("Cloudinary upload failed during media coverage update. Saving Base64 fallback.", err);
            }
        }

        const updatedItem = await MediaCoverage.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true });

        if (!updatedItem) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }

        return NextResponse.json(updatedItem, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE a media coverage item
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;

        const deletedItem = await MediaCoverage.findByIdAndDelete(id);

        if (!deletedItem) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Item deleted successfully" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
