import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ScholarshipSetting from '@/models/ScholarshipSetting';
import ScholarshipApplication from '@/models/ScholarshipApplication';
import { uploadDocToCloudinary } from '@/lib/cloudinary';

export async function POST(req: Request) {
    try {
        await connectDB();
        
        // 1. Check if portal is open
        const setting = await ScholarshipSetting.findOne();
        const isOpen = setting ? setting.isOpen : false;
        const endDate = setting ? setting.endDate : null;
        
        if (!isOpen) {
            return NextResponse.json({ success: false, error: 'Scholarship applications are currently closed.' }, { status: 400 });
        }
        
        if (endDate && new Date() > new Date(endDate)) {
            return NextResponse.json({ success: false, error: 'The application deadline has passed.' }, { status: 400 });
        }

        const data = await req.json();

        // 2. Field Validations
        const requiredFields = [
            'fullName',
            'phoneNumber',
            'address',
            'date',
            'fatherName',
            'fatherOccupation',
            'motherOccupation',
            'familyAnnualIncome',
            'studentName',
            'schoolName',
            'board',
            'examination',
            'obtainedMarks',
            'incomeCertificate',
            'resultCopy'
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

        // Board check
        if (data.board === 'Other' && (!data.otherBoard || data.otherBoard.trim() === '')) {
            return NextResponse.json({ success: false, error: 'Custom board name is required when board is Other.' }, { status: 400 });
        }

        // 3. Document Base64 & Format Validation
        // Mime check helper
        const isValidMime = (base64Str: string) => {
            return base64Str.startsWith('data:image/jpeg;base64,') ||
                   base64Str.startsWith('data:image/jpg;base64,') ||
                   base64Str.startsWith('data:image/png;base64,') ||
                   base64Str.startsWith('data:application/pdf;base64,');
        };

        if (!isValidMime(data.incomeCertificate)) {
            return NextResponse.json({ success: false, error: 'Income Certificate must be a PDF, JPG, JPEG, or PNG file.' }, { status: 400 });
        }

        if (!isValidMime(data.resultCopy)) {
            return NextResponse.json({ success: false, error: 'Result Copy must be a PDF, JPG, JPEG, or PNG file.' }, { status: 400 });
        }

        // 4. Cloudinary Uploads
        let incomeCertificateUrl = '';
        let resultCopyUrl = '';

        try {
            incomeCertificateUrl = await uploadDocToCloudinary(data.incomeCertificate, 'scholarship_income_certificates');
        } catch (uploadErr: any) {
            console.error('Failed to upload income certificate to Cloudinary:', uploadErr);
            return NextResponse.json({ success: false, error: 'Failed to upload income certificate. Please try again.' }, { status: 500 });
        }

        try {
            resultCopyUrl = await uploadDocToCloudinary(data.resultCopy, 'scholarship_result_copies');
        } catch (uploadErr: any) {
            console.error('Failed to upload result copy to Cloudinary:', uploadErr);
            return NextResponse.json({ success: false, error: 'Failed to upload result copy. Please try again.' }, { status: 500 });
        }

        // 5. Create Database Entry
        const newApplication = await ScholarshipApplication.create({
            fullName: data.fullName,
            phoneNumber: data.phoneNumber,
            email: data.email || '',
            address: data.address,
            date: new Date(data.date),
            fatherName: data.fatherName,
            fatherOccupation: data.fatherOccupation,
            motherOccupation: data.motherOccupation,
            familyAnnualIncome: Number(data.familyAnnualIncome),
            studentName: data.studentName,
            schoolName: data.schoolName,
            board: data.board,
            otherBoard: data.board === 'Other' ? data.otherBoard : '',
            examination: data.examination,
            obtainedMarks: Number(data.obtainedMarks),
            incomeCertificate: incomeCertificateUrl,
            resultCopy: resultCopyUrl,
            whyApply: data.whyApply || '',
            status: 'Pending'
        });

        return NextResponse.json({ success: true, data: newApplication }, { status: 201 });
    } catch (error: any) {
        console.error("Error in scholarship application submission:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
