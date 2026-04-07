import mongoose, { Schema, model, models } from "mongoose";

const VolunteerAttendanceRecordSchema = new Schema(
    {
        sessionId: {
            type: String, // Can refer to the _id of the master session record in this SAME table
            required: false, // Optional for the master session broadcast itself
        },
        volunteerId: {
            type: String, // "SESSION_MASTER" for broadcasts, or actual ID for submissions
            required: true,
        },
        name: {
            type: String,
            required: false, // Optional for broadcasts
        },
        projectName: {
            type: String,
            required: [true, "Project name is required"],
        },
        venue: {
            type: String,
        },
        date: {
            type: String, // The event date (e.g. "2026-04-05")
        },
        email: {
            type: String,
            required: false, // Optional for broadcasts
        },
        phoneNumber: {
            type: String,
            required: false, // Optional for broadcasts
        },
        status: {
            type: String,
            required: true, // "Active" for broadcasts, "Present/Absent" for submissions
        },
        submittedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

// Force delete the model from cache to ensure the latest schema is used (helpful for HMR in development)
if (mongoose.models.VolunteerAttendanceRecord) {
    delete mongoose.models.VolunteerAttendanceRecord;
}

const VolunteerAttendanceRecord = model("VolunteerAttendanceRecord", VolunteerAttendanceRecordSchema);

export default VolunteerAttendanceRecord;
