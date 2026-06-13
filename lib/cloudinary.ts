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

/**
 * Uploads a base64 encoded video string to Cloudinary.
 * Supports standard data URIs (e.g. "data:video/mp4;base64,...") and raw base64.
 * 
 * @param base64Video The video in base64 format.
 * @param folderName The destination folder on Cloudinary.
 * @returns The secure URL and public ID of the uploaded video.
 */
export async function uploadVideoToCloudinary(
    base64Video: string, 
    folderName: string
): Promise<{ secureUrl: string; publicId: string }> {
    if (!base64Video) {
        throw new Error("No video data provided for Cloudinary upload");
    }

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

    let videoPayload = base64Video;
    if (!base64Video.startsWith("data:")) {
        // Fallback guess (mp4) if no mime prefix is included
        videoPayload = `data:video/mp4;base64,${base64Video}`;
    }

    try {
        const uploadResponse = await cloudinary.uploader.upload(videoPayload, {
            folder: folderName,
            resource_type: "video",
        });

        return {
            secureUrl: uploadResponse.secure_url,
            publicId: uploadResponse.public_id,
        };
    } catch (error: any) {
        console.error(`Error uploading video to Cloudinary in folder ${folderName}:`, error);
        throw new Error(error.message || "Cloudinary video upload failed");
    }
}

/**
 * Deletes an asset (image or video) from Cloudinary.
 * 
 * @param publicId The public ID of the asset.
 * @param resourceType The type of asset ("image" or "video").
 * @returns The deletion result.
 */
export async function deleteFromCloudinary(
    publicId: string, 
    resourceType: "image" | "video" = "image"
): Promise<any> {
    if (!publicId) {
        throw new Error("No public ID provided for Cloudinary deletion");
    }

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

    try {
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
        });
        return result;
    } catch (error: any) {
        console.error(`Error deleting ${resourceType} from Cloudinary with publicId ${publicId}:`, error);
        throw new Error(error.message || "Cloudinary deletion failed");
    }
}

/**
 * Uploads a base64 encoded file string (images or PDFs) to Cloudinary.
 * Uses resource_type: "auto" to handle PDFs and documents correctly.
 * 
 * @param base64File The file in base64 format.
 * @param folderName The destination folder on Cloudinary.
 * @returns The secure URL link of the uploaded file.
 */
export async function uploadDocToCloudinary(base64File: string, folderName: string): Promise<string> {
    if (!base64File) {
        throw new Error("No file data provided for Cloudinary upload");
    }

    const { cloudName, apiKey, apiSecret } = loadCloudinaryConfig();

    if (!cloudName || !apiKey || !apiSecret) {
        throw new Error("Cloudinary credentials are not properly configured on the server");
    }

    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
    });

    let filePayload = base64File;
    if (!base64File.startsWith("data:")) {
        filePayload = `data:image/jpeg;base64,${base64File}`;
    }

    try {
        const uploadResponse = await cloudinary.uploader.upload(filePayload, {
            folder: folderName,
            resource_type: "auto",
        });

        return uploadResponse.secure_url;
    } catch (error: any) {
        console.error(`Error uploading file to Cloudinary in folder ${folderName}:`, error);
        throw new Error(error.message || "Cloudinary file upload failed");
    }
}

