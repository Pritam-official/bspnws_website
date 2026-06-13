import mongoose, { Schema, model, models } from "mongoose";

const ScholarshipSettingSchema = new Schema(
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

const ScholarshipSetting = models.ScholarshipSetting || model("ScholarshipSetting", ScholarshipSettingSchema);

export default ScholarshipSetting;
