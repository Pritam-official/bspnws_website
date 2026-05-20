import { NextRequest, NextResponse } from "next/server";
import { settleAttendance } from "@/lib/attendance-logic";

/**
 * POST /api/attendance/settle
 *
 * Auto-settlement cron job:
 * 1. Finds all SESSION_MASTER records that have expired (> 24h old) and are still "Active"
 * 2. For each expired session, finds all volunteers who did NOT submit attendance
 * 3. Creates Absent records for every non-submitter with their full details
 * 4. Marks each session as "Expired" with settledAt timestamp (idempotent)
 *
 * Protected by Authorization: Bearer <CRON_SECRET>
 * Trigger: Vercel Cron (hourly) or manual call
 */
export async function POST(req: NextRequest) {
    try {
        // --- Authorization check ---
        const cronSecret = process.env.CRON_SECRET;
        if (cronSecret) {
            const authHeader = req.headers.get("authorization");
            if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
        }

        const result = await settleAttendance();

        return NextResponse.json({
            message: result.settled > 0 ? "Settlement complete." : "No expired sessions to settle.",
            ...result
        });
    } catch (error: any) {
        console.error("[settle] Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * GET /api/attendance/settle
 * Same logic as POST — supports Vercel Cron Jobs which use GET requests.
 */
export async function GET(req: NextRequest) {
    return POST(req);
}
