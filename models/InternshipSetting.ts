import mongoose, { Schema, model, models } from "mongoose";

const InternshipSettingSchema = new Schema(
    {
        isOpen: {
            type: Boolean,
            default: false,
        },
        endDate: {
            type: Date,
            required: false,
        },
        announcementMessage: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

const InternshipSetting = models.InternshipSetting || model("InternshipSetting", InternshipSettingSchema);

export default InternshipSetting;
