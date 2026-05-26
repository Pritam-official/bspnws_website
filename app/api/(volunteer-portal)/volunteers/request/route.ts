import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import VolunteerRequest from '@/models/VolunteerRequest';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(req: Request) {
    try {
        await connectDB();
        const data = await req.json();
        
        let profilePicUrl = data.profilePic;
        
        // Upload image to Cloudinary if provided as a Base64 data URI
        if (profilePicUrl && profilePicUrl.startsWith("data:")) {
            try {
                const cloudinaryUrl = await uploadToCloudinary(profilePicUrl, "volunteer_profiles");
                profilePicUrl = cloudinaryUrl;
            } catch (err: any) {
                console.error("Cloudinary upload failed for volunteer application. Saving Base64 fallback.", err);
            }
        }

        const newRequest = await VolunteerRequest.create({
            fullName: data.fullName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            address: data.address,
            profilePic: profilePicUrl,
            whyJoin: data.whyJoin,
            status: 'pending'
        });
        
        return NextResponse.json({ success: true, data: newRequest }, { status: 201 });
    } catch (error: any) {
        console.error("Error in volunteer request:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
