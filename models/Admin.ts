import mongoose, { Schema, model, models } from "mongoose";

const AdminSchema = new Schema(
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
        password: {
            type: String,
            required: [true, "Please provide a password"],
        },
        role: {
            type: String,
            default: "admin",
        },
    },
    { timestamps: true }
);

const Admin = models.Admin || model("Admin", AdminSchema);

export default Admin;
