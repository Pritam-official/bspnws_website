import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Volunteer from '@/models/Volunteer';
import VolunteerRequest from '@/models/VolunteerRequest';
import Notice from '@/models/Notice';
import AnnualReport from '@/models/AnnualReport';
import Programme from '@/models/Programme';
import Project from '@/models/Project';
import MediaCoverage from '@/models/MediaCoverage';
import Officer from '@/models/Officer';

export async function GET() {
    try {
        await connectDB();

        // 1. Fetch counts
        const [
            volunteersCount,
            requestsCount,
            noticesCount,
            reportsCount,
            programmesCount,
            projectsCount,
            mediaCoverageCount,
            officersCount
        ] = await Promise.all([
            Volunteer.countDocuments({}),
            VolunteerRequest.countDocuments({}),
            Notice.countDocuments({}),
            AnnualReport.countDocuments({}),
            Programme.countDocuments({}),
            Project.countDocuments({}),
            MediaCoverage.countDocuments({}),
            Officer.countDocuments({})
        ]);

        // 2. Fetch trend/sub-counts
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - 7);
        const startOf30Days = new Date();
        startOf30Days.setDate(startOf30Days.getDate() - 30);

        const [
            volunteersThisMonth,
            requestsPending,
            noticesThisWeek,
            mediaCoverageAddedRecent,
            upcomingProgrammes,
            latestReport
        ] = await Promise.all([
            Volunteer.countDocuments({ createdAt: { $gte: startOfMonth } }),
            VolunteerRequest.countDocuments({ status: 'pending' }),
            Notice.countDocuments({ createdAt: { $gte: startOfWeek } }),
            MediaCoverage.countDocuments({ createdAt: { $gte: startOf30Days } }),
            Programme.countDocuments({ type: 'upcoming' }),
            AnnualReport.findOne({}).sort({ createdAt: -1 })
        ]);

        // Format latest report date label
        let latestReportLabel = 'N/A';
        if (latestReport) {
            if (latestReport.date) {
                try {
                    const reportDate = new Date(latestReport.date);
                    if (!isNaN(reportDate.getTime())) {
                        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                        latestReportLabel = `${months[reportDate.getMonth()]} ${reportDate.getFullYear()}`;
                    } else {
                        latestReportLabel = latestReport.date;
                    }
                } catch {
                    latestReportLabel = latestReport.date;
                }
            } else if (latestReport.createdAt) {
                try {
                    const reportDate = new Date(latestReport.createdAt);
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    latestReportLabel = `${months[reportDate.getMonth()]} ${reportDate.getFullYear()}`;
                } catch {
                    latestReportLabel = 'Recently';
                }
            }
        }

        // 3. Fetch recent volunteers (most recent 4)
        const recentVolunteersRaw = await Volunteer.find({})
            .sort({ createdAt: -1 })
            .limit(4)
            .lean();

        const getInitials = (name: string) => {
            const parts = name.trim().split(/\s+/);
            if (parts.length >= 2) {
                return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
            }
            return name.substring(0, Math.min(2, name.length)).toUpperCase();
        };

        const COLORS = ['#4a7ab5', '#b06c40', '#4a9e72', '#7b5ea7', '#c0514a', '#2e9aaa', '#c47d2e', '#7a6e3c'];

        const formatDate = (dateInput: any) => {
            if (!dateInput) return 'N/A';
            const d = new Date(dateInput);
            if (isNaN(d.getTime())) return String(dateInput);
            const day = d.getDate();
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const month = months[d.getMonth()];
            const year = d.getFullYear();
            return `${day} ${month} ${year}`;
        };

        const recentVolunteers = recentVolunteersRaw.map((v: any, index: number) => ({
            name: v.fullName || 'Unknown',
            date: formatDate(v.createdAt),
            status: 'Active',
            initials: getInitials(v.fullName || 'U'),
            color: COLORS[index % COLORS.length]
        }));

        // 4. Fetch recent notices (most recent 4)
        const recentNoticesRaw = await Notice.find({ status: 'published' })
            .sort({ createdAt: -1 })
            .limit(4)
            .lean();

        const getNoticeType = (title: string, audience: string) => {
            const lowerTitle = title.toLowerCase();
            if (lowerTitle.includes('meeting')) return 'Meeting';
            if (lowerTitle.includes('event') || lowerTitle.includes('drive') || lowerTitle.includes('celebration')) return 'Event';
            if (lowerTitle.includes('report')) return 'Report';
            if (lowerTitle.includes('training')) return 'Training';
            return audience ? audience.charAt(0).toUpperCase() + audience.slice(1) : 'Notice';
        };

        const recentNotices = recentNoticesRaw.map((n: any, index: number) => ({
            title: n.title,
            date: formatDate(n.date || n.createdAt),
            type: getNoticeType(n.title, n.targetAudience),
            color: COLORS[(index + 1) % COLORS.length]
        }));

        // 5. Fetch all programmes for Calendar events
        const allProgrammes = await Programme.find({}).lean();
        const eventsMap: Record<string, { label: string; color: string }[]> = {};

        allProgrammes.forEach((p: any) => {
            if (!p.date) return;
            try {
                const d = new Date(p.date);
                if (!isNaN(d.getTime())) {
                    const y = d.getFullYear();
                    const m = String(d.getMonth() + 1).padStart(2, '0');
                    const day = String(d.getDate()).padStart(2, '0');
                    const dateKey = `${y}-${m}-${day}`;

                    if (!eventsMap[dateKey]) {
                        eventsMap[dateKey] = [];
                    }
                    eventsMap[dateKey].push({
                        label: p.title || 'Programme',
                        color: p.type === 'upcoming' ? '#7b5ea7' : '#4a9e72'
                    });
                }
            } catch (err) {
                console.error('Error parsing program date:', p.date, err);
            }
        });

        return NextResponse.json({
            stats: {
                volunteers: { count: volunteersCount, trend: `+${volunteersThisMonth} this month` },
                requests: { count: requestsCount, trend: `${requestsPending} pending review` },
                notices: { count: noticesCount, trend: `+${noticesThisWeek} this week` },
                reports: { count: reportsCount, trend: `Last: ${latestReportLabel}` },
                programmes: { count: programmesCount, trend: `${upcomingProgrammes} upcoming` },
                projects: { count: projectsCount, trend: `${projectsCount} active` },
                materials: { count: mediaCoverageCount, trend: `+${mediaCoverageAddedRecent} added` },
                officers: { count: officersCount, trend: 'All active' }
            },
            recentVolunteers,
            recentNotices,
            calendarEvents: eventsMap
        }, { status: 200 });

    } catch (error: any) {
        console.error('Stats fetch error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
