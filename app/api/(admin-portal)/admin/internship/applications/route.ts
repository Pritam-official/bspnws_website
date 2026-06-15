import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import InternshipApplication from '@/models/InternshipApplication';

export async function GET() {
    try {
        await connectDB();
        const applications = await InternshipApplication.find({}).sort({ createdAt: -1 });
        return NextResponse.json(applications, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching internship applications:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        await connectDB();
        const data = await req.json();
        const { id, status } = data;

        if (!id || !status) {
            return NextResponse.json({ error: 'Application ID and Status are required.' }, { status: 400 });
        }

        const validStatuses = ['Pending', 'Under Review', 'Approved', 'Rejected'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` }, { status: 400 });
        }

        const updatedApplication = await InternshipApplication.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!updatedApplication) {
            return NextResponse.json({ error: 'Application not found.' }, { status: 404 });
        }

        return NextResponse.json(updatedApplication, { status: 200 });
    } catch (error: any) {
        console.error("Error updating internship application status:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        await connectDB();
        let id = '';

        // Try getting it from query params first
        const { searchParams } = new URL(req.url);
        id = searchParams.get('id') || '';

        // If not in query params, try request body JSON
        if (!id) {
            try {
                const body = await req.json();
                id = body.id || '';
            } catch (e) {
                // Ignore parse error
            }
        }

        if (!id) {
            return NextResponse.json({ error: 'Application ID is required.' }, { status: 400 });
        }

        const deleted = await InternshipApplication.findByIdAndDelete(id);
        if (!deleted) {
            return NextResponse.json({ error: 'Application not found.' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Internship application deleted successfully.' }, { status: 200 });
    } catch (error: any) {
        console.error("Error deleting internship application:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
