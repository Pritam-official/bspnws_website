import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Notice from '@/models/Notice';

export async function GET() {
    try {
        await connectDB();
        // Fetch notices targeted to 'all' or 'staff' and not drafted
        const notices = await Notice.find({
            targetAudience: { $in: ['all', 'staff'] },
            status: { $ne: 'draft' }
        }).sort({ createdAt: -1 });

        return NextResponse.json(notices, { status: 200 });
    } catch (error: any) {
        console.error('Fetch staff notices error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
