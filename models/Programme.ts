import mongoose, { Schema, model, models } from "mongoose";

const ProgrammeSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Please provide the programme title"],
        },
        shortDescription: {
            type: String,
            required: [true, "Please provide a short description"],
        },
        fullDescription: {
            type: String,
            required: [true, "Please provide the full description"],
        },
        date: {
            type: String,
            required: [true, "Please provide the programme date"],
        },
        location: {
            type: String,
            required: [true, "Please provide the programme location/venue"],
        },
        image: {
            type: String, // Stores Cloudinary secure URL
            required: false,
        },
        type: {
            type: String,
            enum: ["recently-held", "upcoming"],
            required: [true, "Please specify the programme type (recently-held or upcoming)"],
        },
    },
    { timestamps: true }
);

const Programme = models.Programme || model("Programme", ProgrammeSchema);

export default Programme;
