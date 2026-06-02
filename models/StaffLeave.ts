import mongoose, { Schema, model, models } from "mongoose";

const StaffLeaveSchema = new Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
        },
        fullName: {
            type: String,
            required: [true, "Full name is required"],
        },
        leaveType: {
            type: String,
            enum: ["Casual Leave", "Sick Leave", "Emergency Leave"],
            required: [true, "Leave type is required"],
        },
        leaveDate: {
            type: String, // format YYYY-MM-DD
            required: false,
        },
        durationType: {
            type: String,
            enum: ["Full Day", "Half Day"],
            required: [true, "Duration type is required"],
        },
        fromTime: {
            type: String, // format HH:MM
            required: [true, "From time is required"],
        },
        toTime: {
            type: String, // format HH:MM
            required: [true, "To time is required"],
        },
        startDate: {
            type: String, // format YYYY-MM-DD
            required: [true, "Start date is required"],
        },
        endDate: {
            type: String, // format YYYY-MM-DD
            required: [true, "End date is required"],
        },
        reason: {
            type: String,
            required: [true, "Reason for leave is required"],
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        adminRemarks: {
            type: String,
            required: false,
            default: "",
        },
    },
    { timestamps: true }
);

const StaffLeave = models.StaffLeave || model("StaffLeave", StaffLeaveSchema);

export default StaffLeave;
