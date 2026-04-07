import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import VolunteerAttendanceRecord from "@/models/VolunteerAttendanceRecord";

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
        
        // Find all session broadcasts
        const sessions = await VolunteerAttendanceRecord.find({ 
            volunteerId: "SESSION_MASTER" 
        }).sort({ createdAt: -1 });
        
        // Fetch stats for each session broadcast
        const sessionsWithStats = await Promise.all(sessions.map(async (s) => {
            const records = await VolunteerAttendanceRecord.find({ 
                sessionId: s._id.toString(),
                volunteerId: { $ne: "SESSION_MASTER" } // Exclude the broadcast itself
            });
            
            const presentCount = records.filter(r => r.status === 'Present').length;
            const absentCount = records.filter(r => r.status === 'Absent').length;
            
            return {
                ...s.toObject(),
                stats: {
                    total: records.length,
                    present: presentCount,
                    absent: absentCount
                },
                records // Restore project records for the admin history view
            };
        }));

        return NextResponse.json(sessionsWithStats, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
