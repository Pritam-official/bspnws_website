import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import VolunteerAttendanceRecord from "@/models/VolunteerAttendanceRecord";

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const { sessionId, volunteerId, name, email, phoneNumber, status } = body;

        if (!sessionId || !email || !status) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check if session broadcast exists in the SAME table
        const session = await VolunteerAttendanceRecord.findOne({
            _id: sessionId,
            volunteerId: "SESSION_MASTER"
        });
        
        if (!session) {
            return NextResponse.json({ error: "Attendance session not found" }, { status: 404 });
        }

        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        
        if (session.createdAt < twentyFourHoursAgo) {
            return NextResponse.json({ error: "Attendance session has expired (24h limit)" }, { status: 400 });
        }

        // Check if volunteer already submitted for this session
        const existingRecord = await VolunteerAttendanceRecord.findOne({ 
            sessionId, 
            email,
            volunteerId: { $ne: "SESSION_MASTER" }
        });
        
        if (existingRecord) {
            return NextResponse.json({ error: "You have already submitted attendance for this session" }, { status: 400 });
        }

        const newRecord = await VolunteerAttendanceRecord.create({
            sessionId,
            volunteerId,
            projectName: session.projectName,
            venue: session.venue,
            name,
            email,
            phoneNumber,
            status,
        });

        return NextResponse.json({ message: "Attendance submitted successfully", record: newRecord }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const records = await VolunteerAttendanceRecord.find({ 
            email,
            volunteerId: { $ne: "SESSION_MASTER" } 
        }).sort({ submittedAt: -1 });

        return NextResponse.json(records, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
