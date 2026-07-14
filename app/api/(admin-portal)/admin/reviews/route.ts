import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";

// GET all reviews for admin moderation list
export async function GET() {
    try {
        await connectDB();
        const reviews = await Review.find({}).sort({ createdAt: -1 });
        return NextResponse.json(reviews, { status: 200 });
    } catch (error: any) {
        console.error("Admin GET reviews error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT (update) review status
export async function PUT(req: Request) {
    try {
        await connectDB();
        const data = await req.json();
        const { id, status } = data;

        if (!id || !status) {
            return NextResponse.json({ error: "Review ID and Status are required." }, { status: 400 });
        }

        const validStatuses = ["Pending", "Approved", "Rejected"];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` }, { status: 400 });
        }

        const updatedReview = await Review.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!updatedReview) {
            return NextResponse.json({ error: "Review not found." }, { status: 404 });
        }

        return NextResponse.json(updatedReview, { status: 200 });
    } catch (error: any) {
        console.error("Admin PUT review error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE a review
export async function DELETE(req: Request) {
    try {
        await connectDB();
        let id = "";

        // Try getting it from query params first
        const { searchParams } = new URL(req.url);
        id = searchParams.get("id") || "";

        // If not in query params, try request body JSON
        if (!id) {
            try {
                const body = await req.json();
                id = body.id || "";
            } catch (e) {
                // Ignore parse error
            }
        }

        if (!id) {
            return NextResponse.json({ error: "Review ID is required." }, { status: 400 });
        }

        const deleted = await Review.findByIdAndDelete(id);
        if (!deleted) {
            return NextResponse.json({ error: "Review not found." }, { status: 404 });
        }

        return NextResponse.json({ message: "Review deleted successfully." }, { status: 200 });
    } catch (error: any) {
        console.error("Admin DELETE review error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
