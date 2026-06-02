import mongoose, { Schema, model, models } from "mongoose";

const StaffAttendanceSchema = new Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
        },
        fullName: {
            type: String,
            required: [true, "Full name is required"],
        },
        date: {
            type: String, // format YYYY-MM-DD
            required: [true, "Date is required"],
        },
        checkIn: {
            type: String, // format "09:00 AM" or similar
            required: false,
        },
        checkOut: {
            type: String, // format "05:00 PM" or similar
            required: false,
        },
        status: {
            type: String,
            enum: ["Present", "Absent", "Leave"],
            default: "Present",
        },
    },
    { timestamps: true }
);

const StaffAttendance = models.StaffAttendance || model("StaffAttendance", StaffAttendanceSchema);

export default StaffAttendance;
