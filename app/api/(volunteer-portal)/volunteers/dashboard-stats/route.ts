import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import VolunteerAttendanceRecord from "@/models/VolunteerAttendanceRecord";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // Fetch all real attendance records for this volunteer (exclude SESSION_MASTER rows)
        const records = await VolunteerAttendanceRecord.find({
            email,
            volunteerId: { $ne: "SESSION_MASTER" },
        }).lean();

        if (!records.length) {
            return NextResponse.json({
                totalHeld: 0,
                totalAttended: 0,
                volunteerPoints: 0,
                yearlyData: {},
                projectSummary: [],
            });
        }

        // ── Build yearlyData structure ───────────────────────────────────────────
        // Shape: { [year]: Array(12) of { month, held, attended } }
        const yearlyMap: Record<number, { held: number; attended: number }[]> = {};

        // ── Build projectSummary structure ────────────────────────────────────────
        const projectMap: Record<string, { held: number; attended: number }> = {};

        let totalHeld = 0;
        let totalAttended = 0;

        for (const rec of records) {
            // Determine date — use submittedAt or createdAt
            const dateRaw = rec.submittedAt || rec.createdAt;
            const date = dateRaw ? new Date(dateRaw) : null;

            const year = date ? date.getFullYear() : new Date().getFullYear();
            const monthIdx = date ? date.getMonth() : 0; // 0-based

            const isPresent = rec.status === "Present";

            // ── yearlyData ──────────────────────────────────────────────────────
            if (!yearlyMap[year]) {
                // Initialize 12 months with 0
                yearlyMap[year] = Array.from({ length: 12 }, (_, i) => ({
                    held: 0,
                    attended: 0,
                }));
            }
            yearlyMap[year][monthIdx].held += 1;
            if (isPresent) yearlyMap[year][monthIdx].attended += 1;

            // ── projectSummary ──────────────────────────────────────────────────
            const proj = rec.projectName || "Unknown";
            if (!projectMap[proj]) {
                projectMap[proj] = { held: 0, attended: 0 };
            }
            projectMap[proj].held += 1;
            if (isPresent) projectMap[proj].attended += 1;

            // ── totals ──────────────────────────────────────────────────────────
            totalHeld += 1;
            if (isPresent) totalAttended += 1;
        }

        // Convert yearlyMap to a shape the frontend expects:
        // { [year]: [{ month: "Jan", held: N, attended: N }, ...] }
        // Only include months that actually have data (held > 0)
        const yearlyData: Record<number, { month: string; held: number; attended: number }[]> = {};

        for (const [yearStr, months] of Object.entries(yearlyMap)) {
            const year = parseInt(yearStr);
            yearlyData[year] = months.map((m, idx) => ({
                month: MONTH_NAMES[idx],
                held: m.held,
                attended: m.attended,
            }));
        }

        // Project summary sorted by held descending
        const projectSummary = Object.entries(projectMap)
            .map(([projectName, data]) => ({
                projectName,
                held: data.held,
                attended: data.attended,
                attendanceRate: data.held > 0 ? Math.round((data.attended / data.held) * 100) : 0,
            }))
            .sort((a, b) => b.held - a.held);

        return NextResponse.json({
            totalHeld,
            totalAttended,
            volunteerPoints: totalAttended * 100,
            yearlyData,
            projectSummary,
        });
    } catch (error: any) {
        console.error("[dashboard-stats] Error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
