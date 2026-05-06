"use client";

import React, { useMemo, useState } from 'react';

const TopStatCard = ({ title, value, icon, color, progress }: { title: string, value: string | number, icon: React.ReactNode, color: string, progress?: number }) => (
    <div className={`bg-white rounded-3xl p-6 shadow-xl border-t-4 ${color} relative overflow-hidden group hover:scale-[1.02] transition-all duration-300`}>
        <div className="flex justify-between items-start relative z-10">
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
                <h4 className="text-3xl font-black text-gray-900">{value}</h4>
                {progress !== undefined && (
                    <div className="mt-4 flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${color.replace('border-', 'bg-')} rounded-full transition-all duration-1000`}
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <span className="text-[10px] font-black text-gray-500">{progress}%</span>
                    </div>
                )}
            </div>
            <div className={`p-3 rounded-2xl ${color.replace('border-', 'bg-')}/10 text-xl`}>
                {icon}
            </div>
        </div>
        {/* Decorative background circle */}
        <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${color.replace('border-', 'bg-')}/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
    </div>
);

const BarChart = ({ data }: { data: { month: string, held: number, attended: number }[] }) => {
    const max = 16;
    const yAxisLabels = [16, 14, 12, 10, 8, 6, 4, 2, 0];

    return (
        <div className="w-full h-full flex flex-col pt-4">
            <div className="flex-1 flex gap-4">
                {/* Y-Axis Labels */}
                <div className="flex flex-col justify-between text-[11px] font-black text-gray-400 h-[calc(100%-36px)] pb-[2px] pr-4 border-r border-gray-100 mb-9">
                    {yAxisLabels.map(label => (
                        <span key={label} className="leading-none text-right w-5">{label}</span>
                    ))}
                </div>

                {/* Chart Area */}
                <div className="flex-1 relative flex items-end justify-between gap-4 h-full">
                    {/* Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none h-[calc(100%-36px)] mb-9">
                        {yAxisLabels.map(label => (
                            <div key={label} className="w-full border-t border-gray-50/50"></div>
                        ))}
                    </div>

                    {data.map((d, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center group relative z-10 h-full justify-end">
                            <div className="relative w-full h-[calc(100%-36px)] flex justify-center items-end gap-[3px] mb-9">
                                {/* Programs Held Bar */}
                                <div className="relative w-1/3 flex flex-col items-center group/bar-held h-full justify-end">
                                    <div className="absolute -top-10 opacity-0 group-hover/bar-held:opacity-100 transition-opacity bg-amber-500 text-white text-[10px] py-1 px-2 rounded-lg font-bold pointer-events-none z-20 whitespace-nowrap">
                                        Held: {d.held}
                                    </div>
                                    <div
                                        className="w-full bg-amber-400 rounded-t-sm transition-all duration-700 hover:bg-amber-500 shadow-sm"
                                        style={{ height: `${(d.held / max) * 100}%`, minHeight: '4px' }}
                                    ></div>
                                </div>
                                {/* Programs Attended Bar */}
                                <div className="relative w-1/3 flex flex-col items-center group/bar-attended h-full justify-end">
                                    <div className="absolute -top-10 opacity-0 group-hover/bar-attended:opacity-100 transition-opacity bg-emerald-600 text-white text-[10px] py-1 px-2 rounded-lg font-bold pointer-events-none z-20 whitespace-nowrap">
                                        Attended: {d.attended}
                                    </div>
                                    <div
                                        className="w-full bg-emerald-500 rounded-t-sm transition-all duration-700 hover:bg-emerald-600 shadow-sm"
                                        style={{ height: `${(d.attended / max) * 100}%`, minHeight: '4px' }}
                                    ></div>
                                </div>
                            </div>
                            <span className="absolute bottom-1 text-[10px] font-black text-gray-400 uppercase tracking-tighter">{d.month}</span>
                        </div>
                    ))}
                </div>
            </div>
            {/* Chart Legend */}
            <div className="mt-4 flex items-center justify-center gap-8">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-amber-400 rounded-[3px] shadow-sm"></div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Programs Held</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-[3px] shadow-sm"></div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Attended</span>
                </div>
            </div>
        </div>
    );
};

