import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";

// GET all approved reviews
export async function GET() {
    try {
        await connectDB();
        const reviews = await Review.find({ status: "Approved" }).sort({ createdAt: -1 });
        return NextResponse.json(reviews, { status: 200 });
    } catch (error: any) {
        console.error("GET reviews error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST a new review (submits as 'Pending')
export async function POST(req: Request) {
    try {
        await connectDB();
        const data = await req.json();

        const { name, rating, comment } = data;

        if (!name || !rating || !comment) {
            return NextResponse.json({ error: "Missing required fields: name, rating, or comment" }, { status: 400 });
        }

        const ratingNum = Number(rating);
        if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
            return NextResponse.json({ error: "Rating must be a number between 1 and 5" }, { status: 400 });
        }

        const newReview = await Review.create({
            name,
            rating: ratingNum,
            comment,
            status: "Pending",
        });

        return NextResponse.json(newReview, { status: 201 });
    } catch (error: any) {
        console.error("POST review error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
