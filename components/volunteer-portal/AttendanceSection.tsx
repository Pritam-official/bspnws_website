"use client";

import React, { useEffect, useState } from 'react';

interface AttendanceRecord {
    _id: string;
    projectName: string;
    date: string;
    status: 'Present' | 'Absent';
    submittedAt: string;
}

interface ActiveSession {
    _id: string;
    projectName: string;
    description: string;
    venue: string;
    date: string;
    hasSubmitted: boolean;
}

export default function AttendanceSection() {
    const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
    const [history, setHistory] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState<string | null>(null);
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        const storedData = localStorage.getItem('volunteer_data');
        if (storedData) {
            const parsed = JSON.parse(storedData);
            setUserData(parsed);
            fetchData(parsed.email);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchData = async (email: string) => {
        try {
            // Fetch active sessions
            const activeRes = await fetch(`/api/attendance/active?email=${email}`);
            const activeData = await activeRes.json();
            if (Array.isArray(activeData)) {
                setActiveSessions(activeData);
            }

            // Fetch history
            const historyRes = await fetch(`/api/attendance/submit?email=${email}`);
            const historyData = await historyRes.json();
            if (Array.isArray(historyData)) {
                setHistory(historyData.map((h: any) => ({
                    _id: h._id,
                    projectName: h.projectName || "Unknown Project",
                    date: new Date(h.submittedAt).toLocaleDateString(),
                    status: h.status,
                    submittedAt: h.submittedAt
                })));
            }
        } catch (error) {
            console.error('Error fetching attendance data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAttendanceSubmit = async (sessionId: string, status: 'Present' | 'Absent') => {
        if (!userData) {
            alert("No user data found. Please log in again.");
            return;
        }

        // Get the most up-to-date data from localStorage just in case
        const latestDataStr = localStorage.getItem('volunteer_data');
        const user = latestDataStr ? JSON.parse(latestDataStr) : userData;

        setSubmitting(sessionId);
        try {
            // Map fields carefully based on how they are stored in VolunteerProfile
            const submissionData = {
                sessionId,
                status,
                email: user.email || user.gmail || "",
                name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
                phoneNumber: user.phone || user.phoneNumber || "",
                volunteerId: user._id || user.id || "manual-entry"
            };

            if (!submissionData.phoneNumber) {
                alert("Phone number is missing in your profile. Please update your profile before giving attendance.");
                setSubmitting(null);
                return;
            }

            const res = await fetch('/api/attendance/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionData),
            });

            if (res.ok) {
                // Refresh data
                fetchData(user.email || user.gmail);
            } else {
                const err = await res.json();
                alert(`Error: ${err.error || "Submission failed"}`);
            }
        } catch (error) {
            console.error('Error submitting attendance:', error);
            alert('Failed to submit attendance');
        } finally {
            setSubmitting(null);
        }
    };

    const totalPoints = history.filter(h => h.status === 'Present').length * 100;

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin h-10 w-10 border-4 border-pink-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Active Attendance Requests */}
            {activeSessions.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                        </span>
                        Active Attendance Requests
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {activeSessions.map((session) => (
                            <div key={session._id} className="bg-white/80 backdrop-blur-md border border-pink-100 rounded-3xl p-6 shadow-xl shadow-pink-600/5 transition-all hover:scale-[1.02]">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-[10px] font-black text-pink-600 uppercase tracking-widest mb-1">New Event</p>
                                        <h4 className="text-xl font-black text-gray-900 leading-tight">{session.projectName}</h4>
                                    </div>
                                    <div className="bg-pink-50 px-3 py-1 rounded-full text-[10px] font-black text-pink-600 uppercase tracking-widest">
                                        Active for 24h
                                    </div>
                                </div>

                                {session.description && (
                                    <p className="text-sm text-gray-500 font-medium mb-4 line-clamp-2">{session.description}</p>
                                )}

                                <div className="flex items-center gap-4 text-xs text-gray-400 font-bold mb-6">
                                    <div className="flex items-center gap-1.5">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        {session.venue || 'TBA'}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        {session.date || 'Today'}
                                    </div>
                                </div>

                                {session.hasSubmitted ? (
                                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center justify-center gap-3 text-emerald-600">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                        <span className="text-sm font-black uppercase tracking-widest">Thank you for giving your attendance</span>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => handleAttendanceSubmit(session._id, 'Present')}
                                            disabled={submitting === session._id}
                                            className="bg-gradient-to-br from-pink-600 to-rose-600 text-white font-black uppercase tracking-widest text-[10px] py-4 rounded-2xl shadow-lg shadow-pink-600/20 hover:scale-[1.05] transition-all disabled:opacity-50"
                                        >
                                            {submitting === session._id ? 'Processing...' : 'I am Present'}
                                        </button>
                                        <button
                                            onClick={() => handleAttendanceSubmit(session._id, 'Absent')}
                                            disabled={submitting === session._id}
                                            className="bg-white border-2 border-gray-100 text-gray-400 font-black uppercase tracking-widest text-[10px] py-4 rounded-2xl hover:border-pink-200 hover:text-pink-600 transition-all disabled:opacity-50"
                                        >
                                            {submitting === session._id ? '...' : 'I am Absent'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Activity History */}
            <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h3 className="text-2xl font-black text-gray-900 mb-1 tracking-tight">Activity History</h3>
                        <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Your contribution journey & rewards</p>
                    </div>

                    {/* Points Summary Card */}
                    <div className="bg-pink-600 rounded-2xl px-8 py-4 shadow-xl shadow-pink-600/20 text-white flex items-center gap-6">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z" /></svg>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Total Points Earned</p>
                            <p className="text-3xl font-black tracking-tighter">{totalPoints.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-gray-100">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Programme</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Reward Points</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {history.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                                        No contribution history yet
                                    </td>
                                </tr>
                            ) : (
                                history.map((log) => (
                                    <tr key={log._id} className="hover:bg-pink-50/30 transition-colors group/row">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-500">{log.date}</td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-gray-900 group-hover/row:text-pink-600 transition-colors uppercase tracking-tight">
                                                {log.projectName}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${log.status === 'Present'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-rose-100 text-rose-700'
                                                }`}>
                                                {log.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`text-sm font-black ${log.status === 'Present' ? 'text-pink-600' : 'text-gray-300'}`}>
                                                {log.status === 'Present' ? '+100' : '+0'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
