import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

// Helper function to robustly load Cloudinary credentials supporting:
// 1. Standard environment variable names.
// 2. Fallback direct parsing of the local .env file in case keys contain spaces (e.g. "Cloud Name ", "API Key").
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

export async function POST(req: NextRequest) {
    try {
        const { image } = await req.json();

        if (!image) {
            return NextResponse.json(
                { success: false, message: "No image base64 data provided." },
                { status: 400 }
            );
        }

        // Load credentials dynamically to ensure environment variables are fresh
        const { cloudName, apiKey, apiSecret } = loadCloudinaryConfig();

        if (!cloudName || !apiKey || !apiSecret) {
            console.error("Cloudinary credentials missing. Configured values:", {
                cloudName: !!cloudName,
                apiKey: !!apiKey,
                apiSecret: !!apiSecret
            });
            return NextResponse.json(
                { success: false, message: "Cloudinary credentials are not properly configured on the server." },
                { status: 500 }
            );
        }

        // Configure cloudinary v2 SDK
        cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret,
            secure: true,
        });

        // Upload image to Cloudinary (will support any data URI format like PNG, JPG, WEBP)
        const uploadResponse = await cloudinary.uploader.upload(image, {
            folder: "volunteer_membership_receipts",
            resource_type: "image",
        });

        return NextResponse.json({
            success: true,
            message: "Receipt uploaded successfully to Cloudinary!",
            url: uploadResponse.secure_url,
        });
    } catch (error: any) {
        console.error("Cloudinary upload error:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Cloudinary upload failed." },
            { status: 500 }
        );
    }
}
