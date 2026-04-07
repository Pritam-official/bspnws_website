import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";

// GET all projects
export async function GET() {
    try {
        await connectDB();
        const projects = await Project.find({}).sort({ createdAt: -1 });
        return NextResponse.json(projects, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST new project
export async function POST(req: Request) {
    try {
        await connectDB();
        const data = await req.json();

        if (!data.name || !data.description) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newProject = await Project.create({
            name: data.name,
            description: data.description,
            images: data.images || [],
            pdf: data.pdf || null
        });

        return NextResponse.json(newProject, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
