import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import StaffAttendance from '@/models/StaffAttendance';
import User from '@/models/User';
import Volunteer from '@/models/Volunteer';

export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const filterDate = searchParams.get('date');
        
        const query = filterDate ? { date: filterDate } : {};
        const logs = await StaffAttendance.find(query).sort({ createdAt: -1 }).lean();
        
        // Find corresponding profile pics from User and Volunteer collections in batch
        const emails = Array.from(new Set(logs.map(log => log.email).filter(Boolean)));
        
        const [users, volunteers] = await Promise.all([
            User.find({ email: { $in: emails } }).select('email profilePic').lean(),
            Volunteer.find({ email: { $in: emails } }).select('email profilePic').lean()
        ]);
        
        const profilePicMap: Record<string, string> = {};
        
        // Map volunteers profile pictures
        volunteers.forEach((v: any) => {
            if (v.email && v.profilePic) {
                profilePicMap[v.email.toLowerCase()] = v.profilePic;
            }
        });
        
        // Map users profile pictures (overwriting if users have profile pictures as well)
        users.forEach((u: any) => {
            if (u.email && u.profilePic) {
                profilePicMap[u.email.toLowerCase()] = u.profilePic;
            }
        });
        
        // Merge profilePic into logs
        const logsWithProfilePic = logs.map((log: any) => ({
            ...log,
            profilePic: log.email ? (profilePicMap[log.email.toLowerCase()] || '') : ''
        }));

        return NextResponse.json(logsWithProfilePic, { status: 200 });
    } catch (error: any) {
        console.error('Fetch staff attendance error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
