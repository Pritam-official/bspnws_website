import mongoose, { Schema, model, models } from "mongoose";

const HandmadeMaterialSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide the handmade material name"],
        },
        description: {
            type: String,
            required: [true, "Please provide a description"],
        },
        image: {
            type: String, // Stores Cloudinary secure URL
            required: false,
        },
    },
    { timestamps: true }
);

const HandmadeMaterial = models.HandmadeMaterial || model("HandmadeMaterial", HandmadeMaterialSchema);

export default HandmadeMaterial;
