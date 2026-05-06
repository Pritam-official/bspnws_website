import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import VolunteerAttendanceRecord from "@/models/VolunteerAttendanceRecord";

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        // Find all session broadcasts created in the last 24 hours
        const activeSessions = await VolunteerAttendanceRecord.find({
            volunteerId: "SESSION_MASTER",
            createdAt: { $gt: twentyFourHoursAgo }
        }).sort({ createdAt: -1 });

        // For each active session broadcast, check if this volunteer already submitted a response
        const sessionsWithResponseStatus = await Promise.all(activeSessions.map(async (session) => {
            const hasSubmitted = await VolunteerAttendanceRecord.exists({
                sessionId: session._id.toString(),
                email: email,
                volunteerId: { $ne: "SESSION_MASTER" }
            });
            return {
                ...session.toObject(),
                hasSubmitted: !!hasSubmitted
            };
        }));
        
        return NextResponse.json(sessionsWithResponseStatus, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
