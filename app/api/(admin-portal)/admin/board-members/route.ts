import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import BoardMember from "@/models/BoardMember";
import { uploadToCloudinary } from "@/lib/cloudinary";

// GET all board members
export async function GET() {
    try {
        await connectDB();
        const members = await BoardMember.find({}).sort({ createdAt: -1 });
        return NextResponse.json(members, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST a new board member
export async function POST(req: Request) {
    try {
        await connectDB();
        const data = await req.json();

        if (!data.name || !data.designation) {
            return NextResponse.json({ error: "Missing required fields: name or designation" }, { status: 400 });
        }

        // Upload image to Cloudinary if provided as a Base64 data URI
        if (data.image && data.image.startsWith("data:")) {
            try {
                const cloudinaryUrl = await uploadToCloudinary(data.image, "board_members");
                data.image = cloudinaryUrl;
            } catch (err: any) {
                console.error("Cloudinary upload failed for board member. Saving Base64 fallback.", err);
            }
        }

        const newMember = await BoardMember.create(data);
        return NextResponse.json(newMember, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
