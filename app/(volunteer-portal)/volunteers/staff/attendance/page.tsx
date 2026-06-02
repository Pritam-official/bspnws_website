"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Calendar, Clock, MapPin, UserCheck, CheckCircle, HelpCircle } from 'lucide-react';
import VolunteerSidebar from '@/components/volunteer-portal/VolunteerSidebar';
import VolunteerHeader from '@/components/volunteer-portal/VolunteerHeader';

export default function StaffAttendancePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<any>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    // Attendance data states
    const [logs, setLogs] = useState<any[]>([]);
    const [todayLog, setTodayLog] = useState<any>(null);
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        // Retrieve and parse user session
        const storedData = localStorage.getItem('volunteer_data');
        if (storedData) {
            const parsed = JSON.parse(storedData);
            // Access control guard
            if (parsed.role !== 'staff') {
                router.push('/volunteers/dashboard');
                return;
            }
            setUserData(parsed);
            fetchAttendanceHistory(parsed.email);
        } else {
            router.push('/login/volunteer');
            return;
        }

        // Timer for live clock
        const timer = setInterval(() => {
            const timeOptions: Intl.DateTimeFormatOptions = {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
                timeZone: 'Asia/Kolkata'
            };
            setCurrentTime(new Date().toLocaleTimeString('en-US', timeOptions));
        }, 1000);

        setLoading(false);
        return () => clearInterval(timer);
    }, []);

    const fetchAttendanceHistory = async (email: string) => {
        try {
            const res = await fetch(`/api/staff/attendance?email=${encodeURIComponent(email)}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setLogs(data);
                
                // Check if checked in today
                const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
                const foundToday = data.find(log => log.date === todayStr);
                if (foundToday) {
                    setTodayLog(foundToday);
                }
            }
        } catch (error) {
            console.error('Failed to fetch attendance logs:', error);
        }
    };

    const handleAttendanceAction = async (action: 'checkin' | 'checkout') => {
        if (!userData) return;
        setActionLoading(true);

        try {
            const res = await fetch('/api/staff/attendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: userData.email,
                    fullName: userData.name || `${userData.firstName} ${userData.lastName}`,
                    action
                })
            });

            const data = await res.json();
            if (res.ok) {
                alert(`Successfully ${action === 'checkin' ? 'checked in' : 'checked out'}!`);
                setTodayLog(data.log);
                fetchAttendanceHistory(userData.email);
            } else {
                alert(data.error || 'Failed to complete action.');
            }
        } catch (error) {
            console.error('Attendance action error:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading || !userData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
            </div>
        );
    }

    const todayStr = new Date().toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <div className="min-h-screen relative bg-gray-50 flex overflow-hidden">
            {/* Sidebar */}
            <VolunteerSidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

            {/* Main Content Area */}
            <div className="flex-1 lg:ml-64 relative pb-20 overflow-y-auto">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-pink-600/5 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                {/* Header */}
                <VolunteerHeader userData={userData} setIsMobileMenuOpen={setIsMobileMenuOpen} title="Staff Attendance" />

                <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 space-y-10 animate-fade-in pb-24 lg:pb-8">
                    {/* Welcome Title */}
                    <div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-none mb-2 uppercase">
                            Staff <span className="text-pink-600">Check In</span>
                        </h1>
                        <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px]">
                            Daily Office Presence Log
                        </p>
                    </div>

                    {/* Clock and checkin card */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Time Card */}
                        <div className="bg-white/80 backdrop-blur-xl border border-white/60 p-6 sm:p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/40 flex flex-col justify-between min-h-[220px]">
                            <div>
                                <span className="text-[10px] font-black text-pink-600 uppercase tracking-widest block mb-1">Local Time</span>
                                <span className="text-sm font-bold text-gray-400 block">{todayStr}</span>
                            </div>
                            <div className="my-6">
                                <span className="text-3xl sm:text-4xl font-black text-gray-900 font-mono tracking-tight block">
                                    {currentTime || '00:00:00 AM'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 font-bold uppercase tracking-wider">
                                <MapPin className="w-4 h-4 text-pink-500" />
                                Kolkata, India (IST)
                            </div>
                        </div>

                        {/* Action Card */}
                        <div className="md:col-span-2 bg-white/80 backdrop-blur-xl border border-white/60 p-6 sm:p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/40 flex flex-col justify-between min-h-[220px] relative overflow-hidden">
                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <span className="text-[10px] font-black text-pink-600 uppercase tracking-widest block mb-1">Attendance Status</span>
                                    <h3 className="text-lg font-black text-gray-900 uppercase">
                                        {!todayLog ? 'Not Checked In' : todayLog.checkOut ? 'Shifts Completed' : 'Checked In'}
                                    </h3>
                                </div>
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                                    !todayLog 
                                        ? 'bg-rose-50 text-rose-500 shadow-rose-500/10' 
                                        : todayLog.checkOut 
                                        ? 'bg-green-50 text-green-500 shadow-green-500/10' 
                                        : 'bg-pink-50 text-pink-500 shadow-pink-500/10'
                                }`}>
                                    {!todayLog ? <Clock className="w-6 h-6" /> : todayLog.checkOut ? <CheckCircle className="w-6 h-6" /> : <UserCheck className="w-6 h-6" />}
                                </div>
                            </div>

                            <div className="my-6 relative z-10 grid grid-cols-2 gap-4">
                                {todayLog && (
                                    <>
                                        <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-3">
                                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-wider block">Checked In At</span>
                                            <span className="text-sm font-black text-gray-800">{todayLog.checkIn}</span>
                                        </div>
                                        <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-3">
                                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-wider block">Checked Out At</span>
                                            <span className="text-sm font-black text-gray-800">{todayLog.checkOut || '--:--'}</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="relative z-10 flex gap-4">
                                {!todayLog ? (
                                    <button
                                        onClick={() => handleAttendanceAction('checkin')}
                                        disabled={actionLoading}
                                        className="flex-1 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-pink-600/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {actionLoading && <Loader2 className="w-4 h-4 animate-spin text-white" />}
                                        Check In Today
                                    </button>
                                ) : !todayLog.checkOut ? (
                                    <button
                                        onClick={() => handleAttendanceAction('checkout')}
                                        disabled={actionLoading}
                                        className="flex-1 py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-pink-600/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {actionLoading && <Loader2 className="w-4 h-4 animate-spin text-white" />}
                                        Check Out Today
                                    </button>
                                ) : (
                                    <div className="w-full bg-green-50 text-green-700 rounded-2xl py-4 px-6 text-center text-xs font-black uppercase tracking-wider border border-green-100">
                                        Shift Completed for Today. Thank you!
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Log history list */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">Check In History</h2>

                        <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[2.5rem] shadow-xl shadow-gray-200/30 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-100 bg-gray-50/50">
                                            <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                                            <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Check In</th>
                                            <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Check Out</th>
                                            <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {logs.map((log) => (
                                            <tr key={log._id} className="border-b border-gray-50 hover:bg-pink-50/10 transition-colors">
                                                <td className="px-6 py-4 text-sm text-gray-800 font-bold">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-pink-500" />
                                                        {log.date}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700 font-semibold">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4 text-green-500" />
                                                        {log.checkIn || '--:--'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700 font-semibold">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4 text-orange-500" />
                                                        {log.checkOut || '--:--'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                                        log.status === 'Present' 
                                                            ? 'bg-green-50 text-green-600' 
                                                            : log.status === 'Leave' 
                                                            ? 'bg-blue-50 text-blue-600' 
                                                            : 'bg-red-50 text-red-600'
                                                    }`}>
                                                        {log.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {logs.length === 0 && (
                                <div className="text-center py-16">
                                    <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">No check-in logs recorded yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
