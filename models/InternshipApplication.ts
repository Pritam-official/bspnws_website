import mongoose, { Schema, model, models } from "mongoose";

const InternshipApplicationSchema = new Schema(
    {
        fullName: {
            type: String,
            required: [true, "Please provide the applicant's full name"],
        },
        dob: {
            type: Date,
            required: [true, "Please provide the date of birth"],
        },
        gender: {
            type: String,
            required: [true, "Please select the gender"],
        },
        phoneNumber: {
            type: String,
            required: [true, "Please provide the phone number"],
        },
        email: {
            type: String,
            required: [true, "Please provide the Gmail address"],
        },
        address: {
            type: String,
            required: [true, "Please provide the address"],
        },
        fatherName: {
            type: String,
            required: [true, "Please provide the father's name"],
        },
        fatherOccupation: {
            type: String,
            required: [true, "Please provide the father's occupation"],
        },
        educationQualification: {
            type: String,
            required: [true, "Please select the education qualification"],
        },
        otherQualification: {
            type: String,
            required: false,
        },
        schoolName: {
            type: String,
            required: false,
        },
        board: {
            type: String,
            required: false,
        },
        otherBoard: {
            type: String,
            required: false,
        },
        collegeName: {
            type: String,
            required: false,
        },
        universityName: {
            type: String,
            required: false,
        },
        currentSemesterYear: {
            type: String,
            required: false,
        },
        stream: {
            type: String,
            required: false,
        },
        areaOfInterest: {
            type: String,
            required: [true, "Please select the area of interest"],
        },
        otherAreaOfInterest: {
            type: String,
            required: false,
        },
        duration: {
            type: String,
            required: [true, "Please select the internship duration"],
        },
        skills: {
            type: String,
            required: false,
        },
        whyJoin: {
            type: String,
            required: false,
        },
        resume: {
            type: String,
            required: [true, "Please upload the resume/CV"],
        },
        status: {
            type: String,
            enum: ['Pending', 'Under Review', 'Approved', 'Rejected'],
            default: 'Pending',
        },
    },
    { timestamps: true }
);

const InternshipApplication = models.InternshipApplication || model("InternshipApplication", InternshipApplicationSchema);

export default InternshipApplication;
