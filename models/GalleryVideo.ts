import mongoose, { Schema, model, models } from "mongoose";

const GalleryVideoSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Please provide the video title"],
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
        thumbnail: {
            type: String, // Cloudinary secure URL
            required: [true, "Please provide a thumbnail image URL"],
        },
        link: {
            type: String, // YouTube or Facebook video link
            required: [true, "Please provide the video link"],
        }
    },
    { timestamps: true }
);

const GalleryVideo = models.GalleryVideo || model("GalleryVideo", GalleryVideoSchema);

export default GalleryVideo;
