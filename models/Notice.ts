import mongoose, { Schema, model, models } from "mongoose";

const NoticeSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Please provide the notice title"],
        },
        file: {
            type: String, // Base64 string
            required: [true, "Please provide a file (PDF or Image)"],
        },
        message: {
            type: String,
            required: false,
        },
        fileType: {
            type: String,
            enum: ["PDF", "Image"],
            required: [true, "Please specify the file type"],
        },
        date: {
            type: String,
            required: [true, "Please provide the date"],
        },
    },
    { timestamps: true }
);

const Notice = models.Notice || model("Notice", NoticeSchema);

export default Notice;
