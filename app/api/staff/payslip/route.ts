import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import StaffPayslip from '@/models/StaffPayslip';

export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const payslips = await StaffPayslip.find({ email }).sort({ createdAt: -1 });
        return NextResponse.json(payslips, { status: 200 });
    } catch (error: any) {
        console.error('Fetch staff payslips error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
