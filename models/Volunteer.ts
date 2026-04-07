import mongoose, { Schema, model, models } from "mongoose";

const VolunteerSchema = new Schema(
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
        approvedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const Volunteer = models.Volunteer || model("Volunteer", VolunteerSchema);

export default Volunteer;
