import mongoose, { Schema, model, models } from "mongoose";

const BoardMemberSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide the board member's name"],
        },
        designation: {
            type: String,
            required: [true, "Please provide the board member's designation"],
        },
        joiningDate: {
            type: String,
            required: false,
            default: () => new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        },
        image: {
            type: String, // Stores Cloudinary secure URL
            required: false,
        },
    },
    { timestamps: true }
);

const BoardMember = models.BoardMember || model("BoardMember", BoardMemberSchema);

export default BoardMember;
