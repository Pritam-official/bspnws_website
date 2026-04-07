import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
    {
        firstName: {
            type: String,
            required: [true, "Please provide a first name"],
        },
        lastName: {
            type: String,
            required: [true, "Please provide a last name"],
        },
        email: {
            type: String,
            required: [true, "Please provide an email"],
            unique: true,
        },
        phone: {
            type: String,
            required: [true, "Please provide a phone number"],
        },
        membershipCode: {
            type: String,
            required: [true, "Please provide a membership code"],
        },
        address: {
            type: String,
            required: false,
        },
        profilePic: {
            type: String,
            required: false,
        },
        password: {
            type: String,
            required: [true, "Please provide a password"],
        },
        role: {
            type: String,
            enum: ["user", "admin", "volunteer"],
            default: "volunteer",
        },
    },
    { timestamps: true }
);

// If the model already exists, use it; otherwise, create a new one.
const User = models.User || model("User", UserSchema);

export default User;
