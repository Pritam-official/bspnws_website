import mongoose, { Schema, model, models } from "mongoose";

const GalleryImageSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Please provide the gallery title"],
        },
        description: {
            type: String,
            required: [true, "Please provide the gallery description"],
        },
        type: {
            type: String,
            enum: ["Events", "Donations", "Guests", "Success Stories"],
            required: [true, "Please specify the type"],
        },
        date: {
            type: String,
            required: [true, "Please provide the date"],
        },
        images: {
            type: [String], // Array of Cloudinary secure URLs
            required: [true, "Please provide at least one image URL"],
        },
    },
    { timestamps: true }
);

const GalleryImage = models.GalleryImage || model("GalleryImage", GalleryImageSchema);

export default GalleryImage;
