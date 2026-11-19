import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SamMamChild from "@/models/SamMamChild";
import { formatReportMonth } from "@/lib/nutritionLogic";
import { uploadToCloudinary } from "@/lib/cloudinary";

const SEED_CHILDREN = [
    {
        name: "Pooja Hansda",
        anthropometricMeasurement: "SAM (Severe Acute Malnutrition)",
        sex: "Female",
        dateOfEntry: "02/05/2026",
        reportMonth: "February 2026",
        guardianName: "Sunil Hansda",
        dateOfBirth: "06/20/2024",
        age: "1 Year 8 Months",
        weight: 7.2,
        height: 74.0,
        muac: 10.9,
        head: 44.2,
        chest: 44.8,
        last14DaysIllness: "Fever, mild cough",
        ebf: "Yes",
        immunization: "Partially Immunized",
        remarks: "Enrolled in immediate intensive therapeutic feeding protocol; under dietitian supervision.",
        address: "Vill- Uchalan, Raina-II, Purba Bardhaman",
        image: "/sam_mam.png",
        baselineWeight: 7.0,
        targetWeight: 10.5,
        baselineMuac: 10.2,
        targetMuac: 12.5,
        monthlyReports: [
            {
                reportMonth: "February 2026",
                dateOfEntry: "02/05/2026",
                age: "1 Year 8 Months",
                weight: 7.2,
                height: 74.0,
                muac: 10.9,
                head: 44.2,
                chest: 44.8,
                anthropometricMeasurement: "SAM (Severe Acute Malnutrition)",
                last14DaysIllness: "Fever, mild cough",
                ebf: "Yes",
                immunization: "Partially Immunized",
                remarks: "Enrolled in immediate intensive therapeutic feeding protocol; under dietitian supervision.",
            }
        ]
    },
    {
        name: "Aarav Roy",
        anthropometricMeasurement: "SAM to MAM (Recovering)",
        sex: "Male",
        dateOfEntry: "01/12/2026",
        reportMonth: "January 2026",
        guardianName: "Rajesh Roy",
        dateOfBirth: "10/14/2024",
        age: "1 Year 4 Months",
        weight: 8.6,
        height: 76.5,
        muac: 12.1,
        head: 45.8,
        chest: 46.2,
        last14DaysIllness: "None",
        ebf: "Yes (Up to 6 Months)",
        immunization: "Complete",
        remarks: "Appetite restored, taking supplementary khichdi and boiled eggs with steady weight gain.",
        address: "Vill- Rayan, Burdwan Sadar, Purba Bardhaman",
        image: "/nutrition_ad_children.jpg",
        baselineWeight: 6.8,
        targetWeight: 9.8,
        baselineMuac: 10.4,
        targetMuac: 12.5,
        monthlyReports: [
            {
                reportMonth: "January 2026",
                dateOfEntry: "01/12/2026",
                age: "1 Year 4 Months",
                weight: 8.6,
                height: 76.5,
                muac: 12.1,
                head: 45.8,
                chest: 46.2,
                anthropometricMeasurement: "SAM to MAM (Recovering)",
                last14DaysIllness: "None",
                ebf: "Yes (Up to 6 Months)",
                immunization: "Complete",
                remarks: "Appetite restored, taking supplementary khichdi and boiled eggs with steady weight gain.",
            }
        ]
    },
    {
        name: "Rohit Soren",
        anthropometricMeasurement: "MAM (Moderate Acute Malnutrition)",
        sex: "Male",
        dateOfEntry: "12/18/2025",
        reportMonth: "December 2025",
        guardianName: "Bapi Soren",
        dateOfBirth: "03/11/2024",
        age: "2 Years",
        weight: 9.4,
        height: 82.0,
        muac: 12.3,
        head: 47.0,
        chest: 48.0,
        last14DaysIllness: "None",
        ebf: "Yes",
        immunization: "Complete",
        remarks: "Active in play, MUAC increased by 1.1cm in last 60 days. Supplementary diet provided.",
        address: "Vill- Khandaghosh, Purba Bardhaman",
        image: "",
        baselineWeight: 7.9,
        targetWeight: 11.2,
        baselineMuac: 11.2,
        targetMuac: 12.5,
        monthlyReports: [
            {
                reportMonth: "December 2025",
                dateOfEntry: "12/18/2025",
                age: "2 Years",
                weight: 9.4,
                height: 82.0,
                muac: 12.3,
                head: 47.0,
                chest: 48.0,
                anthropometricMeasurement: "MAM (Moderate Acute Malnutrition)",
                last14DaysIllness: "None",
                ebf: "Yes",
                immunization: "Complete",
                remarks: "Active in play, MUAC increased by 1.1cm in last 60 days. Supplementary diet provided.",
            }
        ]
    },
    {
        name: "Ananya Ghosh",
        anthropometricMeasurement: "Normal / Fully Nourished Child",
        sex: "Female",
        dateOfEntry: "10/10/2025",
        reportMonth: "October 2025",
        guardianName: "Debashis Ghosh",
        dateOfBirth: "11/02/2023",
        age: "2 Years 4 Months",
        weight: 12.1,
        height: 86.5,
        muac: 13.4,
        head: 48.2,
        chest: 49.5,
        last14DaysIllness: "None",
        ebf: "Yes (Exclusive 6 Months)",
        immunization: "Complete (Age Appropriate)",
        remarks: "Successfully recovered from SAM to normal health benchmarks. Sustained on balanced family diet.",
        address: "Vill- Galsi, Purba Bardhaman",
        image: "/birthday_ad_elderly.jpg",
        baselineWeight: 8.0,
        targetWeight: 12.0,
        baselineMuac: 10.8,
        targetMuac: 12.5,
        monthlyReports: [
            {
                reportMonth: "October 2025",
                dateOfEntry: "10/10/2025",
                age: "2 Years 4 Months",
                weight: 12.1,
                height: 86.5,
                muac: 13.4,
                head: 48.2,
                chest: 49.5,
                anthropometricMeasurement: "Normal / Fully Nourished Child",
                last14DaysIllness: "None",
                ebf: "Yes (Exclusive 6 Months)",
                immunization: "Complete (Age Appropriate)",
                remarks: "Successfully recovered from SAM to normal health benchmarks. Sustained on balanced family diet.",
            }
        ]
    }
];

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const searchParams = req.nextUrl.searchParams;
        const month = searchParams.get("month");

        let rawChildren = await SamMamChild.find({}).sort({ createdAt: 1 });

        // Auto-seed sample records if database table is initially empty
        if (rawChildren.length === 0) {
            await SamMamChild.insertMany(SEED_CHILDREN);
            rawChildren = await SamMamChild.find({}).sort({ createdAt: 1 });
        }

        // ========================================================
        // GROUPING ENGINE: Group multiple records belonging to the
        // same child into one parent document with monthlyReports!
        // ========================================================
        const groupedMap = new Map<string, any>();
        const toDeleteIds: string[] = [];

        for (const child of rawChildren) {
            const childMonth = child.reportMonth || formatReportMonth(child.dateOfEntry);

            // Create self report entry
            const currentReport = {
                _id: child._id ? String(child._id) : undefined,
                reportMonth: childMonth,
                dateOfEntry: child.dateOfEntry,
                age: child.age,
                weight: child.weight,
                height: child.height,
                muac: child.muac,
                head: child.head,
                chest: child.chest,
                anthropometricMeasurement: child.anthropometricMeasurement,
                last14DaysIllness: child.last14DaysIllness,
                ebf: child.ebf,
                immunization: child.immunization,
                remarks: child.remarks || "",
                customRecoveryPercentage: child.customRecoveryPercentage,
            };

            // Grouping key: prefer explicit childId if pointing to parent, otherwise normalized Name + Guardian
            let groupKey = "";
            if (child.childId) {
                groupKey = child.childId;
            } else {
                groupKey = `${child.name.toLowerCase().trim()}_${child.guardianName.toLowerCase().trim()}`;
            }

            if (!groupedMap.has(groupKey)) {
                // Initialize parent child record
                const reports = Array.isArray(child.monthlyReports) && child.monthlyReports.length > 0
                    ? [...child.monthlyReports]
                    : [currentReport];

                // Ensure currentReport is in reports
                const exists = reports.some(r => r.reportMonth.toLowerCase() === childMonth.toLowerCase());
                if (!exists) {
                    reports.push(currentReport);
                }

                child.monthlyReports = reports;
                child.reportMonth = childMonth;
                groupedMap.set(groupKey, child);
            } else {
                // Secondary record for the same child -> Merge into parent!
                const parent = groupedMap.get(groupKey);

                if (!parent.monthlyReports) parent.monthlyReports = [];

                // Check if this month already exists in parent's monthlyReports
                const existingIdx = parent.monthlyReports.findIndex(
                    (r: any) => r.reportMonth.toLowerCase() === childMonth.toLowerCase()
                );

                if (existingIdx === -1) {
                    parent.monthlyReports.push(currentReport);
                } else {
                    parent.monthlyReports[existingIdx] = currentReport;
                }

                // If this child document is a separate MongoDB doc, mark it for cleanup
                if (String(child._id) !== String(parent._id)) {
                    toDeleteIds.push(String(child._id));
                }

                // If this secondary record is more recent, update parent's active display values
                parent.reportMonth = childMonth;
                parent.weight = child.weight;
                parent.height = child.height;
                parent.muac = child.muac;
                parent.head = child.head;
                parent.chest = child.chest;
                parent.age = child.age;
                parent.dateOfEntry = child.dateOfEntry;
                parent.anthropometricMeasurement = child.anthropometricMeasurement;
                parent.remarks = child.remarks || parent.remarks;
            }
        }

        // Clean up any duplicate documents in the background
        if (toDeleteIds.length > 0) {
            try {
                await SamMamChild.deleteMany({ _id: { $in: toDeleteIds } });
            } catch (e) {
                console.error("Cleanup duplicate ids error:", e);
            }
        }

        // Convert grouped map to array and persist updated monthlyReports to MongoDB
        const consolidatedChildren: any[] = [];
        for (const parent of groupedMap.values()) {
            // Sort reports chronologically or preserve order
            if (parent.monthlyReports && parent.monthlyReports.length > 0) {
                try {
                    await SamMamChild.findByIdAndUpdate(parent._id, {
                        monthlyReports: parent.monthlyReports,
                        reportMonth: parent.reportMonth,
                        weight: parent.weight,
                        height: parent.height,
                        muac: parent.muac,
                        head: parent.head,
                        chest: parent.chest,
                        age: parent.age,
                        dateOfEntry: parent.dateOfEntry,
                        anthropometricMeasurement: parent.anthropometricMeasurement,
                    });
                } catch (e) {}
            }
            consolidatedChildren.push(parent);
        }

        // Reverse so newly enrolled children appear at the top
        consolidatedChildren.reverse();

        // Collect all distinct months across all children & their sub-monthly reports
        const monthsSet = new Set<string>();
        consolidatedChildren.forEach((child) => {
            if (child.reportMonth) monthsSet.add(child.reportMonth);
            if (Array.isArray(child.monthlyReports)) {
                child.monthlyReports.forEach((r: any) => {
                    if (r.reportMonth) monthsSet.add(r.reportMonth);
                });
            }
        });
        const availableMonths = Array.from(monthsSet);

        // Filter by month if query parameter passed
        let filtered = consolidatedChildren;
        if (month && month !== "ALL") {
            filtered = consolidatedChildren.filter((c) => {
                const matchesCurrent = (c.reportMonth || "").toLowerCase() === month.toLowerCase();
                const matchesAnyReport = Array.isArray(c.monthlyReports) && c.monthlyReports.some(
                    (r: any) => (r.reportMonth || "").toLowerCase() === month.toLowerCase()
                );
                return matchesCurrent || matchesAnyReport;
            });
        }

        return NextResponse.json({
            success: true,
            count: filtered.length,
            availableMonths,
            data: filtered,
        });
    } catch (error: any) {
        console.error("Error fetching SAM/MAM children:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch children records", error: error.message },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();

        // ========================================================
        // CASE A: ADD ANOTHER MONTH FOR AN EXISTING PARENT CHILD
        // (GROUPED INTO PARENT DATA - NOT SEPARATE)
        // ========================================================
        if (body.childId) {
            const parent = await SamMamChild.findById(body.childId);
            if (!parent) {
                return NextResponse.json(
                    { success: false, message: "Parent child record not found" },
                    { status: 404 }
                );
            }

            const reportMonth = body.reportMonth?.trim() || formatReportMonth(body.dateOfEntry);

            let monthImageUrl = body.image || "";
            if (monthImageUrl && monthImageUrl.startsWith("data:")) {
                try {
                    monthImageUrl = await uploadToCloudinary(monthImageUrl, "sam_mam_children");
                } catch (err: any) {
                    console.error("Cloudinary upload failed for month image:", err);
                }
            }

            const newMonthlyReport = {
                reportMonth: reportMonth,
                dateOfEntry: body.dateOfEntry,
                age: body.age || parent.age,
                weight: Number(body.weight) || 0,
                height: Number(body.height) || 0,
                muac: Number(body.muac) || 0,
                head: Number(body.head) || 0,
                chest: Number(body.chest) || 0,
                anthropometricMeasurement: body.anthropometricMeasurement || "SAM",
                last14DaysIllness: body.last14DaysIllness || "None",
                ebf: body.ebf || parent.ebf || "Yes",
                immunization: body.immunization || parent.immunization || "Complete",
                remarks: body.remarks || "",
                image: monthImageUrl || parent.image || "",
                customRecoveryPercentage: body.customRecoveryPercentage !== undefined && body.customRecoveryPercentage !== ""
                    ? Number(body.customRecoveryPercentage)
                    : undefined,
            };

            // Ensure parent.monthlyReports has parent's initial month
            if (!parent.monthlyReports || parent.monthlyReports.length === 0) {
                parent.monthlyReports = [
                    {
                        reportMonth: parent.reportMonth || formatReportMonth(parent.dateOfEntry),
                        dateOfEntry: parent.dateOfEntry,
                        age: parent.age,
                        weight: parent.weight,
                        height: parent.height,
                        muac: parent.muac,
                        head: parent.head,
                        chest: parent.chest,
                        anthropometricMeasurement: parent.anthropometricMeasurement,
                        last14DaysIllness: parent.last14DaysIllness,
                        ebf: parent.ebf,
                        immunization: parent.immunization,
                        remarks: parent.remarks,
                        customRecoveryPercentage: parent.customRecoveryPercentage,
                    }
                ];
            }

            // Check if this month already exists in monthlyReports
            const existingIndex = parent.monthlyReports.findIndex(
                (r: any) => r.reportMonth.toLowerCase() === reportMonth.toLowerCase()
            );

            if (existingIndex !== -1) {
                parent.monthlyReports[existingIndex] = newMonthlyReport;
            } else {
                parent.monthlyReports.push(newMonthlyReport);
            }

            // Update parent active metrics to the newly added month
            parent.reportMonth = reportMonth;
            parent.dateOfEntry = newMonthlyReport.dateOfEntry;
            parent.age = newMonthlyReport.age;
            parent.weight = newMonthlyReport.weight;
            parent.height = newMonthlyReport.height;
            parent.muac = newMonthlyReport.muac;
            parent.head = newMonthlyReport.head;
            parent.chest = newMonthlyReport.chest;
            parent.anthropometricMeasurement = newMonthlyReport.anthropometricMeasurement;
            parent.last14DaysIllness = newMonthlyReport.last14DaysIllness;
            parent.ebf = newMonthlyReport.ebf;
            parent.immunization = newMonthlyReport.immunization;
            parent.remarks = newMonthlyReport.remarks;
            if (monthImageUrl) {
                parent.image = monthImageUrl;
            }
            if (newMonthlyReport.customRecoveryPercentage !== undefined) {
                parent.customRecoveryPercentage = newMonthlyReport.customRecoveryPercentage;
            }

            // Set baseline if not already set
            if (!parent.baselineWeight) parent.baselineWeight = parent.weight;
            if (!parent.baselineMuac) parent.baselineMuac = parent.muac;

            await parent.save();

            return NextResponse.json({
                success: true,
                message: `Month "${reportMonth}" added to ${parent.name}'s profile successfully`,
                data: parent,
            });
        }

        // ========================================================
        // CASE B: ENROLL NEW CHILD (BRAND NEW SEPARATE CHILD)
        // ========================================================
        if (!body.name || !body.sex || !body.dateOfEntry || !body.guardianName || !body.age || !body.address) {
            return NextResponse.json(
                { success: false, message: "Please fill in all required child profile fields" },
                { status: 400 }
            );
        }

        const reportMonth = body.reportMonth?.trim() || formatReportMonth(body.dateOfEntry);

        let childImageUrl = body.image || "";
        if (childImageUrl && childImageUrl.startsWith("data:")) {
            try {
                childImageUrl = await uploadToCloudinary(childImageUrl, "sam_mam_children");
            } catch (err: any) {
                console.error("Cloudinary upload failed for new child image:", err);
            }
        }

        const initialReport = {
            reportMonth: reportMonth,
            dateOfEntry: body.dateOfEntry,
            age: body.age,
            weight: Number(body.weight) || 0,
            height: Number(body.height) || 0,
            muac: Number(body.muac) || 0,
            head: Number(body.head) || 0,
            chest: Number(body.chest) || 0,
            anthropometricMeasurement: body.anthropometricMeasurement || "SAM",
            last14DaysIllness: body.last14DaysIllness || "None",
            ebf: body.ebf || "Yes",
            immunization: body.immunization || "Complete",
            remarks: body.remarks || "",
            image: childImageUrl,
            customRecoveryPercentage: body.customRecoveryPercentage !== undefined && body.customRecoveryPercentage !== "" 
                ? Number(body.customRecoveryPercentage) 
                : undefined,
        };

        const newChild = await SamMamChild.create({
            name: body.name,
            anthropometricMeasurement: body.anthropometricMeasurement || "SAM",
            sex: body.sex,
            dateOfEntry: body.dateOfEntry,
            reportMonth: reportMonth,
            guardianName: body.guardianName,
            dateOfBirth: body.dateOfBirth || "",
            age: body.age,
            weight: Number(body.weight) || 0,
            height: Number(body.height) || 0,
            muac: Number(body.muac) || 0,
            head: Number(body.head) || 0,
            chest: Number(body.chest) || 0,
            last14DaysIllness: body.last14DaysIllness || "None",
            ebf: body.ebf || "Yes",
            immunization: body.immunization || "Complete",
            remarks: body.remarks || "",
            address: body.address,
            image: childImageUrl,
            monthlyReports: [initialReport],
            baselineWeight: body.baselineWeight ? Number(body.baselineWeight) : (Number(body.weight) || undefined),
            targetWeight: body.targetWeight ? Number(body.targetWeight) : undefined,
            baselineMuac: body.baselineMuac ? Number(body.baselineMuac) : (Number(body.muac) || undefined),
            targetMuac: body.targetMuac ? Number(body.targetMuac) : 12.5,
            customRecoveryPercentage: body.customRecoveryPercentage !== undefined && body.customRecoveryPercentage !== "" 
                ? Number(body.customRecoveryPercentage) 
                : undefined,
        });

        return NextResponse.json(
            { success: true, message: "Child enrolled successfully", data: newChild },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Error creating/updating SAM/MAM child:", error);
        return NextResponse.json(
            { success: false, message: error.message || "Operation failed" },
            { status: 500 }
        );
    }
}
