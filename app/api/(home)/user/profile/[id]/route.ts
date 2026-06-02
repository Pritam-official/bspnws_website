import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        const user = await User.findById(id).select("-password");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error: any) {
        console.error("Profile fetch error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await req.json();

        // Security: Don't allow updating password or role through this endpoint
        const { firstName, lastName, phone, address, profilePic } = body;

        const updateData: any = {};
        if (firstName) updateData.firstName = firstName;
        if (lastName) updateData.lastName = lastName;
        if (phone) updateData.phone = phone;
        if (address) updateData.address = address;
        
        if (profilePic) {
            if (profilePic.startsWith("data:")) {
                try {
                    const cloudinaryUrl = await uploadToCloudinary(profilePic, "volunteer_profiles");
                    updateData.profilePic = cloudinaryUrl;
                } catch (err: any) {
                    console.error("Cloudinary upload failed for user profile update. Saving Base64 fallback.", err);
                    updateData.profilePic = profilePic;
                }
            } else {
                updateData.profilePic = profilePic;
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $set: updateData },
            { returnDocument: 'after', runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error: any) {
        console.error("Profile update error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
