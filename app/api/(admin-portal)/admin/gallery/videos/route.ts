import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "@/lib/mongodb";
import GalleryVideo from "@/models/GalleryVideo";
import fs from "fs";
import path from "path";

// Helper to load Cloudinary credentials dynamically
function loadCloudinaryConfig() {
    let cloudName = process.env.CLOUDINARY_CLOUD_NAME ? process.env.CLOUDINARY_CLOUD_NAME.toLowerCase() : undefined;
    let apiKey = process.env.CLOUDINARY_API_KEY;
    let apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
        try {
            const envPath = path.join(process.cwd(), ".env");
            if (fs.existsSync(envPath)) {
                const envContent = fs.readFileSync(envPath, "utf8");
                const lines = envContent.split("\n");
                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed || trimmed.startsWith("#")) continue;
                    const eqIdx = trimmed.indexOf("=");
                    if (eqIdx !== -1) {
                        const k = trimmed.substring(0, eqIdx).trim();
                        const v = trimmed.substring(eqIdx + 1).trim();

                        if (k === "Cloud Name" || k === "Cloud Name ") {
                            cloudName = v.toLowerCase();
                        } else if (k === "API Key" || k === "API Key ") {
                            apiKey = v;
                        } else if (k === "API Secret" || k === "API Secret ") {
                            apiSecret = v;
                        }
                    }
                }
            }
        } catch (e) {
            console.error("Error reading fallback .env keys:", e);
        }
    }

    return { cloudName, apiKey, apiSecret };
}

// Helper to configure Cloudinary
function configureCloudinary() {
    const { cloudName, apiKey, apiSecret } = loadCloudinaryConfig();
    if (!cloudName || !apiKey || !apiSecret) {
        throw new Error("Cloudinary credentials are not properly configured on the server.");
    }
    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
    });
}

// GET all videos for admin dashboard
export async function GET() {
    try {
        await connectDB();
        const items = await GalleryVideo.find({}).sort({ date: -1, createdAt: -1 });
        return NextResponse.json(items, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST new gallery video
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const data = await req.json();

        const { title, type, date, thumbnail, link } = data;

        if (!title || !type || !date || !thumbnail || !link) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Configure Cloudinary
        configureCloudinary();

        let thumbnailUrl = thumbnail;
        if (thumbnail.startsWith("data:")) {
            const res = await cloudinary.uploader.upload(thumbnail, {
                folder: "bspnws_gallery/videos",
                resource_type: "image",
            });
            thumbnailUrl = res.secure_url;
        } else {
            return NextResponse.json({ error: "Invalid thumbnail format. Expected Base64 data URI." }, { status: 400 });
        }

        const newItem = await GalleryVideo.create({
            title,
            type,
            date,
            thumbnail: thumbnailUrl,
            link,
        });

        return NextResponse.json(newItem, { status: 201 });
    } catch (error: any) {
        console.error("Video create error:", error);
        return NextResponse.json({ error: error.message || "Failed to create video item." }, { status: 500 });
    }
}

// PUT update gallery video
export async function PUT(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Gallery video ID is required" }, { status: 400 });
        }

        const data = await req.json();
        const { title, type, date, thumbnail, link } = data;

        if (!title || !type || !date || !thumbnail || !link) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Find the existing item
        const existingItem = await GalleryVideo.findById(id);
        if (!existingItem) {
            return NextResponse.json({ error: "Gallery video not found" }, { status: 404 });
        }

        // Configure Cloudinary
        configureCloudinary();

        let thumbnailUrl = thumbnail;
        if (thumbnail.startsWith("data:")) {
            const res = await cloudinary.uploader.upload(thumbnail, {
                folder: "bspnws_gallery/videos",
                resource_type: "image",
            });
            thumbnailUrl = res.secure_url;
        } else if (!thumbnail.startsWith("http")) {
            return NextResponse.json({ error: "Invalid thumbnail source format." }, { status: 400 });
        }

        existingItem.title = title;
        existingItem.type = type;
        existingItem.date = date;
        existingItem.thumbnail = thumbnailUrl;
        existingItem.link = link;

        await existingItem.save();

        return NextResponse.json(existingItem, { status: 200 });
    } catch (error: any) {
        console.error("Video update error:", error);
        return NextResponse.json({ error: error.message || "Failed to update video item." }, { status: 500 });
    }
}

// DELETE gallery video
export async function DELETE(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Gallery video ID is required" }, { status: 400 });
        }

        const deletedItem = await GalleryVideo.findByIdAndDelete(id);
        if (!deletedItem) {
            return NextResponse.json({ error: "Gallery video not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Gallery video deleted successfully" }, { status: 200 });
    } catch (error: any) {
        console.error("Video delete error:", error);
        return NextResponse.json({ error: error.message || "Failed to delete video item." }, { status: 500 });
    }
}
