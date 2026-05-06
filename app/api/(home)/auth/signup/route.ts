import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { firstName, lastName, email, phone, membershipCode, password, role } = await req.json();

        if (!firstName || !lastName || !email || !phone || !membershipCode || !password) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        await connectDB();

        // Determine which model/collection to use based on role
        const Model = role === "admin" ? Admin : User;

        // Check if user already exists in the respective collection
        const userExists = await Model.findOne({ email });
        if (userExists) {
            return NextResponse.json({ error: "User already exists with this email" }, { status: 400 });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create the user in the appropriate collection
        const newUser = await Model.create({
            firstName,
            lastName,
            email,
            phone,
            membershipCode,
            password: hashedPassword,
            role: role === "admin" ? "admin" : "volunteer",
        });

        return NextResponse.json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                role: newUser.role,
            },
        }, { status: 201 });

    } catch (error: any) {
        console.error("Signup error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
