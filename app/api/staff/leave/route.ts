import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import StaffLeave from '@/models/StaffLeave';

export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const leaves = await StaffLeave.find({ email }).sort({ createdAt: -1 });
        return NextResponse.json(leaves, { status: 200 });
    } catch (error: any) {
        console.error('Fetch staff leave history error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const { email, fullName, leaveType, startDate, endDate, durationType, fromTime, toTime, reason } = await req.json();

        if (!email || !fullName || !leaveType || !startDate || !endDate || !durationType || !fromTime || !toTime || !reason) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const newLeave = await StaffLeave.create({
            email,
            fullName,
            leaveType,
            leaveDate: startDate, // Keep populated for backward compatibility
            durationType,
            fromTime,
            toTime,
            startDate,
            endDate,
            reason,
            status: 'pending',
            adminRemarks: ''
        });

        return NextResponse.json({ message: 'Leave request submitted successfully', leave: newLeave }, { status: 201 });

    } catch (error: any) {
        console.error('Create staff leave error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
