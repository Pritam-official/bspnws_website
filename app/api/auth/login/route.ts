import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { phone, membershipCode, password, role } = await req.json();

        if (!phone || !membershipCode || !password) {
            return NextResponse.json({ error: "Missing identity or password" }, { status: 400 });
        }

        await connectDB();

        // Determine which model/collection to search based on role
        const Model = role === "admin" ? Admin : User;

        // Find user by phone and membership code in the appropriate collection
        const user = await Model.findOne({ phone, membershipCode });
        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        return NextResponse.json({
            message: "Login successful",
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
        }, { status: 200 });

    } catch (error: any) {
        console.error("Login error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
