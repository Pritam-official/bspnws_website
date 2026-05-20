import mongoose, { Schema, model, models } from "mongoose";

const VolunteerMembershipSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide the volunteer's name"],
        },
        email: {
            type: String,
            required: [true, "Please provide the email"],
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email address"],
        },
        memberType: {
            type: String,
            enum: {
                values: ["Normal Member", "Executive Member"],
                message: "{VALUE} is not a valid member type",
            },
            required: [true, "Please provide the member type"],
        },
        phoneNumber: {
            type: String,
            required: [true, "Please provide the phone number"],
        },
        date: {
            type: String, // e.g. "2026-04-08"
            required: [true, "Please provide the payment date"],
        },
        membershipStatus: {
            type: String,
            enum: ["monthly", "half-yearly", "yearly"],
            required: [true, "Please provide the membership status"],
        },
        renewalMonth: {
            type: String, // Month name e.g. "April"
            required: [true, "Please provide the renewal month"],
        },
        renewalYear: {
            type: Number,
            required: [true, "Please provide the renewal year"],
        },
        paymentMethod: {
            type: String,
            enum: ["online", "offline"],
            required: [true, "Please provide the payment method"],
        },
        amount: {
            type: Number,
            required: [true, "Please provide the amount paid"],
        },
        receiptImage: {
            type: String, // Base64 encoded image string
            required: false,
        },
        submittedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true, collection: "membership_volunteer" }
);

const VolunteerMembership =
    models.VolunteerMembership || model("VolunteerMembership", VolunteerMembershipSchema);

export default VolunteerMembership;
