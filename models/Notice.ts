import mongoose, { Schema, model, models } from "mongoose";

const NoticeSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Please provide the notice title"],
        },
        file: {
            type: String, // Base64 string or Drive URL
            required: false,
        },
        message: {
            type: String,
            required: false,
        },
        fileType: {
            type: String,
            enum: ["PDF", "Image", "None"],
            default: "None",
            required: false,
        },
        date: {
            type: String,
            required: [true, "Please provide the date"],
        },
        targetAudience: {
            type: String,
            enum: ["all", "volunteer", "staff"],
            default: "all",
        },
        status: {
            type: String,
            enum: ["draft", "published"],
            default: "published",
        },
    },
    { timestamps: true }
);

const Notice = models.Notice || model("Notice", NoticeSchema);

export default Notice;
