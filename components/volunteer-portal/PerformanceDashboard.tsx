"use client";

import React, { useEffect, useMemo, useState } from 'react';

// ── Types ────────────────────────────────────────────────────────────────────
interface MonthData { month: string; held: number; attended: number; }
interface ProjectSummary { projectName: string; held: number; attended: number; attendanceRate: number; }
interface DashboardStats {
    totalHeld: number;
    totalAttended: number;
    volunteerPoints: number;
    yearlyData: Record<number, MonthData[]>;
    projectSummary: ProjectSummary[];
}

// ── Stat Card ────────────────────────────────────────────────────────────────
const TopStatCard = ({ title, value, icon, color, progress }: { title: string; value: string | number; icon: React.ReactNode; color: string; progress?: number; }) => (
    <div className={`bg-white rounded-3xl p-6 shadow-xl border-t-4 ${color} relative overflow-hidden group hover:scale-[1.02] transition-all duration-300`}>
        <div className="flex justify-between items-start relative z-10">
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
                <h4 className="text-3xl font-black text-gray-900">{value}</h4>
                {progress !== undefined && (
                    <div className="mt-4 flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full ${color.replace('border-', 'bg-')} rounded-full transition-all duration-1000`} style={{ width: `${progress}%` }} />
                        </div>
                        <span className="text-[10px] font-black text-gray-500">{progress}%</span>
                    </div>
                )}
            </div>
            <div className={`p-3 rounded-2xl ${color.replace('border-', 'bg-')}/10 text-xl`}>{icon}</div>
        </div>
        <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${color.replace('border-', 'bg-')}/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`} />
    </div>
);

// ── Bar Chart ────────────────────────────────────────────────────────────────
const BarChart = ({ data }: { data: MonthData[] }) => {
    const max = Math.max(...data.map(d => d.held), 1);
    const ySteps = [max, Math.round(max * 0.75), Math.round(max * 0.5), Math.round(max * 0.25), 0];
    return (
        <div className="w-full h-full flex flex-col pt-4">
            <div className="flex-1 flex gap-4">
                <div className="flex flex-col justify-between text-[11px] font-black text-gray-400 h-[calc(100%-36px)] pb-[2px] pr-4 border-r border-gray-100 mb-9">
                    {ySteps.map(l => <span key={l} className="leading-none text-right w-5">{l}</span>)}
                </div>
                <div className="flex-1 relative flex items-end justify-between gap-4 h-full">
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none h-[calc(100%-36px)] mb-9">
                        {ySteps.map(l => <div key={l} className="w-full border-t border-gray-50/50" />)}
                    </div>
                    {data.map((d, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center group relative z-10 h-full justify-end">
                            <div className="relative w-full h-[calc(100%-36px)] flex justify-center items-end gap-[3px] mb-9">
                                <div className="relative w-1/3 flex flex-col items-center group/bar-held h-full justify-end">
                                    <div className="absolute -top-10 opacity-0 group-hover/bar-held:opacity-100 transition-opacity bg-amber-500 text-white text-[10px] py-1 px-2 rounded-lg font-bold pointer-events-none z-20 whitespace-nowrap">Held: {d.held}</div>
                                    <div className="w-full bg-amber-400 rounded-t-sm transition-all duration-700 hover:bg-amber-500 shadow-sm" style={{ height: `${(d.held / max) * 100}%`, minHeight: d.held > 0 ? '4px' : '0' }} />
                                </div>
                                <div className="relative w-1/3 flex flex-col items-center group/bar-attended h-full justify-end">
                                    <div className="absolute -top-10 opacity-0 group-hover/bar-attended:opacity-100 transition-opacity bg-emerald-600 text-white text-[10px] py-1 px-2 rounded-lg font-bold pointer-events-none z-20 whitespace-nowrap">Attended: {d.attended}</div>
                                    <div className="w-full bg-emerald-500 rounded-t-sm transition-all duration-700 hover:bg-emerald-600 shadow-sm" style={{ height: `${(d.attended / max) * 100}%`, minHeight: d.attended > 0 ? '4px' : '0' }} />
                                </div>
                            </div>
                            <span className="absolute bottom-1 text-[10px] font-black text-gray-400 uppercase tracking-tighter">{d.month}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-8">
                <div className="flex items-center gap-3"><div className="w-3 h-3 bg-amber-400 rounded-[3px] shadow-sm" /><span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Programs Held</span></div>
                <div className="flex items-center gap-3"><div className="w-3 h-3 bg-emerald-500 rounded-[3px] shadow-sm" /><span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Attended</span></div>
            </div>
        </div>
    );
};

// ── Doughnut Chart ───────────────────────────────────────────────────────────
const DoughnutChart = ({ percent }: { percent: number }) => {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;
    return (
        <div className="relative w-48 h-48 flex items-center justify-center mx-auto">
            <svg className="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r={radius} stroke="currentColor" strokeWidth="15" fill="transparent" className="text-gray-100" />
                <circle cx="96" cy="96" r={radius} stroke="currentColor" strokeWidth="15" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" fill="transparent" className="text-pink-600 drop-shadow-[0_0_8px_rgba(219,39,119,0.3)] transition-all duration-1000 ease-out" />
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-black text-gray-900">{percent}%</span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Attendance</span>
            </div>
        </div>
    );
};

// ── Skeleton ─────────────────────────────────────────────────────────────────
const Skeleton = ({ className }: { className?: string }) => (
    <div className={`animate-pulse bg-gray-100 rounded-2xl ${className}`} />
);

// ── Live Calendar ────────────────────────────────────────────────────────────
const LiveCalendar = () => {
    const today = new Date();
    const [viewDate, setViewDate] = useState(new Date());
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const monthName = viewDate.toLocaleString('default', { month: 'long' });
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const changeMonth = (offset: number) => { const d = new Date(viewDate); d.setMonth(month + offset); setViewDate(d); };
    return (
        <div className="bg-white rounded-[40px] p-8 shadow-2xl border border-gray-100 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg></button>
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">{monthName} {year}</h3>
                <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg></button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d} className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1 flex-1">
                {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                    const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
                    return (
                        <div key={day} className="relative flex items-center justify-center">
                            <div className={`w-8 h-8 flex items-center justify-center rounded-xl text-xs font-bold transition-all ${isToday ? 'bg-amber-400 text-white shadow-lg shadow-amber-200' : 'text-gray-600 hover:bg-gray-50 hover:text-pink-600'}`}>{day}</div>
                        </div>
                    );
                })}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-center gap-4">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-400" /><span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Today</span></div>
            </div>
        </div>
    );
};

// ── Main Dashboard ───────────────────────────────────────────────────────────
export default function PerformanceDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [selectedMonthIndex, setSelectedMonthIndex] = useState(new Date().getMonth());

    useEffect(() => {
        const raw = localStorage.getItem('volunteer_data');
        if (!raw) { setLoading(false); return; }
        const { email } = JSON.parse(raw);
        if (!email) { setLoading(false); return; }

        fetch(`/api/volunteers/dashboard-stats?email=${encodeURIComponent(email)}`)
            .then(r => r.json())
            .then((data: DashboardStats) => {
                setStats(data);
                // Default to latest year with data
                const years = Object.keys(data.yearlyData).map(Number);
                if (years.length) {
                    const latestYear = Math.max(...years);
                    setSelectedYear(latestYear);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const availableYears = useMemo(() => stats ? Object.keys(stats.yearlyData).map(Number).sort() : [], [stats]);
    const monthsData: MonthData[] = useMemo(() => stats?.yearlyData[selectedYear] ?? Array.from({ length: 12 }, (_, i) => ({ month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i], held: 0, attended: 0 })), [stats, selectedYear]);
    const currentMonthData = monthsData[selectedMonthIndex];
    const currentAttendancePercent = currentMonthData.held > 0 ? Math.round((currentMonthData.attended / currentMonthData.held) * 100) : 0;
    const overallRate = stats && stats.totalHeld > 0 ? Math.round((stats.totalAttended / stats.totalHeld) * 100) : 0;

    if (loading) {
        return (
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-36" />)}
                </div>
                <Skeleton className="h-[600px] rounded-[40px]" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <TopStatCard title="Total Programs Held" value={stats?.totalHeld ?? 0}
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
                    color="border-blue-500" />
                <TopStatCard title="Programs Attended" value={stats?.totalAttended ?? 0}
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    color="border-green-500" />
                <TopStatCard title="Attendance Rate" value={`${overallRate}%`} progress={overallRate}
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
                    color="border-pink-500" />
                <TopStatCard title="Volunteer Points" value={(stats?.volunteerPoints ?? 0).toLocaleString()}
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>}
                    color="border-yellow-500" />
            </div>

            {/* Bar Chart + Doughnut */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-[40px] p-10 shadow-2xl border border-gray-100 flex flex-col h-[600px]">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Programs Held</h3>
                            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Yearly Performance Matrix</p>
                        </div>
                        {availableYears.length > 0 && (
                            <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                                {availableYears.map(y => (
                                    <button key={y} onClick={() => setSelectedYear(y)}
                                        className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedYear === y ? 'bg-white shadow-sm text-pink-600' : 'text-gray-400 hover:text-gray-600'}`}>
                                        {y}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="flex-1"><BarChart data={monthsData} /></div>
                </div>

                <div className="bg-white rounded-[40px] p-10 shadow-2xl border border-gray-100 flex flex-col h-full lg:h-[600px]">
                    <div className="mb-8">
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight text-center">Monthly Attendance</h3>
                        <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest text-center mt-1">Detailed View</p>
                    </div>
                    <div className="flex-1 flex flex-col justify-center gap-12">
                        <DoughnutChart percent={currentAttendancePercent} />
                        <div className="grid grid-cols-1 gap-4">
                            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 relative group/select cursor-pointer">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 text-center">Select Month</p>
                                <select value={selectedMonthIndex} onChange={(e) => setSelectedMonthIndex(parseInt(e.target.value))}
                                    className="w-full bg-transparent text-xl font-black text-gray-900 text-center uppercase focus:outline-none appearance-none cursor-pointer relative z-10">
                                    {monthsData.map((m, idx) => <option key={m.month} value={idx}>{m.month}</option>)}
                                </select>
                                <div className="absolute right-6 top-1/2 mt-2 -translate-y-1/2 pointer-events-none text-gray-400"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg></div>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                <p className="text-[10px] font-black text-pink-500/60 uppercase tracking-widest mb-2 text-center">Monthly Status ({selectedYear})</p>
                                <p className="text-2xl font-black text-pink-600 text-center uppercase">{currentAttendancePercent}% <span className="text-[10px] opacity-60">Attend</span></p>
                                <p className="text-[10px] text-center text-gray-400 font-bold mt-1">{currentMonthData.attended} of {currentMonthData.held} sessions</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Project Summary */}
            {stats && stats.projectSummary.length > 0 && (
                <div className="bg-white rounded-[40px] p-10 shadow-2xl border border-gray-100">
                    <div className="mb-8">
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">Project Attendance</h3>
                        <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">Breakdown by Project</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stats.projectSummary.map((proj) => (
                            <div key={proj.projectName} className="bg-gray-50 rounded-3xl p-6 border border-gray-100 hover:shadow-md transition-all group">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h4 className="text-base font-black text-gray-900 tracking-tight">{proj.projectName}</h4>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{proj.attended} Present · {proj.held - proj.attended} Absent</p>
                                    </div>
                                    <span className={`text-lg font-black ${proj.attendanceRate >= 75 ? 'text-emerald-500' : proj.attendanceRate >= 50 ? 'text-amber-500' : 'text-pink-600'}`}>
                                        {proj.attendanceRate}%
                                    </span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${proj.attendanceRate >= 75 ? 'bg-emerald-500' : proj.attendanceRate >= 50 ? 'bg-amber-400' : 'bg-pink-600'}`}
                                        style={{ width: `${proj.attendanceRate}%` }}
                                    />
                                </div>
                                <div className="mt-3 flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <span>{proj.held} Total Sessions</span>
                                    <span>{proj.attended} Attended</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* No Data State */}
            {stats && stats.totalHeld === 0 && (
                <div className="bg-gray-50 rounded-[40px] p-16 text-center border border-gray-100">
                    <div className="w-16 h-16 bg-pink-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-2">No Attendance Records Yet</h3>
                    <p className="text-gray-400 font-bold text-sm">Your attendance data will appear here once you start participating in sessions.</p>
                </div>
            )}

            {/* Alerts & Calendar row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-gray-900 rounded-[40px] p-10 shadow-2xl relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-2xl font-black text-white tracking-tight">Alerts Center</h3>
                                <p className="text-pink-500 font-bold text-[10px] uppercase tracking-widest">Action Required &amp; Updates</p>
                            </div>
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white">
                                <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                            </div>
                        </div>
                        <p className="text-gray-500 font-bold text-sm text-center py-8">No new alerts at this time.</p>
                    </div>
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[100px] -mr-48 -mt-48 group-hover:bg-pink-600/20 transition-all duration-700" />
                </div>
                <div className="h-[500px] lg:h-auto"><LiveCalendar /></div>
            </div>
        </div>
    );
}
