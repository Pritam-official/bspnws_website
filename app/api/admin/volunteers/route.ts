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

export async function DELETE(req: Request) {
    try {
        await connectDB();
        const { id } = await req.json();
        await Volunteer.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Volunteer deleted successfully' }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
