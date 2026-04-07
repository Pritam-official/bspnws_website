import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Admin from "@/models/Admin";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const { id } = params;

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
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();
        const { id } = params;
        const body = await req.json();

        // Allow updating core profile fields including phone and membershipCode for admins
        const { firstName, lastName, email, phone, membershipCode } = body;

        const updateData: any = {};
        if (firstName) updateData.firstName = firstName;
        if (lastName) updateData.lastName = lastName;
        if (email) updateData.email = email;
        if (phone) updateData.phone = phone;
        if (membershipCode) updateData.membershipCode = membershipCode;

        const updatedAdmin = await Admin.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
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
