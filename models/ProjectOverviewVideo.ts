import mongoose, { Schema, model, models } from "mongoose";

const ProjectOverviewVideoSchema = new Schema(
    {
        title: {
            type: String,
            required: false,
        },
        videoUrl: {
            type: String, // Cloudinary secure URL
            required: [true, "Please provide the video URL"],
        },
        publicId: {
            type: String, // Cloudinary public ID for deletion
            required: [true, "Please provide the video public ID"],
        },
    },
    { timestamps: true }
);

const ProjectOverviewVideo = models.ProjectOverviewVideo || model("ProjectOverviewVideo", ProjectOverviewVideoSchema);

export default ProjectOverviewVideo;
