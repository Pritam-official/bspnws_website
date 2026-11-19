import mongoose, { Schema, model, models } from "mongoose";

export interface IMonthlyReport {
    _id?: string;
    reportMonth: string; // e.g. "November 2026", "October 2026"
    dateOfEntry: string; // M/D/Y
    age: string;
    weight: number;
    height: number;
    muac: number;
    head: number;
    chest: number;
    anthropometricMeasurement: string;
    last14DaysIllness: string;
    ebf: string;
    immunization: string;
    remarks?: string;
    customRecoveryPercentage?: number;
    image?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IFollowUpRecord {
    date: string;
    weight: number;
    muac: number;
    anthropometricMeasurement?: string;
    remarks?: string;
}

export interface ISamMamChild {
    _id?: string;
    name: string;
    anthropometricMeasurement: string; // e.g. "SAM", "MAM", "Normal / Nourished", "Recovering"
    sex: "Male" | "Female" | "Other";
    dateOfEntry: string; // Format M/D/Y e.g. "03/15/2026"
    guardianName: string;
    dateOfBirth?: string;
    age: string; // e.g. "18 Months", "2 Yrs 3 Mos"
    weight: number; // in Kg
    height: number; // in cm
    muac: number; // Mid-Upper Arm Circumference in cm
    head: number; // Head circumference in cm
    chest: number; // Chest circumference in cm
    last14DaysIllness: string; // e.g. "None", "Fever", "Diarrhoea"
    ebf: string; // Exclusive Breastfeeding: Yes, No, Up to 6 Months
    immunization: string; // Complete, Partially Immunized, Age Appropriate, Pending
    remarks?: string;
    address: string;
    image?: string;
    reportMonth?: string; // Active/latest month e.g. "November 2026"
    childId?: string; // Reference to original child if this is a follow-up month record
    isFollowUpMonth?: boolean;

    // Array of all month-wise assessment reports for this child
    monthlyReports?: IMonthlyReport[];
    
    // Growth and Recovery tracking fields
    baselineWeight?: number;
    targetWeight?: number;
    baselineMuac?: number;
    targetMuac?: number;
    customRecoveryPercentage?: number; // Admin override if specified
    followUpHistory?: IFollowUpRecord[];
    
    createdAt?: Date;
    updatedAt?: Date;
}

const MonthlyReportSchema = new Schema<IMonthlyReport>(
    {
        reportMonth: { type: String, required: true, trim: true },
        dateOfEntry: { type: String, required: true },
        age: { type: String, required: true },
        weight: { type: Number, required: true },
        height: { type: Number, required: true },
        muac: { type: Number, required: true },
        head: { type: Number, required: true },
        chest: { type: Number, required: true },
        anthropometricMeasurement: { type: String, default: "SAM" },
        last14DaysIllness: { type: String, default: "None" },
        ebf: { type: String, default: "Yes" },
        immunization: { type: String, default: "Complete" },
        remarks: { type: String, default: "" },
        customRecoveryPercentage: { type: Number },
        image: { type: String, default: "" },
    },
    { timestamps: true }
);

const FollowUpSchema = new Schema(
    {
        date: { type: String, required: true },
        weight: { type: Number, required: true },
        muac: { type: Number, required: true },
        anthropometricMeasurement: { type: String },
        remarks: { type: String },
    },
    { _id: false }
);

const SamMamChildSchema = new Schema<ISamMamChild>(
    {
        name: {
            type: String,
            required: [true, "Child name is required"],
            trim: true,
        },
        anthropometricMeasurement: {
            type: String,
            required: [true, "Anthropometric measurement is required"],
            default: "SAM",
        },
        sex: {
            type: String,
            enum: ["Male", "Female", "Other"],
            required: [true, "Sex is required"],
        },
        dateOfEntry: {
            type: String,
            required: [true, "Date of entry (M/D/Y) is required"],
        },
        guardianName: {
            type: String,
            required: [true, "Guardian name is required"],
            trim: true,
        },
        dateOfBirth: {
            type: String,
            default: "",
        },
        age: {
            type: String,
            required: [true, "Age is required"],
        },
        weight: {
            type: Number,
            required: [true, "Weight (Kg) is required"],
        },
        height: {
            type: Number,
            required: [true, "Height (cm) is required"],
        },
        muac: {
            type: Number,
            required: [true, "MUAC (cm) is required"],
        },
        head: {
            type: Number,
            required: [true, "Head circumference (cm) is required"],
        },
        chest: {
            type: Number,
            required: [true, "Chest circumference (cm) is required"],
        },
        last14DaysIllness: {
            type: String,
            required: [true, "Last 14 days illness status is required"],
            default: "None",
        },
        ebf: {
            type: String,
            required: [true, "Exclusive Breastfeeding (EBF) status is required"],
            default: "Yes",
        },
        immunization: {
            type: String,
            required: [true, "Immunization status is required"],
            default: "Complete",
        },
        remarks: {
            type: String,
            default: "",
        },
        address: {
            type: String,
            required: [true, "Address is required"],
            trim: true,
        },
        image: {
            type: String,
            default: "",
        },
        reportMonth: {
            type: String,
            default: "",
            trim: true,
        },
        childId: {
            type: String,
            default: "",
        },
        isFollowUpMonth: {
            type: Boolean,
            default: false,
        },
        monthlyReports: [MonthlyReportSchema],
        baselineWeight: {
            type: Number,
        },
        targetWeight: {
            type: Number,
        },
        baselineMuac: {
            type: Number,
        },
        targetMuac: {
            type: Number,
            default: 12.5,
        },
        customRecoveryPercentage: {
            type: Number,
        },
        followUpHistory: [FollowUpSchema],
    },
    { timestamps: true }
);

const SamMamChild = models.SamMamChild || model<ISamMamChild>("SamMamChild", SamMamChildSchema);

export default SamMamChild;
