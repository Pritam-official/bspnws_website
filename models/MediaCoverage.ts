import mongoose, { Schema, model, models } from "mongoose";

const MediaCoverageSchema = new Schema(
    {
        type: {
            type: String,
            required: [true, "Please specify the media item type"],
            enum: ["outlet", "coverage"], // "outlet" for channel logo, "coverage" for news images
        },
        title: {
            type: String,
            required: [true, "Please provide the title or news outlet name"],
        },
        image: {
            type: String, // Stores Cloudinary secure URL or base64 fallback
            required: [true, "Please upload an image/logo"],
        },
    },
    { timestamps: true }
);

const MediaCoverage = models.MediaCoverage || model("MediaCoverage", MediaCoverageSchema);

export default MediaCoverage;
