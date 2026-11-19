import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SamMamChild from "@/models/SamMamChild";
import { formatReportMonth } from "@/lib/nutritionLogic";

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const searchParams = req.nextUrl.searchParams;
        const status = searchParams.get("status");
        const sex = searchParams.get("sex");
        const query = searchParams.get("q");
        const month = searchParams.get("month");

        let filter: any = {};

        if (sex && sex !== "ALL") {
            filter.sex = sex;
        }

        if (query) {
            filter.$or = [
                { name: { $regex: query, $options: "i" } },
                { guardianName: { $regex: query, $options: "i" } },
                { address: { $regex: query, $options: "i" } },
            ];
        }

        let rawChildren = await SamMamChild.find(filter).sort({ createdAt: 1 });

        // Group children so each child is unique
        const groupedMap = new Map<string, any>();

        for (const child of rawChildren) {
            const childMonth = child.reportMonth || formatReportMonth(child.dateOfEntry);

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

            let groupKey = "";
            if (child.childId) {
                groupKey = child.childId;
            } else {
                groupKey = `${child.name.toLowerCase().trim()}_${child.guardianName.toLowerCase().trim()}`;
            }

            if (!groupedMap.has(groupKey)) {
                const reports = Array.isArray(child.monthlyReports) && child.monthlyReports.length > 0
                    ? [...child.monthlyReports]
                    : [currentReport];

                const exists = reports.some(r => r.reportMonth.toLowerCase() === childMonth.toLowerCase());
                if (!exists) {
                    reports.push(currentReport);
                }

                child.monthlyReports = reports;
                child.reportMonth = childMonth;
                groupedMap.set(groupKey, child);
            } else {
                const parent = groupedMap.get(groupKey);
                if (!parent.monthlyReports) parent.monthlyReports = [];

                const existingIdx = parent.monthlyReports.findIndex(
                    (r: any) => r.reportMonth.toLowerCase() === childMonth.toLowerCase()
                );

                if (existingIdx === -1) {
                    parent.monthlyReports.push(currentReport);
                } else {
                    parent.monthlyReports[existingIdx] = currentReport;
                }

                parent.reportMonth = childMonth;
                parent.weight = child.weight;
                parent.height = child.height;
                parent.muac = child.muac;
                parent.head = child.head;
                parent.chest = child.chest;
                parent.age = child.age;
                parent.dateOfEntry = child.dateOfEntry;
                parent.anthropometricMeasurement = child.anthropometricMeasurement;
            }
        }

        const consolidatedChildren = Array.from(groupedMap.values()).reverse();

        // Collect available months
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

        // Filter by status if requested
        let filtered = consolidatedChildren;
        if (status && status !== "ALL") {
            filtered = filtered.filter((c) => {
                if (status === "SAM") {
                    return c.anthropometricMeasurement.toUpperCase().includes("SAM") || c.muac < 11.5;
                } else if (status === "MAM") {
                    return c.anthropometricMeasurement.toUpperCase().includes("MAM") || (c.muac >= 11.5 && c.muac < 12.5);
                } else if (status === "RECOVERED") {
                    return c.anthropometricMeasurement.toLowerCase().includes("normal") || c.muac >= 12.5;
                }
                return true;
            });
        }

        // Filter by month if requested
        if (month && month !== "ALL") {
            filtered = filtered.filter((c) => {
                const matchesCurrent = (c.reportMonth || "").toLowerCase() === month.toLowerCase();
                const matchesAny = Array.isArray(c.monthlyReports) && c.monthlyReports.some(
                    (r: any) => (r.reportMonth || "").toLowerCase() === month.toLowerCase()
                );
                return matchesCurrent || matchesAny;
            });
        }

        return NextResponse.json({
            success: true,
            count: filtered.length,
            availableMonths,
            data: filtered,
        });
    } catch (error: any) {
        console.error("Error fetching public nutrition mission children:", error);
        return NextResponse.json(
            { success: false, message: "Error fetching data", error: error.message },
            { status: 500 }
        );
    }
}
