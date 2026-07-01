import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;

        const project = await Project.findById(id);

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        return NextResponse.json(project, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;

        const deletedProject = await Project.findByIdAndDelete(id);

        if (!deletedProject) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Project deleted successfully" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const data = await req.json();

        if (!data.name || !data.description) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Upload images to Cloudinary if they are base64
        const uploadedImages = [];
        if (data.images && Array.isArray(data.images)) {
            for (const img of data.images) {
                if (img.startsWith("data:")) {
                    try {
                        const url = await uploadToCloudinary(img, "projects");
                        uploadedImages.push(url);
                    } catch (err: any) {
                        console.error("Cloudinary upload failed for project image during update. Storing base64 fallback.", err);
                        uploadedImages.push(img);
                    }
                } else {
                    uploadedImages.push(img);
                }
            }
        }

        const updatedProject = await Project.findByIdAndUpdate(
            id,
            {
                name: data.name,
                description: data.description,
                images: uploadedImages,
                pdf: data.pdf || null
            },
            { returnDocument: 'after' }
        );

        if (!updatedProject) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        return NextResponse.json(updatedProject, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
