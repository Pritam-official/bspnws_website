import mongoose, { Schema, model, models } from "mongoose";

const OfficerSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide the officer's name"],
        },
        designation: {
            type: String,
            required: [true, "Please provide the officer's designation"],
        },
        joiningDate: {
            type: String,
            required: [true, "Please provide the joining date"],
        },
        image: {
            type: String, // Storing Base64 string for now
            required: false,
        },
    },
    { timestamps: true }
);

const Officer = models.Officer || model("Officer", OfficerSchema);

export default Officer;
