import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import InternshipSetting from '@/models/InternshipSetting';
import InternshipApplication from '@/models/InternshipApplication';

export async function POST(req: Request) {
    try {
        await connectDB();
        
        // 1. Check if portal is open
        const setting = await InternshipSetting.findOne();
        const isOpen = setting ? setting.isOpen : false;
        const endDate = setting ? setting.endDate : null;
        
        if (!isOpen) {
            return NextResponse.json({ success: false, error: 'Internship applications are currently closed.' }, { status: 400 });
        }
        
        if (endDate && new Date() > new Date(endDate)) {
            return NextResponse.json({ success: false, error: 'The application deadline has passed.' }, { status: 400 });
        }
        
        const data = await req.json();

        // 2. Base Field Validations
        const requiredFields = [
            'fullName',
            'dob',
            'gender',
            'phoneNumber',
            'email',
            'address',
            'fatherName',
            'fatherOccupation',
            'educationQualification',
            'areaOfInterest',
            'duration',
            'resume'
        ];

        for (const field of requiredFields) {
            if (data[field] === undefined || data[field] === null || data[field] === '') {
                return NextResponse.json({ success: false, error: `${field} is required.` }, { status: 400 });
            }
        }

        // Phone number format validation: must be exactly 10 digits
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(data.phoneNumber)) {
            return NextResponse.json({ success: false, error: 'Phone number must be exactly 10 digits.' }, { status: 400 });
        }

        // Gmail validation
        const emailStr = String(data.email).trim().toLowerCase();
        if (!emailStr.endsWith('@gmail.com')) {
            return NextResponse.json({ success: false, error: 'Email address must be a valid Gmail account (ending with @gmail.com).' }, { status: 400 });
        }

        // Conditional educational validation
        const qual = data.educationQualification;
        if (qual === 'Others' && (!data.otherQualification || data.otherQualification.trim() === '')) {
            return NextResponse.json({ success: false, error: 'Specify Qualification is required when qualification is Others.' }, { status: 400 });
        }

        if ((qual === '10th Pass' || qual === '12th Pass')) {
            if (!data.schoolName || data.schoolName.trim() === '') {
                return NextResponse.json({ success: false, error: 'School Name is required.' }, { status: 400 });
            }
            if (!data.board || data.board.trim() === '') {
                return NextResponse.json({ success: false, error: 'Board is required.' }, { status: 400 });
            }
            if (data.board === 'Other' && (!data.otherBoard || data.otherBoard.trim() === '')) {
                return NextResponse.json({ success: false, error: 'Specify Board Name is required when Board is Other.' }, { status: 400 });
            }
        }

        if ((qual === 'Graduate' || qual === 'Post Graduate')) {
            if (!data.collegeName || data.collegeName.trim() === '') {
                return NextResponse.json({ success: false, error: 'College Name is required.' }, { status: 400 });
            }
            if (!data.universityName || data.universityName.trim() === '') {
                return NextResponse.json({ success: false, error: 'University Name is required.' }, { status: 400 });
            }
            if (!data.stream || data.stream.trim() === '') {
                return NextResponse.json({ success: false, error: 'Stream is required.' }, { status: 400 });
            }
        }

        // Conditional preferences validation
        if (data.areaOfInterest === 'Other' && (!data.otherAreaOfInterest || data.otherAreaOfInterest.trim() === '')) {
            return NextResponse.json({ success: false, error: 'Specify Area of Interest is required when Area of Interest is Other.' }, { status: 400 });
        }

        // 3. Document Base64 PDF Validation
        const base64Str = String(data.resume);
        if (!base64Str.startsWith('data:application/pdf;base64,')) {
            return NextResponse.json({ success: false, error: 'Resume must be a PDF file only.' }, { status: 400 });
        }

        // Check PDF size
        try {
            const parts = base64Str.split(';base64,');
            const buffer = Buffer.from(parts[1], 'base64');
            const size = buffer.length;
            const minPdfSize = 50 * 1024; // 50 KB
            const maxPdfSize = 200 * 1024; // 200 KB

            if (size < minPdfSize || size > maxPdfSize) {
                return NextResponse.json({
                    success: false,
                    error: `Resume PDF size must be between 50 KB and 200 KB. (Uploaded size: ${(size / 1024).toFixed(1)} KB)`
                }, { status: 400 });
            }
        } catch (err) {
            return NextResponse.json({ success: false, error: 'Failed to process the uploaded resume file.' }, { status: 400 });
        }

        // 4. Create Database Entry
        const newApplication = await InternshipApplication.create({
            fullName: data.fullName,
            dob: new Date(data.dob),
            gender: data.gender,
            phoneNumber: data.phoneNumber,
            email: emailStr,
            address: data.address,
            fatherName: data.fatherName,
            fatherOccupation: data.fatherOccupation,
            educationQualification: data.educationQualification,
            otherQualification: data.educationQualification === 'Others' ? data.otherQualification : '',
            schoolName: (qual === '10th Pass' || qual === '12th Pass') ? data.schoolName : '',
            board: (qual === '10th Pass' || qual === '12th Pass') ? data.board : '',
            otherBoard: (qual === '10th Pass' || qual === '12th Pass' && data.board === 'Other') ? data.otherBoard : '',
            collegeName: (qual === 'Graduate' || qual === 'Post Graduate') ? data.collegeName : '',
            universityName: (qual === 'Graduate' || qual === 'Post Graduate') ? data.universityName : '',
            currentSemesterYear: (qual === 'Graduate' || qual === 'Post Graduate') ? data.currentSemesterYear || '' : '',
            stream: (qual === 'Graduate' || qual === 'Post Graduate') ? data.stream : '',
            areaOfInterest: data.areaOfInterest,
            otherAreaOfInterest: data.areaOfInterest === 'Other' ? data.otherAreaOfInterest : '',
            duration: data.duration,
            skills: data.skills || '',
            whyJoin: data.whyJoin || '',
            resume: base64Str, // Saved directly in DB
            status: 'Pending'
        });

        return NextResponse.json({ success: true, data: newApplication }, { status: 201 });
    } catch (error: any) {
        console.error("Error submitting internship application:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
