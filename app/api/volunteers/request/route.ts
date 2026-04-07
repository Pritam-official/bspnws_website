import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import VolunteerRequest from '@/models/VolunteerRequest';

export async function POST(req: Request) {
    try {
        await connectDB();
        const data = await req.json();
        
        const newRequest = await VolunteerRequest.create({
            fullName: data.fullName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            address: data.address,
            profilePic: data.profilePic,
            whyJoin: data.whyJoin,
            status: 'pending'
        });
        
        return NextResponse.json({ success: true, data: newRequest }, { status: 201 });
    } catch (error: any) {
        console.error("Error in volunteer request:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
