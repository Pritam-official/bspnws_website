import mongoose, { Schema, model, models } from "mongoose";

const ReviewSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide your name"],
            trim: true,
        },
        rating: {
            type: Number,
            required: [true, "Please select a rating"],
            min: [1, "Rating must be at least 1 star"],
            max: [5, "Rating cannot be more than 5 stars"],
        },
        comment: {
            type: String,
            required: [true, "Please write a review comment"],
            trim: true,
        },
        status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected"],
            default: "Pending",
        },
        isSharedOnGoogle: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Review = models.Review || model("Review", ReviewSchema);

export default Review;
