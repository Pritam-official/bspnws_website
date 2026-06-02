import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";
import { verifyCaptcha } from "@/lib/captcha";

export async function POST(req: Request) {
    try {
        const { phone, membershipCode, password, role, captchaAnswer, captchaToken } = await req.json();

        if (!phone || !membershipCode || !password) {
            return NextResponse.json({ error: "Missing identity or password" }, { status: 400 });
        }

        if (!captchaAnswer || !captchaToken) {
            return NextResponse.json({ error: "Captcha is required" }, { status: 400 });
        }

        if (!verifyCaptcha(captchaToken, captchaAnswer)) {
            return NextResponse.json({ error: "Incorrect or expired captcha" }, { status: 400 });
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
                phone: user.phone,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                profilePic: user.profilePic,
            },
        }, { status: 200 });

    } catch (error: any) {
        console.error("Login error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
