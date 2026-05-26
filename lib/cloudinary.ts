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

                        if (k === "Cloud Name" || k === "Cloud Name " || k === "CLOUDINARY_CLOUD_NAME") {
                            cloudName = v.toLowerCase();
                        } else if (k === "API Key" || k === "API Key " || k === "CLOUDINARY_API_KEY") {
                            apiKey = v;
                        } else if (k === "API Secret" || k === "API Secret " || k === "CLOUDINARY_API_SECRET") {
                            apiSecret = v;
                        }
                    }
                }
            }
        } catch (e) {
            console.error("Error reading fallback .env keys in lib/cloudinary:", e);
        }
    }

    return { cloudName, apiKey, apiSecret };
}

/**
 * Uploads a base64 encoded image string to Cloudinary.
 * Supports standard data URIs (e.g. "data:image/jpeg;base64,...") and raw base64.
 * 
 * @param base64Image The image in base64 format.
 * @param folderName The destination folder on Cloudinary.
 * @returns The secure URL link of the uploaded image.
 */
export async function uploadToCloudinary(base64Image: string, folderName: string): Promise<string> {
    if (!base64Image) {
        throw new Error("No image data provided for Cloudinary upload");
    }

    // Load credentials dynamically to ensure environment variables are fresh
    const { cloudName, apiKey, apiSecret } = loadCloudinaryConfig();

    if (!cloudName || !apiKey || !apiSecret) {
        throw new Error("Cloudinary credentials are not properly configured on the server");
    }

    // Configure Cloudinary SDK
    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
    });

    // Make sure we have a correct data URI prefix if it doesn't already exist
    let imagePayload = base64Image;
    if (!base64Image.startsWith("data:")) {
        imagePayload = `data:image/jpeg;base64,${base64Image}`;
    }

    try {
        const uploadResponse = await cloudinary.uploader.upload(imagePayload, {
            folder: folderName,
            resource_type: "image",
        });

        return uploadResponse.secure_url;
    } catch (error: any) {
        console.error(`Error uploading to Cloudinary in folder ${folderName}:`, error);
        throw new Error(error.message || "Cloudinary image upload failed");
    }
}
