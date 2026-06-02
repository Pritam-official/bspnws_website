"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Calendar, FileText, Send, Clock, CheckCircle, XCircle } from 'lucide-react';
import VolunteerSidebar from '@/components/volunteer-portal/VolunteerSidebar';
import VolunteerHeader from '@/components/volunteer-portal/VolunteerHeader';

const calculateDays = (start: string, end: string, durationType: string) => {
    if (durationType === 'Half Day') return 0.5;
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return 0;
    const diffTime = Math.abs(e.getTime() - s.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

export default function StaffLeavePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<any>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form inputs & leaves history
    const [leaves, setLeaves] = useState<any[]>([]);
    const [leaveType, setLeaveType] = useState('Casual Leave');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [durationType, setDurationType] = useState('Full Day');
    const [fromTime, setFromTime] = useState('09:00');
    const [toTime, setToTime] = useState('17:00');
    const [reason, setReason] = useState('');

    useEffect(() => {
        const storedData = localStorage.getItem('volunteer_data');
        if (storedData) {
            const parsed = JSON.parse(storedData);
            if (parsed.role !== 'staff') {
                router.push('/volunteers/dashboard');
                return;
            }
            setUserData(parsed);
            fetchLeaveHistory(parsed.email);
        } else {
            router.push('/login/volunteer');
            return;
        }
        setLoading(false);
    }, []);

    // Prefill times depending on duration type
    useEffect(() => {
        if (durationType === 'Full Day') {
            setFromTime('09:00');
            setToTime('17:00');
        } else {
            setFromTime('09:00');
            setToTime('13:00');
        }
    }, [durationType]);

    const fetchLeaveHistory = async (email: string) => {
        try {
            const res = await fetch(`/api/staff/leave?email=${encodeURIComponent(email)}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setLeaves(data);
            }
        } catch (error) {
            console.error('Failed to fetch leave logs:', error);
        }
    };

    const handleSubmitLeave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!leaveType || !startDate || !endDate || !durationType || !fromTime || !toTime || !reason) {
            alert('Please fill out all required fields.');
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            alert('Start Date cannot be later than End Date.');
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch('/api/staff/leave', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: userData.email,
                    fullName: userData.name || `${userData.firstName} ${userData.lastName}`,
                    leaveType,
                    startDate,
                    endDate,
                    durationType,
                    fromTime,
                    toTime,
                    reason
                })
            });

            if (res.ok) {
                alert('Leave request submitted successfully!');
                setStartDate('');
                setEndDate('');
                setReason('');
                setDurationType('Full Day');
                fetchLeaveHistory(userData.email);
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to submit request.');
            }
        } catch (error) {
            console.error('Leave submit error:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading || !userData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
            </div>
        );
    }

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
                <VolunteerHeader userData={userData} setIsMobileMenuOpen={setIsMobileMenuOpen} title="Leave Request" />

                <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 space-y-10 animate-fade-in pb-24 lg:pb-8">
                    {/* Welcome Title */}
                    <div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-none mb-2 uppercase">
                            Staff <span className="text-pink-600">Leave</span>
                        </h1>
                        <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px]">
                            Submit and track leave requests
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Leave Request Form */}
                        <div className="bg-white/80 backdrop-blur-xl border border-white/60 p-6 sm:p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/40 lg:col-span-1 h-fit">
                            <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Send className="w-4 h-4 text-pink-600" />
                                Apply For Leave
                            </h2>
                            <form onSubmit={handleSubmitLeave} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Leave Type</label>
                                    <select
                                        value={leaveType}
                                        onChange={(e) => setLeaveType(e.target.value)}
                                        className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all text-gray-700 h-[48px]"
                                        required
                                    >
                                        <option value="Casual Leave">Casual Leave</option>
                                        <option value="Sick Leave">Sick Leave</option>
                                        <option value="Emergency Leave">Emergency Leave</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Start Date</label>
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all text-gray-700"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">End Date</label>
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all text-gray-700"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Duration Option</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setDurationType('Full Day')}
                                            className={`py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${
                                                durationType === 'Full Day' 
                                                ? 'bg-pink-50 border-pink-500 text-pink-600 shadow-sm' 
                                                : 'bg-gray-50 border-gray-100 text-gray-400 hover:bg-gray-100'
                                            }`}
                                        >
                                            Full Day
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDurationType('Half Day')}
                                            className={`py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${
                                                durationType === 'Half Day' 
                                                ? 'bg-pink-50 border-pink-500 text-pink-600 shadow-sm' 
                                                : 'bg-gray-50 border-gray-100 text-gray-400 hover:bg-gray-100'
                                            }`}
                                        >
                                            Half Day
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">From Time</label>
                                        <input
                                            type="time"
                                            value={fromTime}
                                            onChange={(e) => setFromTime(e.target.value)}
                                            className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all text-gray-700"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">To Time</label>
                                        <input
                                            type="time"
                                            value={toTime}
                                            onChange={(e) => setToTime(e.target.value)}
                                            className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all text-gray-700"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reason for Leave</label>
                                    <textarea
                                        placeholder="Reason for requesting leave..."
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all text-gray-700 h-24 resize-none"
                                        required
                                    />
                                </div>
                                {startDate && endDate && (
                                    <div className="bg-pink-50/50 border border-pink-100 rounded-xl px-4 py-3 text-xs text-pink-700 font-bold flex items-center justify-between">
                                        <span>Total Leave Duration:</span>
                                        <span className="bg-pink-600 text-white px-2 py-0.5 rounded-lg text-[10px]">
                                            {calculateDays(startDate, endDate, durationType)} {calculateDays(startDate, endDate, durationType) === 1 ? 'Day' : 'Days'}
                                        </span>
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-pink-600/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {submitting && <Loader2 className="w-4 h-4 animate-spin text-white" />}
                                    Send Leave Request
                                </button>
                            </form>
                        </div>

                        {/* Request History Log */}
                        <div className="bg-white/80 backdrop-blur-xl border border-white/60 p-6 sm:p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/40 lg:col-span-2 space-y-6">
                            <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">Request History</h2>

                            <div className="overflow-hidden rounded-2xl border border-gray-50">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Applied Date</th>
                                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Leave Details</th>
                                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Reason</th>
                                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {leaves.map((leave) => (
                                                <tr key={leave._id} className="border-b border-gray-50 hover:bg-pink-50/10 transition-colors">
                                                    <td className="px-6 py-4 text-xs text-gray-400 font-bold">
                                                        {leave.createdAt ? new Date(leave.createdAt).toLocaleDateString('en-GB') : 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-800 font-bold">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="px-2 py-0.5 rounded-full bg-pink-50 text-pink-600 text-[9px] font-black uppercase tracking-wider">
                                                                    {leave.leaveType || 'General'}
                                                                </span>
                                                                <span className="px-2 py-0.5 rounded-full bg-gray-150 text-gray-600 text-[9px] font-black uppercase tracking-wider">
                                                                    {leave.durationType || 'Full Day'}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                                                                <Calendar className="w-3.5 h-3.5 text-pink-500 font-bold shrink-0" />
                                                                <span className="font-bold">
                                                                    {leave.startDate === leave.endDate ? leave.startDate : `${leave.startDate} to ${leave.endDate}`}
                                                                </span>
                                                                <span className="bg-pink-50 text-pink-600 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider shrink-0">
                                                                    {calculateDays(leave.startDate, leave.endDate, leave.durationType)} {calculateDays(leave.startDate, leave.endDate, leave.durationType) === 1 ? 'Day' : 'Days'}
                                                                </span>
                                                                <span className="text-gray-300">•</span>
                                                                <span className="text-[11px] font-semibold text-gray-500 shrink-0">
                                                                    {leave.fromTime || '09:00'} - {leave.toTime || '17:00'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600 font-medium max-w-xs truncate" title={leave.reason}>
                                                        <div className="flex items-center gap-2">
                                                            <FileText className="w-4 h-4 text-gray-400" />
                                                            <span className="truncate">{leave.reason}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="space-y-1.5">
                                                            <div className="flex items-center gap-1.5">
                                                                {leave.status === 'pending' ? (
                                                                    <Clock className="w-4 h-4 text-orange-500" />
                                                                ) : leave.status === 'approved' ? (
                                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                                ) : (
                                                                    <XCircle className="w-4 h-4 text-red-500" />
                                                                )}
                                                                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                                                    leave.status === 'approved' 
                                                                        ? 'bg-green-50 text-green-600' 
                                                                        : leave.status === 'rejected' 
                                                                        ? 'bg-red-50 text-red-600' 
                                                                        : 'bg-orange-50 text-orange-600'
                                                                }`}>
                                                                    {leave.status}
                                                                </span>
                                                            </div>
                                                            {leave.adminRemarks && (
                                                                <p className="text-[10px] text-gray-500 italic bg-gray-50 border border-gray-100 rounded-lg p-2 max-w-[180px] break-words">
                                                                    <strong className="text-[9px] font-black text-gray-400 block uppercase tracking-wider not-italic">Admin Remarks:</strong>
                                                                    {leave.adminRemarks}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {leaves.length === 0 && (
                                    <div className="text-center py-16 bg-white">
                                        <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">No leave requests submitted yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
