import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import VolunteerAttendanceRecord from "@/models/VolunteerAttendanceRecord";
import Volunteer from "@/models/Volunteer";
import { settleAttendance } from "@/lib/attendance-logic";

export async function PATCH(req: NextRequest) {
    try {
        await connectDB();
        const { sessionId } = await req.json();

        if (!sessionId) {
            return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
        }

        // Trigger settlement for this specific session
        const result = await settleAttendance(sessionId);

        if (result.settled === 0) {
            return NextResponse.json({ error: "Session not found or already settled" }, { status: 404 });
        }

        return NextResponse.json({ 
            message: "Session closed and settled successfully", 
            ...result 
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const { projectName, description, venue, date } = body;

        if (!projectName) {
            return NextResponse.json({ error: "Project name is required" }, { status: 400 });
        }

        // Store the session broadcast in the SAME table
        const newSessionRecord = await VolunteerAttendanceRecord.create({
            projectName,
            venue,
            date, // Save the event date
            status: "Active", // A session broadcast is Active by default
            volunteerId: "SESSION_MASTER", // Discriminator for session broadcasts
            submittedAt: new Date(), // Use this as the session start time
        });

        return NextResponse.json({ message: "Attendance session broadcasted", session: newSessionRecord }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectDB();

        // Find all session broadcasts (Active + Expired), sorted newest first
        const sessions = await VolunteerAttendanceRecord.find({
            volunteerId: "SESSION_MASTER"
        }).sort({ createdAt: -1 });

        // Find all attendance submissions across all sessions
        const allRecords = await VolunteerAttendanceRecord.find({
            volunteerId: { $ne: "SESSION_MASTER" }
        }).lean();

        // Get all unique volunteer emails
        const emails = Array.from(new Set(allRecords.map((r: any) => r.email).filter(Boolean)));

        // Fetch all matching volunteers to get profilePic
        const volunteers = await Volunteer.find({ email: { $in: emails } }).select("email profilePic").lean();
        const profilePicMap: Record<string, string> = {};
        volunteers.forEach((v: any) => {
            if (v.email) {
                profilePicMap[v.email.toLowerCase()] = v.profilePic || "";
            }
        });

        // Group records by sessionId and assign profilePic
        const recordsBySession: Record<string, any[]> = {};
        allRecords.forEach((r: any) => {
            const emailKey = r.email ? r.email.toLowerCase() : "";
            const recordWithPic = {
                ...r,
                profilePic: emailKey ? (profilePicMap[emailKey] || "") : ""
            };
            if (!recordsBySession[r.sessionId]) {
                recordsBySession[r.sessionId] = [];
            }
            recordsBySession[r.sessionId].push(recordWithPic);
        });

        // Map sessions with stats and their records
        const sessionsWithStats = sessions.map((s) => {
            const records = recordsBySession[s._id.toString()] || [];
            const presentCount = records.filter(r => r.status === 'Present').length;
            const absentCount = records.filter(r => r.status === 'Absent').length;

            return {
                ...s.toObject(),
                status: s.status,
                settledAt: s.settledAt || null,
                stats: {
                    total: records.length,
                    present: presentCount,
                    absent: absentCount
                },
                records // Full record list with profilePic for the admin history view
            };
        });

        return NextResponse.json(sessionsWithStats, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
