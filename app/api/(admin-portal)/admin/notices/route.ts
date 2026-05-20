import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Notice from "@/models/Notice";

// GET all notices
export async function GET() {
    try {
        await connectDB();
        const notices = await Notice.find({}).sort({ createdAt: -1 });
        return NextResponse.json(notices, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST new notice
export async function POST(req: Request) {
    try {
        await connectDB();
        const data = await req.json();

        if (!data.title || !data.file || !data.fileType || !data.date) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newNotice = await Notice.create({
            title: data.title,
            file: data.file,
            message: data.message || "",
            fileType: data.fileType,
            date: data.date
        });

        return NextResponse.json(newNotice, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE notice
export async function DELETE(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        await Notice.findByIdAndDelete(id);
        return NextResponse.json({ message: "Notice deleted successfully" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
