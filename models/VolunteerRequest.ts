import mongoose, { Schema, model, models } from "mongoose";

const VolunteerRequestSchema = new Schema(
    {
        fullName: {
            type: String,
            required: [true, "Please provide the volunteer's name"],
        },
        email: {
            type: String,
            required: [true, "Please provide the email"],
        },
        phoneNumber: {
            type: String,
            required: [true, "Please provide the phone number"],
        },
        address: {
            type: String,
            required: [true, "Please provide the address"],
        },
        profilePic: {
            type: String, // Base64 string
            required: false,
        },
        whyJoin: {
            type: String,
            required: false,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
    },
    { timestamps: true }
);

const VolunteerRequest = models.VolunteerRequest || model("VolunteerRequest", VolunteerRequestSchema);

export default VolunteerRequest;
