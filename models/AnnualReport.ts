import mongoose, { Schema, model, models } from "mongoose";

const AnnualReportSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Please provide the report title"],
        },
        type: {
            type: String,
            enum: ["Annual Reports", "Audit Reports", "IT Returns"],
            required: [true, "Please specify the report type"],
        },
        file: {
            type: String, // Base64 string
            required: [true, "Please provide the report file"],
        },
        date: {
            type: String,
            required: [true, "Please provide the date"],
        },
    },
    { timestamps: true }
);

const AnnualReport = models.AnnualReport || model("AnnualReport", AnnualReportSchema);

export default AnnualReport;
