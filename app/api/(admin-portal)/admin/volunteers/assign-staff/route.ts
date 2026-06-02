import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Volunteer from '@/models/Volunteer';
import User from '@/models/User';

export async function PUT(req: Request) {
    try {
        await connectDB();
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ error: 'Volunteer ID is required' }, { status: 400 });
        }

        // Find the volunteer
        const volunteer = await Volunteer.findById(id);
        if (!volunteer) {
            return NextResponse.json({ error: 'Volunteer not found' }, { status: 404 });
        }

        // Update volunteer role to staff
        volunteer.role = 'staff';
        await volunteer.save();

        // Update user role to staff (using email to link)
        const user = await User.findOne({ email: volunteer.email });
        if (user) {
            user.role = 'staff';
            await user.save();
        }

        return NextResponse.json({ 
            message: 'Volunteer assigned as staff successfully',
            volunteer,
            userUpdated: !!user
        }, { status: 200 });

    } catch (error: any) {
        console.error('Assign staff error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
