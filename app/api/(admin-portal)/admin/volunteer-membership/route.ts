import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import VolunteerMembership from "@/models/VolunteerMembership";
import Volunteer from "@/models/Volunteer";

// GET – admin fetches all membership records, optionally filtered by ?month=April
export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const date = searchParams.get("date");

        const query: Record<string, any> = {};

        if (date && date !== "All") {
            query.date = date;
        }

        const records = await VolunteerMembership.find(query).sort({ submittedAt: -1 });

        // Fetch profile images from Volunteer table
        const emails = records.map((r: any) => r.email).filter(Boolean);
        const volunteers = await Volunteer.find({ email: { $in: emails } }).select("email profilePic").lean();
        const profilePicMap: Record<string, string> = {};
        volunteers.forEach((v: any) => {
            if (v.email) {
                profilePicMap[v.email.toLowerCase()] = v.profilePic || "";
            }
        });

        const recordsWithProfilePic = records.map((r: any) => {
            const emailKey = r.email ? r.email.toLowerCase() : "";
            return {
                ...r.toObject(),
                profilePic: emailKey ? (profilePicMap[emailKey] || "") : ""
            };
        });

        return NextResponse.json({ success: true, data: recordsWithProfilePic }, { status: 200 });
    } catch (error: any) {
        console.error("Admin membership GET error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

// DELETE – admin deletes a membership record
export async function DELETE(req: NextRequest) {
    try {
        await connectDB();

        let id = "";

        // Check query parameter
        const { searchParams } = new URL(req.url);
        id = searchParams.get("id") || "";

        // If not in query params, check JSON body
        if (!id) {
            try {
                const body = await req.json();
                id = body.id || "";
            } catch {
                // Ignore parse error
            }
        }

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Membership Record ID is required." },
                { status: 400 }
            );
        }

        const deletedRecord = await VolunteerMembership.findByIdAndDelete(id);

        if (!deletedRecord) {
            return NextResponse.json(
                { success: false, message: "Membership record not found." },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Membership record deleted successfully." },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Admin membership DELETE error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
