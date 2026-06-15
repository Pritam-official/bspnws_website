import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import InternshipSetting from '@/models/InternshipSetting';

export async function GET() {
    try {
        await connectDB();
        let setting = await InternshipSetting.findOne();
        if (!setting) {
            // Default disabled state if database has no record yet
            setting = {
                isOpen: false,
                endDate: null,
                announcementMessage: ""
            };
        }
        return NextResponse.json(setting, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching internship status:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
