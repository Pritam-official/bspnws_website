import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ProjectOverviewVideo from "@/models/ProjectOverviewVideo";
import { uploadVideoToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";

export const dynamic = 'force-dynamic';
// GET all project overview videos
export async function GET() {
    try {
        await connectDB();
        const videos = await ProjectOverviewVideo.find({}).sort({ createdAt: -1 });
        return NextResponse.json(videos, { status: 200 });
    } catch (error: any) {
        console.error("GET project-overview error:", error);
        return NextResponse.json({ error: error.message || "Failed to fetch overview videos" }, { status: 500 });
    }
}

// POST new project overview video
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const data = await req.json();
        const { title, video } = data;

        if (!video) {
            return NextResponse.json({ error: "Missing required field (video)" }, { status: 400 });
        }

        if (!video.startsWith("data:video/")) {
            // Validate if it is a video data URI format or base64
            if (!video.startsWith("data:") && !video.includes(";base64,")) {
                return NextResponse.json({ error: "Invalid video format. Expected Base64 video data URI." }, { status: 400 });
            }
        }

        // Upload video to Cloudinary
        const uploadResult = await uploadVideoToCloudinary(video, "bspnws_project_overview/videos");

        // Save record to database
        const newVideo = await ProjectOverviewVideo.create({
            title: title || "Overview Video",
            videoUrl: uploadResult.secureUrl,
            publicId: uploadResult.publicId,
        });

        return NextResponse.json(newVideo, { status: 201 });
    } catch (error: any) {
        console.error("POST project-overview error:", error);
        return NextResponse.json({ error: error.message || "Failed to upload overview video" }, { status: 500 });
    }
}

// DELETE a project overview video
export async function DELETE(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Video ID is required" }, { status: 400 });
        }

        // Find the video in database first
        const video = await ProjectOverviewVideo.findById(id);
        if (!video) {
            return NextResponse.json({ error: "Video not found" }, { status: 404 });
        }

        // Delete from Cloudinary
        if (video.publicId) {
            try {
                await deleteFromCloudinary(video.publicId, "video");
            } catch (cloudinaryErr) {
                console.error("Failed to delete from Cloudinary, proceeding with DB deletion:", cloudinaryErr);
            }
        }

        // Delete from DB
        await ProjectOverviewVideo.findByIdAndDelete(id);

        return NextResponse.json({ message: "Video deleted successfully" }, { status: 200 });
    } catch (error: any) {
        console.error("DELETE project-overview error:", error);
        return NextResponse.json({ error: error.message || "Failed to delete overview video" }, { status: 500 });
    }
}
