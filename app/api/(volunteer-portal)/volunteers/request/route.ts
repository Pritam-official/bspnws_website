import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import VolunteerRequest from '@/models/VolunteerRequest';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(req: Request) {
    try {
        await connectDB();
        const data = await req.json();
        
        let profilePicUrl = data.profilePic;
        
        if (!profilePicUrl) {
            return NextResponse.json({ success: false, error: 'Profile picture is required.' }, { status: 400 });
        }
        
        // Upload image to Cloudinary if provided as a Base64 data URI
        if (profilePicUrl.startsWith("data:")) {
            try {
                const cloudinaryUrl = await uploadToCloudinary(profilePicUrl, "volunteer_profiles");
                profilePicUrl = cloudinaryUrl;
            } catch (err: any) {
                console.error("Cloudinary upload failed for volunteer application. Saving Base64 fallback.", err);
            }
        }

        // Phone number validation: must be exactly 10 digits
        const phoneRegex = /^[0-9]{10}$/;
        if (!data.phoneNumber || !phoneRegex.test(data.phoneNumber)) {
            return NextResponse.json({ success: false, error: 'Phone number must be exactly 10 digits.' }, { status: 400 });
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
