import mongoose, { Schema, model, models } from "mongoose";

const StaffPayslipSchema = new Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
        },
        fullName: {
            type: String,
            required: [true, "Full name is required"],
        },
        month: {
            type: String, // format "Month YYYY" e.g., "June 2026"
            required: [true, "Month is required"],
        },
        basicSalary: {
            type: Number,
            required: [true, "Basic salary is required"],
        },
        allowance: {
            type: Number,
            default: 0,
        },
        deduction: {
            type: Number,
            default: 0,
        },
        netSalary: {
            type: Number,
            required: [true, "Net salary is required"],
        },
        status: {
            type: String,
            enum: ["Paid", "Pending"],
            default: "Paid",
        },
        pdfData: {
            type: String, // Base64 encoded PDF string
            required: false,
        },
        paymentMethod: {
            type: String,
            enum: ["Cash", "Cheque", "Bank Transfer"],
            default: "Cash",
        },
    },
    { timestamps: true }
);

const StaffPayslip = models.StaffPayslip || model("StaffPayslip", StaffPayslipSchema);

export default StaffPayslip;
