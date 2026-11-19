import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SamMamChild from "@/models/SamMamChild";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { image, childId } = body;

        if (!image) {
            return NextResponse.json(
                { success: false, message: "No image data provided for upload" },
                { status: 400 }
            );
        }

        // Upload to Cloudinary under folder "sam_mam_children"
        const cloudinaryUrl = await uploadToCloudinary(image, "sam_mam_children");

        // If a childId was provided, update the database immediately
        let updatedChild = null;
        if (childId) {
            await connectDB();
            updatedChild = await SamMamChild.findByIdAndUpdate(
                childId,
                { image: cloudinaryUrl },
                { new: true }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Child image uploaded to Cloudinary and saved successfully",
            url: cloudinaryUrl,
            child: updatedChild,
        });
    } catch (error: any) {
        console.error("Error in sam-mam-children image upload:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Failed to upload image to Cloudinary" },
            { status: 500 }
        );
    }
}
