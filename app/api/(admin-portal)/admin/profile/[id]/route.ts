import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        const admin = await Admin.findById(id).select("-password");

        if (!admin) {
            return NextResponse.json({ error: "Admin not found" }, { status: 404 });
        }

        return NextResponse.json(admin, { status: 200 });
    } catch (error: any) {
        console.error("Admin profile fetch error:", error);
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

        // Allow updating core profile fields including phone, membershipCode, and profilePic for admins
        const { firstName, lastName, email, phone, membershipCode, profilePic } = body;

        const updateData: any = {};
        if (firstName) updateData.firstName = firstName;
        if (lastName) updateData.lastName = lastName;
        if (email) updateData.email = email;
        if (phone) updateData.phone = phone;
        if (membershipCode) updateData.membershipCode = membershipCode;

        if (profilePic) {
            if (profilePic.startsWith("data:")) {
                try {
                    const cloudinaryUrl = await uploadToCloudinary(profilePic, "admin_profiles");
                    updateData.profilePic = cloudinaryUrl;
                } catch (err: any) {
                    console.error("Cloudinary upload failed for admin profile. Saving Base64 fallback.", err);
                    updateData.profilePic = profilePic;
                }
            } else {
                updateData.profilePic = profilePic;
            }
        }

        const updatedAdmin = await Admin.findByIdAndUpdate(
            id,
            { $set: updateData },
            { returnDocument: 'after', runValidators: true }
        ).select("-password");

        if (!updatedAdmin) {
            return NextResponse.json({ error: "Admin not found" }, { status: 404 });
        }

        return NextResponse.json(updatedAdmin, { status: 200 });
    } catch (error: any) {
        console.error("Admin profile update error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
