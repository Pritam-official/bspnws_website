import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "@/lib/mongodb";
import GalleryImage from "@/models/GalleryImage";
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

// GET all images for admin dashboard
export async function GET() {
    try {
        await connectDB();
        const items = await GalleryImage.find({}).sort({ date: -1, createdAt: -1 });
        return NextResponse.json(items, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST new gallery item
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const data = await req.json();

        const { title, description, type, date, images } = data;

        if (!title || !description || !type || !date || !images || !Array.isArray(images) || images.length === 0) {
            return NextResponse.json({ error: "Missing required fields or images are empty" }, { status: 400 });
        }

        // Configure Cloudinary
        configureCloudinary();

        // Upload images to Cloudinary in parallel or sequential
        const uploadPromises = images.map(async (imgBase64: string) => {
            if (!imgBase64.startsWith("data:")) {
                throw new Error("Invalid image format. Expected Base64 data URI.");
            }
            const res = await cloudinary.uploader.upload(imgBase64, {
                folder: "bspnws_gallery",
                resource_type: "image",
            });
            return res.secure_url;
        });

        const imageUrls = await Promise.all(uploadPromises);

        const newItem = await GalleryImage.create({
            title,
            description,
            type,
            date,
            images: imageUrls,
        });

        return NextResponse.json(newItem, { status: 201 });
    } catch (error: any) {
        console.error("Gallery create error:", error);
        return NextResponse.json({ error: error.message || "Failed to create gallery item." }, { status: 500 });
    }
}

// PUT update gallery item
export async function PUT(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Gallery item ID is required" }, { status: 400 });
        }

        const data = await req.json();
        const { title, description, type, date, images } = data;

        if (!title || !description || !type || !date || !images || !Array.isArray(images) || images.length === 0) {
            return NextResponse.json({ error: "Missing required fields or images are empty" }, { status: 400 });
        }

        // Find the existing item
        const existingItem = await GalleryImage.findById(id);
        if (!existingItem) {
            return NextResponse.json({ error: "Gallery item not found" }, { status: 404 });
        }

        // Configure Cloudinary
        configureCloudinary();

        // Process images array: If it starts with "http", it is already uploaded. If "data:", upload it.
        const uploadPromises = images.map(async (imgStr: string) => {
            if (imgStr.startsWith("http")) {
                return imgStr;
            } else if (imgStr.startsWith("data:")) {
                const res = await cloudinary.uploader.upload(imgStr, {
                    folder: "bspnws_gallery",
                    resource_type: "image",
                });
                return res.secure_url;
            } else {
                throw new Error("Invalid image source format.");
            }
        });

        const finalImageUrls = await Promise.all(uploadPromises);

        existingItem.title = title;
        existingItem.description = description;
        existingItem.type = type;
        existingItem.date = date;
        existingItem.images = finalImageUrls;

        await existingItem.save();

        return NextResponse.json(existingItem, { status: 200 });
    } catch (error: any) {
        console.error("Gallery update error:", error);
        return NextResponse.json({ error: error.message || "Failed to update gallery item." }, { status: 500 });
    }
}

// DELETE gallery item
export async function DELETE(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Gallery item ID is required" }, { status: 400 });
        }

        const deletedItem = await GalleryImage.findByIdAndDelete(id);
        if (!deletedItem) {
            return NextResponse.json({ error: "Gallery item not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Gallery item deleted successfully" }, { status: 200 });
    } catch (error: any) {
        console.error("Gallery delete error:", error);
        return NextResponse.json({ error: error.message || "Failed to delete gallery item." }, { status: 500 });
    }
}
