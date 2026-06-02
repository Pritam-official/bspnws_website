import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import StaffPayslip from '@/models/StaffPayslip';

export async function GET() {
    try {
        await connectDB();
        const payslips = await StaffPayslip.find({}).sort({ createdAt: -1 });
        return NextResponse.json(payslips, { status: 200 });
    } catch (error: any) {
        console.error('Fetch payslips error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const data = await req.json();
        const { email, fullName, month, basicSalary, allowance, deduction, status, pdfData, paymentMethod } = data;

        if (!email || !fullName || !month || basicSalary === undefined) {
            return NextResponse.json({ error: 'Email, Full Name, Month, and Basic Salary are required' }, { status: 400 });
        }

        const basic = Number(basicSalary);
        const allow = Number(allowance || 0);
        const deduct = Number(deduction || 0);
        const net = basic + allow - deduct;

        const newPayslip = await StaffPayslip.create({
            email,
            fullName,
            month,
            basicSalary: basic,
            allowance: allow,
            deduction: deduct,
            netSalary: net,
            status: status || 'Paid',
            pdfData: pdfData || '',
            paymentMethod: paymentMethod || 'Cash'
        });

        return NextResponse.json(newPayslip, { status: 201 });

    } catch (error: any) {
        console.error('Create payslip error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Payslip ID is required' }, { status: 400 });
        }

        await StaffPayslip.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Payslip deleted successfully' }, { status: 200 });
    } catch (error: any) {
        console.error('Delete payslip error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
