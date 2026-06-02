import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import StaffLeave from '@/models/StaffLeave';
import StaffAttendance from '@/models/StaffAttendance';
import User from '@/models/User';
import Volunteer from '@/models/Volunteer';

export async function GET() {
    try {
        await connectDB();
        const requests = await StaffLeave.find({}).sort({ createdAt: -1 });

        // Enrich leave requests with profile pictures
        const enrichedRequests = await Promise.all(requests.map(async (leave) => {
            const leaveObj = leave.toObject();
            let profilePic = "";
            try {
                // Find in User first, then in Volunteer
                const user = await User.findOne({ email: leave.email });
                if (user && user.profilePic) {
                    profilePic = user.profilePic;
                } else {
                    const volunteer = await Volunteer.findOne({ email: leave.email });
                    if (volunteer && volunteer.profilePic) {
                        profilePic = volunteer.profilePic;
                    }
                }
            } catch (err) {
                console.error("Failed to find profilePic for", leave.email, err);
            }
            return {
                ...leaveObj,
                profilePic
            };
        }));

        return NextResponse.json(enrichedRequests, { status: 200 });
    } catch (error: any) {
        console.error('Fetch staff leaves error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        await connectDB();
        const { id, status, adminRemarks } = await req.json();

        if (!id || !status || !['approved', 'rejected'].includes(status)) {
            return NextResponse.json({ error: 'ID and valid status (approved/rejected) are required' }, { status: 400 });
        }

        const leave = await StaffLeave.findById(id);
        if (!leave) {
            return NextResponse.json({ error: 'Leave request not found' }, { status: 404 });
        }

        leave.status = status;
        leave.adminRemarks = adminRemarks || '';
        await leave.save();

        // If approved, we can also auto-create "Leave" status logs in StaffAttendance for the range of dates!
        if (status === 'approved') {
            try {
                const start = new Date(leave.startDate);
                const end = new Date(leave.endDate);
                
                // Loop through all dates from start to end inclusive
                for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                    const dateStr = d.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
                    
                    // Check if a log already exists for this day, otherwise upsert it as "Leave"
                    await StaffAttendance.findOneAndUpdate(
                        { email: leave.email, date: dateStr },
                        {
                            email: leave.email,
                            fullName: leave.fullName,
                            date: dateStr,
                            status: 'Leave',
                            checkIn: '--:--',
                            checkOut: '--:--'
                        },
                        { upsert: true, returnDocument: 'after' }
                    );
                }
            } catch (err) {
                console.error('Error auto-creating leave attendance records:', err);
            }
        }

        return NextResponse.json({ message: `Leave request ${status} successfully`, leave }, { status: 200 });

    } catch (error: any) {
        console.error('Update leave status error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
