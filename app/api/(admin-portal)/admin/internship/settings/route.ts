import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import InternshipSetting from '@/models/InternshipSetting';

export async function GET() {
    try {
        await connectDB();
        let setting = await InternshipSetting.findOne();
        if (!setting) {
            setting = await InternshipSetting.create({
                isOpen: false,
                endDate: null,
                announcementMessage: ''
            });
        }
        return NextResponse.json(setting, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching admin internship settings:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        await connectDB();
        const data = await req.json();
        const { isOpen, endDate, announcementMessage } = data;

        const updatedSetting = await InternshipSetting.findOneAndUpdate(
            {},
            {
                $set: {
                    isOpen,
                    endDate: endDate ? new Date(endDate) : null,
                    announcementMessage: announcementMessage || ''
                }
            },
            { upsert: true, new: true, runValidators: true }
        );

        return NextResponse.json(updatedSetting, { status: 200 });
    } catch (error: any) {
        console.error("Error updating admin internship settings:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
