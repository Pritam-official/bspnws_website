import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import VolunteerAttendanceRecord from "@/models/VolunteerAttendanceRecord";

export async function PUT(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const recordId = body.recordId || body.id;
        const { status } = body;

        if (!recordId) {
            return NextResponse.json({ error: "Record ID is required" }, { status: 400 });
        }

        if (!status || !["Present", "Absent"].includes(status)) {
            return NextResponse.json(
                { error: "Invalid status. Must be either 'Present' or 'Absent'." },
                { status: 400 }
            );
        }

        // Find individual volunteer attendance record (exclude session broadcasts)
        const record = await VolunteerAttendanceRecord.findOne({
            _id: recordId,
            volunteerId: { $ne: "SESSION_MASTER" },
        });

        if (!record) {
            return NextResponse.json({ error: "Attendance record not found" }, { status: 404 });
        }

        record.status = status;
        await record.save();

        return NextResponse.json(
            { 
                message: `Attendance status updated to ${status} successfully`, 
                record 
            }, 
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error updating volunteer attendance status:", error);
        return NextResponse.json({ error: error.message || "Failed to update attendance status" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    return PUT(req);
}

