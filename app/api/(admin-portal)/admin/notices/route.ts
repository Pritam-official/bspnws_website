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

        if (!data.title || !data.date) {
            return NextResponse.json({ error: "Title and Publish Date are required" }, { status: 400 });
        }

        const newNotice = await Notice.create({
            title: data.title,
            file: data.file || "",
            message: data.message || "", // maps to description
            fileType: data.fileType || "None",
            date: data.date,
            targetAudience: data.targetAudience || "all",
            status: data.status || "published"
        });

        return NextResponse.json(newNotice, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT edit notice
export async function PUT(req: Request) {
    try {
        await connectDB();
        const data = await req.json();
        const { id, title, message, file, fileType, date, targetAudience, status } = data;

        if (!id) {
            return NextResponse.json({ error: "Notice ID is required" }, { status: 400 });
        }

        const notice = await Notice.findById(id);
        if (!notice) {
            return NextResponse.json({ error: "Notice not found" }, { status: 404 });
        }

        if (title !== undefined) notice.title = title;
        if (message !== undefined) notice.message = message;
        if (file !== undefined) notice.file = file;
        if (fileType !== undefined) notice.fileType = fileType;
        if (date !== undefined) notice.date = date;
        if (targetAudience !== undefined) notice.targetAudience = targetAudience;
        if (status !== undefined) notice.status = status;

        await notice.save();
        return NextResponse.json(notice, { status: 200 });
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