const DoughnutChart = ({ percent }: { percent: number }) => {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

    return (
        <div className="relative w-48 h-48 flex items-center justify-center mx-auto">
            <svg className="w-full h-full transform -rotate-90">
                {/* Background Ring */}
                <circle
                    cx="96"
                    cy="96"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="15"
                    fill="transparent"
                    className="text-gray-100"
                />
                {/* Progress Ring */}
                <circle
                    cx="96"
                    cy="96"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="15"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="text-pink-600 drop-shadow-[0_0_8px_rgba(219,39,119,0.3)] transition-all duration-1000 ease-out"
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-black text-gray-900">{percent}%</span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Attendance</span>
            </div>
        </div>
    );
};

const LiveCalendar = () => {
    const today = new Date();
    const [viewDate, setViewDate] = useState(new Date());

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const monthName = viewDate.toLocaleString('default', { month: 'long' });

    const prevMonthDays = Array.from({ length: firstDayOfMonth(year, month) }, (_, i) => '');
    const currentMonthDays = Array.from({ length: daysInMonth(year, month) }, (_, i) => i + 1);

    const changeMonth = (offset: number) => {
        const newDate = new Date(viewDate);
        newDate.setMonth(viewDate.getMonth() + offset);
        setViewDate(newDate);
    };

    return (
        <div className="bg-white rounded-[40px] p-8 shadow-2xl border border-gray-100 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">{monthName} {year}</h3>
                <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">{day}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1 flex-1">
                {prevMonthDays.map((_, i) => <div key={`prev-${i}`} className="p-2"></div>)}
                {currentMonthDays.map((day) => {
                    const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
                    return (
                        <div key={day} className="relative group flex items-center justify-center">
                            <div className={`
                                w-8 h-8 flex items-center justify-center rounded-xl text-xs font-bold transition-all
                                ${isToday ? 'bg-amber-400 text-white shadow-lg shadow-amber-200' : 'text-gray-600 hover:bg-gray-50 hover:text-pink-600'}
                            `}>
                                {day}
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* Legend or status indicator could go here */}
            <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-pink-600/10"></div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Active</span>
                </div>
            </div>
        </div>
    );
};

export default function PerformanceDashboard() {
    const [selectedMonthIndex, setSelectedMonthIndex] = useState(4); // Default to May (Index 4)
    const [selectedYear, setSelectedYear] = useState(2026);

    const getYearlyData = (year: number) => {
        // Base seed data that changes slightly per year
        const seedValue = year % 2020;
        return [
            { month: 'Jan', held: 8 + (seedValue % 3), attended: 6 + (seedValue % 2) },
            { month: 'Feb', held: 12 - (seedValue % 2), attended: 10 - (seedValue % 3) },
            { month: 'Mar', held: 15, attended: 12 + (seedValue % 2) },
            { month: 'Apr', held: 10 + (seedValue % 4), attended: 9 },
            { month: 'May', held: 18, attended: 16 },
            { month: 'Jun', held: 14 - (seedValue % 3), attended: 12 },
            { month: 'Jul', held: 9 + (seedValue % 2), attended: 8 },
            { month: 'Aug', held: 11, attended: 10 - (seedValue % 2) },
            { month: 'Sep', held: 16 - (seedValue % 4), attended: 14 },
            { month: 'Oct', held: 13, attended: 11 + (seedValue % 3) },
            { month: 'Nov', held: 10 + (seedValue % 2), attended: 8 },
            { month: 'Dec', held: 7, attended: 6 },
        ];
    };

    const monthsData = useMemo(() => getYearlyData(selectedYear), [selectedYear]);
    const currentMonthData = monthsData[selectedMonthIndex];
    const currentAttendancePercent = Math.round((currentMonthData.attended / (currentMonthData.held || 1)) * 100);

    const alerts = [
        { date: 'Jan 28, 2026', title: 'New Program: Beach Cleanup', type: 'info' },
        { date: 'Jan 25, 2026', title: 'Certificate Issued: Excellence in Volunteering', type: 'success' },
        { date: 'Jan 20, 2026', title: 'Admin Message: Monthly Meetup', type: 'warning' },
    ];

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Top Stat Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <TopStatCard
                    title="Total Programs Held"
                    value={monthsData.reduce((acc, curr) => acc + curr.held, 0)}
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
                    color="border-blue-500"
                />
                <TopStatCard
                    title="Programs Attended"
                    value={monthsData.reduce((acc, curr) => acc + curr.attended, 0)}
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    color="border-green-500"
                />
                <TopStatCard
                    title="Attendance Rate"
                    value={`${Math.round((monthsData.reduce((acc, curr) => acc + curr.attended, 0) / monthsData.reduce((acc, curr) => acc + curr.held, 0)) * 100)}%`}
                    progress={Math.round((monthsData.reduce((acc, curr) => acc + curr.attended, 0) / monthsData.reduce((acc, curr) => acc + curr.held, 0)) * 100)}
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
                    color="border-pink-500"
                />
                <TopStatCard
                    title="Volunteer Points"
                    value={(monthsData.reduce((acc, curr) => acc + curr.attended, 0) * 100).toLocaleString()}
                    icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>}
                    color="border-yellow-500"
                />
            </div>

            {/* Middle Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Bar Chart Section */}
                <div className="lg:col-span-2 bg-white rounded-[40px] p-10 shadow-2xl border border-gray-100 flex flex-col h-[600px]">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Programs Held</h3>
                            <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Yearly Performance Matrix</p>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                            {[2026, 2027, 2028, 2029].map(year => (
                                <button
                                    key={year}
                                    onClick={() => setSelectedYear(year)}
                                    className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedYear === year ? 'bg-white shadow-sm text-pink-600' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    {year}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1">
                        <BarChart data={monthsData} />
                    </div>
                </div>

                {/* Circle Chart Section */}
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
                                <select
                                    value={selectedMonthIndex}
                                    onChange={(e) => setSelectedMonthIndex(parseInt(e.target.value))}
                                    className="w-full bg-transparent text-xl font-black text-gray-900 text-center uppercase focus:outline-none appearance-none cursor-pointer relative z-10"
                                >
                                    {monthsData.map((m, idx) => (
                                        <option key={m.month} value={idx}>{m.month}</option>
                                    ))}
                                </select>
                                <div className="absolute right-6 top-1/2 mt-2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover/select:text-pink-600 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                                <p className="text-[10px] font-black text-pink-500/60 uppercase tracking-widest mb-2 text-center">Yearly Status ({selectedYear})</p>
                                <p className="text-2xl font-black text-pink-600 text-center uppercase">{currentAttendancePercent}% <span className="text-[10px] opacity-60">Attend</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Alerts Center */}
                <div className="lg:col-span-2 bg-gray-900 rounded-[40px] p-10 shadow-2xl relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-2xl font-black text-white tracking-tight">Alerts Center</h3>
                                <p className="text-pink-500 font-bold text-[10px] uppercase tracking-widest">Action Required & Updates</p>
                            </div>
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white">
                                <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {alerts.map((alert, i) => (
                                <div key={i} className="flex items-center gap-6 p-5 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group/item">
                                    <div className={`w-3 h-3 rounded-full ${alert.type === 'success' ? 'bg-green-400' : alert.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'}`}></div>
                                    <div className="flex-1">
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{alert.date}</p>
                                        <h4 className="text-sm font-bold text-white group-hover/item:text-pink-400 transition-colors">{alert.title}</h4>
                                    </div>
                                    <svg className="w-5 h-5 text-gray-600 group-hover/item:text-white transition-all transform group-hover/item:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Abstract design elements */}
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[100px] -mr-48 -mt-48 group-hover:bg-pink-600/20 transition-all duration-700"></div>
                </div>

                {/* Live Calendar Section */}
                <div className="h-[500px] lg:h-auto">
                    <LiveCalendar />
                </div>
            </div>
        </div>
    );
}

