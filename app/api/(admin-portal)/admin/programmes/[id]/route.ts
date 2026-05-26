import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Programme from "@/models/Programme";
import { uploadToCloudinary } from "@/lib/cloudinary";

// GET a single programme by ID
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;

        const programme = await Programme.findById(id);

        if (!programme) {
            return NextResponse.json({ error: "Programme not found" }, { status: 404 });
        }

        return NextResponse.json(programme, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT/PATCH to update a programme
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const data = await req.json();

        // If a new base64 image is uploaded, send it to Cloudinary
        if (data.image && data.image.startsWith("data:")) {
            try {
                const cloudinaryUrl = await uploadToCloudinary(data.image, "programmes");
                data.image = cloudinaryUrl;
            } catch (err: any) {
                console.error("Cloudinary upload failed during programme update. Saving Base64 fallback.", err);
            }
        }

        const updatedProgramme = await Programme.findByIdAndUpdate(id, data, { new: true, runValidators: true });

        if (!updatedProgramme) {
            return NextResponse.json({ error: "Programme not found" }, { status: 404 });
        }

        return NextResponse.json(updatedProgramme, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE a programme
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;

        const deletedProgramme = await Programme.findByIdAndDelete(id);

        if (!deletedProgramme) {
            return NextResponse.json({ error: "Programme not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Programme deleted successfully" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
