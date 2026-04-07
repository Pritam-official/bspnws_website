import mongoose, { Schema, model, models } from "mongoose";

const ProjectSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide the project name"],
        },
        description: {
            type: String,
            required: [true, "Please provide the project description"],
        },
        images: {
            type: [String], // Array of Base64 strings
            required: false,
        },
        pdf: {
            type: String, // Base64 string for PDF
            required: false,
        },
    },
    { timestamps: true }
);

const Project = models.Project || model("Project", ProjectSchema);

export default Project;
