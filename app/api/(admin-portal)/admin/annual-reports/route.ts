import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import AnnualReport from "@/models/AnnualReport";

// GET all reports
export async function GET() {
    try {
        await connectDB();
        const reports = await AnnualReport.find({}).sort({ createdAt: -1 });
        return NextResponse.json(reports, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST new report
export async function POST(req: Request) {
    try {
        await connectDB();
        const data = await req.json();

        if (!data.title || !data.type || !data.file || !data.date) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newReport = await AnnualReport.create({
            title: data.title,
            type: data.type,
            file: data.file,
            date: data.date
        });

        return NextResponse.json(newReport, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE report
export async function DELETE(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        await AnnualReport.findByIdAndDelete(id);
        return NextResponse.json({ message: "Report deleted successfully" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
