import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import BoardMember from "@/models/BoardMember";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;

        const deletedMember = await BoardMember.findByIdAndDelete(id);

        if (!deletedMember) {
            return NextResponse.json({ error: "Board member not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Board member deleted successfully" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const data = await req.json();

        if (!data.name || !data.designation) {
            return NextResponse.json({ error: "Missing required fields: name or designation" }, { status: 400 });
        }

        // If a new base64 image is uploaded, send it to Cloudinary
        if (data.image && data.image.startsWith("data:")) {
            try {
                const cloudinaryUrl = await uploadToCloudinary(data.image, "board_members");
                data.image = cloudinaryUrl;
            } catch (err: any) {
                console.error("Cloudinary upload failed during board member update. Saving Base64 fallback.", err);
            }
        }

        const updatedMember = await BoardMember.findByIdAndUpdate(
            id,
            {
                name: data.name,
                designation: data.designation,
                image: data.image,
                joiningDate: data.joiningDate
            },
            { returnDocument: 'after', runValidators: true }
        );

        if (!updatedMember) {
            return NextResponse.json({ error: "Board member not found" }, { status: 404 });
        }

        return NextResponse.json(updatedMember, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

