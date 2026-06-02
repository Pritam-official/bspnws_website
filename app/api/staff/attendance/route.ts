import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import StaffAttendance from '@/models/StaffAttendance';

export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const logs = await StaffAttendance.find({ email }).sort({ date: -1 });
        return NextResponse.json(logs, { status: 200 });
    } catch (error: any) {
        console.error('Fetch staff attendance history error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const { email, fullName, action } = await req.json();

        if (!email || !fullName || !action || !['checkin', 'checkout'].includes(action)) {
            return NextResponse.json({ error: 'Email, Full Name, and valid action (checkin/checkout) are required' }, { status: 400 });
        }

        // Get current Date in YYYY-MM-DD (resets at 12:00 AM India time / IST)
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

        // Format time in "HH:MM AM/PM"
        const timeOptions: Intl.DateTimeFormatOptions = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: 'Asia/Kolkata' // local Indian standard time
        };
        const timeStr = now.toLocaleTimeString('en-US', timeOptions);

        let log = await StaffAttendance.findOne({ email, date: dateStr });

        if (action === 'checkin') {
            if (log) {
                return NextResponse.json({ error: 'You have already checked in for today.' }, { status: 400 });
            }
            log = await StaffAttendance.create({
                email,
                fullName,
                date: dateStr,
                checkIn: timeStr,
                status: 'Present'
            });
        } else if (action === 'checkout') {
            if (!log) {
                return NextResponse.json({ error: 'You must check in first before checking out.' }, { status: 400 });
            }
            if (log.checkOut) {
                return NextResponse.json({ error: 'You have already checked out for today.' }, { status: 400 });
            }
            log.checkOut = timeStr;
            await log.save();
        }

        return NextResponse.json({ message: `${action === 'checkin' ? 'Checked in' : 'Checked out'} successfully`, log }, { status: 200 });

    } catch (error: any) {
        console.error('Submit staff attendance error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
