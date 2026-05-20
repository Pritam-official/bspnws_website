import connectDB from "@/lib/mongodb";
import VolunteerAttendanceRecord from "@/models/VolunteerAttendanceRecord";
import User from "@/models/User";

/**
 * Settles a single attendance session or all expired ones.
 * Marks non-submitters as "Absent".
 * 
 * @param sessionId Optional. If provided, settles this specific session.
 * @returns Object with stats
 */
export async function settleAttendance(sessionId?: string) {
    await connectDB();
    const now = new Date();

    let sessionsToSettle: any[] = [];

    if (sessionId) {
        // Manual settlement for a specific session
        const session = await VolunteerAttendanceRecord.findOne({
            _id: sessionId,
            volunteerId: "SESSION_MASTER",
            status: "Active"
        });
        if (session) {
            sessionsToSettle = [session];
        }
    } else {
        // Auto-settlement: Find all sessions > 24h old that are still Active
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        sessionsToSettle = await VolunteerAttendanceRecord.find({
            volunteerId: "SESSION_MASTER",
            status: "Active",
            createdAt: { $lt: twentyFourHoursAgo }
        });
    }

    if (sessionsToSettle.length === 0) {
        return { settled: 0, absentRecordsCreated: 0 };
    }

    // Step 1: Fetch all valid volunteer accounts from the User table
    // This ensures only "official" volunteers are processed
    const allVolunteers = await User.find({ role: "volunteer" }).lean();
    
    let totalAbsentCreated = 0;
    let totalSessionsSettled = 0;

    for (const session of sessionsToSettle) {
        const currentSessionId = session._id.toString();
        const sessionDate = session.date;

        // Step 2: Find all existing attendance records for this session
        // This includes both Present and Absent statuses
        const existingRecords = await VolunteerAttendanceRecord.find({
            sessionId: currentSessionId,
            volunteerId: { $ne: "SESSION_MASTER" }
        }).lean();

        // Step 3: Map existing submissions by email AND volunteerId for robust duplicate checking
        const submittedEmails = new Set(
            existingRecords.map((r: any) => r.email?.toLowerCase())
        );
        const submittedVolunteerIds = new Set(
            existingRecords.map((r: any) => r.volunteerId?.toString())
        );

        const absentRecords: any[] = [];
        for (const volunteer of allVolunteers) {
            const volunteerId = volunteer._id.toString();
            const volunteerEmail = (volunteer.email || "").toLowerCase();

            // Logic Check: 
            // 1. Check if an attendance record already exists for this sessionId + volunteerId
            // 2. Or if an attendance record already exists for this sessionId + email
            if (submittedVolunteerIds.has(volunteerId) || submittedEmails.has(volunteerEmail)) {
                continue; // Skip: already marked Present or Absent
            }

            // If no record exists, create an Absent entry
            absentRecords.push({
                sessionId: currentSessionId,
                volunteerId: volunteerId,
                name: `${volunteer.firstName} ${volunteer.lastName}`.trim(),
                projectName: session.projectName,
                venue: session.venue || "",
                date: sessionDate,
                email: volunteer.email,
                phoneNumber: volunteer.phone,
                status: "Absent",
                submittedAt: now,
            });
        }

        if (absentRecords.length > 0) {
            await VolunteerAttendanceRecord.insertMany(absentRecords);
            totalAbsentCreated += absentRecords.length;
        }

        // Step 4: Mark session as Expired (Settled)
        await VolunteerAttendanceRecord.findByIdAndUpdate(session._id, {
            status: "Expired",
            settledAt: now
        });

        totalSessionsSettled++;
    }

    return {
        settled: totalSessionsSettled,
        absentRecordsCreated: totalAbsentCreated
    };
}
