import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import VolunteerRequest from '@/models/VolunteerRequest';
import Volunteer from '@/models/Volunteer';

export async function GET() {
    try {
        await connectDB();
        const requests = await VolunteerRequest.find({ status: 'pending' }).sort({ createdAt: -1 });
        return NextResponse.json(requests, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const data = await req.json();
        const { id, action } = data;

        if (action === 'approve') {
            const request = await VolunteerRequest.findById(id);
            if (!request) {
                return NextResponse.json({ error: 'Request not found' }, { status: 404 });
            }

            // Create in Volunteer table
            await Volunteer.create({
                fullName: request.fullName,
                email: request.email,
                phoneNumber: request.phoneNumber,
                address: request.address,
                profilePic: request.profilePic,
            });

            // Update status in Request table
            request.status = 'approved';
            await request.save();

            return NextResponse.json({ message: 'Approved successfully' }, { status: 200 });
        } else if (action === 'reject') {
            await VolunteerRequest.findByIdAndUpdate(id, { status: 'rejected' });
            return NextResponse.json({ message: 'Rejected successfully' }, { status: 200 });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        await connectDB();
        const { id } = await req.json();
        await VolunteerRequest.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Request deleted successfully' }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
