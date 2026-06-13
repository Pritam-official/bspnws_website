import mongoose, { Schema, model, models } from "mongoose";

const ScholarshipApplicationSchema = new Schema(
    {
        fullName: {
            type: String,
            required: [true, "Please provide the student's full name"],
        },
        phoneNumber: {
            type: String,
            required: [true, "Please provide the phone number"],
        },
        email: {
            type: String,
            required: false,
        },
        address: {
            type: String,
            required: [true, "Please provide the address"],
        },
        date: {
            type: Date,
            required: [true, "Please provide the application date"],
        },
        fatherName: {
            type: String,
            required: [true, "Please provide the father's name"],
        },
        fatherOccupation: {
            type: String,
            required: [true, "Please provide the father's occupation"],
        },
        motherOccupation: {
            type: String,
            required: [true, "Please provide the mother's occupation"],
        },
        familyAnnualIncome: {
            type: Number,
            required: [true, "Please provide the family's annual income"],
        },
        studentName: {
            type: String,
            required: [true, "Please provide the student's name"],
        },
        schoolName: {
            type: String,
            required: [true, "Please provide the school name"],
        },
        board: {
            type: String,
            required: [true, "Please select the board"],
        },
        otherBoard: {
            type: String,
            required: false,
        },
        examination: {
            type: String,
            required: [true, "Please select the examination"],
        },
        obtainedMarks: {
            type: Number,
            required: [true, "Please provide the obtained marks"],
        },
        incomeCertificate: {
            type: String,
            required: [true, "Please upload the income certificate"],
        },
        resultCopy: {
            type: String,
            required: [true, "Please upload the result copy"],
        },
        whyApply: {
            type: String,
            required: false,
        },
        status: {
            type: String,
            enum: ['Pending', 'Under Review', 'Approved', 'Rejected'],
            default: 'Pending',
        },
    },
    { timestamps: true }
);

const ScholarshipApplication = models.ScholarshipApplication || model("ScholarshipApplication", ScholarshipApplicationSchema);

export default ScholarshipApplication;
