import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import VolunteerMembership from "@/models/VolunteerMembership";

// POST – volunteer submits membership form
export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const { name, email, memberType, phoneNumber, date, membershipStatus, renewalMonth, renewalYear, paymentMethod, amount, receiptImage } =
            body;

        if (!name || !email || !memberType || !phoneNumber || !date || !membershipStatus || !renewalMonth || !renewalYear || !paymentMethod || !amount) {
            return NextResponse.json(
                { success: false, message: "All fields are required." },
                { status: 400 }
            );
        }

        // Proper validation for Email, Mobile Number, and Member Type
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, message: "Invalid email format." },
                { status: 400 }
            );
        }

        if (memberType !== "Normal Member" && memberType !== "Executive Member") {
            return NextResponse.json(
                { success: false, message: "Invalid member type." },
                { status: 400 }
            );
        }

        // Basic phone validation: non-empty, and containing digits
        const cleanPhone = phoneNumber.replace(/\s+/g, "");
        if (cleanPhone.length < 8) {
            return NextResponse.json(
                { success: false, message: "Invalid phone number format." },
                { status: 400 }
            );
        }

        const record = await VolunteerMembership.create({
            name,
            email,
            memberType,
            phoneNumber,
            date,
            membershipStatus,
            renewalMonth,
            renewalYear: Number(renewalYear),
            paymentMethod,
            amount: Number(amount),
            ...(receiptImage ? { receiptImage } : {}), // optional
        });

        return NextResponse.json(
            { success: true, message: "Membership submitted successfully!", data: record },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Membership POST error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

// GET – fetch membership records with optional filtering
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const phoneNumber = searchParams.get("phoneNumber");
        const year = searchParams.get("year");

        let query: any = {};
        if (phoneNumber) {
            query.phoneNumber = phoneNumber;
        }
        if (year) {
            // Regex to match the year at the start of the date string (YYYY-MM-DD format)
            query.date = { $regex: `^${year}` };
        }

        const records = await VolunteerMembership.find(query).sort({ submittedAt: -1 });

        return NextResponse.json({ success: true, data: records }, { status: 200 });
    } catch (error: any) {
        console.error("Membership GET error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
