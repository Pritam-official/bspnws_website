import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
    try {
        await connectDB();
        // Fetch users who have created a volunteer account.
        // As per the requirement "totals users who have create the volunteer account",
        // we can fetch all users or users with role 'volunteer'. 
        // We'll fetch all users except admins for completeness, or just all users.
        const users = await User.find({ role: { $ne: 'admin' } }).sort({ createdAt: -1 });
        return NextResponse.json(users, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        await connectDB();
        const { id } = await req.json();
        await User.findByIdAndDelete(id);
        return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        await connectDB();
        const { id, isActive } = await req.json();
        const updatedUser = await User.findByIdAndUpdate(id, { isActive }, { new: true });
        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'User status updated successfully', user: updatedUser }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

