import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { membershipCode, phone, email, newPassword, confirmPassword } = await req.json();

        // 1. Basic field presence checks
        if (!membershipCode || !phone || !email || !newPassword || !confirmPassword) {
            return NextResponse.json(
                { error: "Something went wrong. Please try again" },
                { status: 400 }
            );
        }

        // 2. Validate Password strength (Weak Password rule)
        if (newPassword.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters" },
                { status: 400 }
            );
        }

        // 3. Confirm Password match
        if (newPassword !== confirmPassword) {
            return NextResponse.json(
                { error: "Confirm password does not match" },
                { status: 400 }
            );
        }

        await connectDB();

        // 4. Step 1 — Check Membership Code
        // Search User (volunteer) first, then Admin collection
        let user = await User.findOne({ membershipCode });
        let detectedRole = "volunteer";

        if (!user) {
            user = await Admin.findOne({ membershipCode });
            detectedRole = "admin";
        }

        if (!user) {
            return NextResponse.json(
                { error: "Membership code not found" },
                { status: 404 }
            );
        }

        // 5. Step 2 — Verify User Details (Email and Phone match on the same record)
        // Check Email
        if (user.email.toLowerCase() !== email.toLowerCase()) {
            return NextResponse.json(
                { error: "Email does not match our records" },
                { status: 400 }
            );
        }

        // Check Phone
        if (user.phone !== phone) {
            return NextResponse.json(
                { error: "Phone number does not match our records" },
                { status: 400 }
            );
        }

        // 6. Step 4 — Update Password
        // Hash the new password securely
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        
        user.password = hashedPassword;
        
        // Save the updated record in the database (timestamps will automatically update updatedAt)
        await user.save();

        return NextResponse.json(
            { 
                message: "Password reset successful", 
                role: detectedRole 
            }, 
            { status: 200 }
        );

    } catch (error: any) {
        console.error("Forgot password reset error:", error);
        return NextResponse.json(
            { error: "Something went wrong. Please try again" },
            { status: 500 }
        );
    }
}
