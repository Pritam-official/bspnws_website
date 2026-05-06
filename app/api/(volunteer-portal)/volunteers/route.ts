import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Volunteer from '@/models/Volunteer';

export async function GET() {
    try {
        await connectDB();
        const volunteers = await Volunteer.find({}).sort({ createdAt: -1 });
        return NextResponse.json(volunteers, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
