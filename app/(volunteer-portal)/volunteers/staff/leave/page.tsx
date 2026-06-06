"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Calendar, FileText, Send, Clock, CheckCircle, XCircle, ArrowRight, Sparkles } from 'lucide-react';
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
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [visibleRows, setVisibleRows] = useState<number[]>([]);

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

    // Animate table rows on load
    useEffect(() => {
        if (leaves.length > 0) {
            leaves.forEach((_, idx) => {
                setTimeout(() => {
                    setVisibleRows(prev => [...prev, idx]);
                }, idx * 100);
            });
        }
    }, [leaves]);

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
                setSubmitSuccess(true);
                setTimeout(() => {
                    setSubmitSuccess(false);
                    setStartDate('');
                    setEndDate('');
                    setReason('');
                    setDurationType('Full Day');
                    fetchLeaveHistory(userData.email);
                }, 1500);
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
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                    <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
                </div>

                <div className="relative flex flex-col items-center gap-4 z-10">
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 rounded-full opacity-20 animate-pulse blur-lg"></div>
                        <Loader2 className="w-16 h-16 text-white animate-spin drop-shadow-lg" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <p className="text-xl font-bold text-white">Loading your workspace</p>
                        <div className="flex gap-1">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                    </div>
                </div>

                <style jsx>{`
                    @keyframes blob {
                        0%, 100% { transform: translate(0, 0) scale(1); }
                        33% { transform: translate(30px, -50px) scale(1.1); }
                        66% { transform: translate(-20px, 20px) scale(0.9); }
                    }
                    .animate-blob { animation: blob 7s infinite; }
                    .animation-delay-2000 { animation-delay: 2s; }
                    .animation-delay-4000 { animation-delay: 4s; }
                `}</style>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden flex">
            {/* Animated background elements */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 -left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Sidebar */}
            <VolunteerSidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

            {/* Main Content Area */}
            <div className="flex-1 lg:ml-64 relative z-10 pb-20 overflow-y-auto">
                <VolunteerHeader userData={userData} setIsMobileMenuOpen={setIsMobileMenuOpen} title="Leave Management" />

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
                    {/* Animated Page Header */}
                    <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <div className="flex items-baseline gap-3">
                            <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 tracking-tight leading-none">
                                Leave Management
                            </h1>
                            <div className="px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-white/40 shadow-lg animate-bounce" style={{ animationDelay: '0.3s' }}>
                                <span className="text-sm font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                    {leaves.length} requests
                                </span>
                            </div>
                        </div>
                        <p className="text-lg text-slate-600 font-medium">Submit and track your leave requests with real-time updates</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Form Card */}
                        <div className="lg:col-span-1 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <div className="group sticky top-32 bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
                                {/* Animated gradient border */}
                                <div className="h-1 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 animate-gradient-x"></div>

                                <div className="p-8 space-y-8">
                                    {/* Header with icon animation */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <Send className="w-6 h-6 text-white" />
                                            </div>
                                            <h2 className="text-2xl font-black bg-gradient-to-r from-slate-900 to-purple-900 bg-clip-text text-transparent">
                                                New Request
                                            </h2>
                                        </div>
                                        <p className="text-sm text-slate-600 ml-15">Fill the form below</p>
                                    </div>

                                    <form onSubmit={handleSubmitLeave} className="space-y-6">
                                        {/* Leave Type with staggered animation */}
                                        <div className="space-y-3 transform transition-all duration-300 hover:scale-105 origin-left">
                                            <label className="block text-sm font-bold text-slate-900">Leave Type</label>
                                            <select
                                                value={leaveType}
                                                onChange={(e) => setLeaveType(e.target.value)}
                                                className="w-full bg-gradient-to-br from-slate-50 to-purple-50 border-2 border-white/40 rounded-2xl px-4 py-3.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-white/60 cursor-pointer shadow-sm hover:shadow-md"
                                                required
                                            >
                                                <option value="Casual Leave">Casual Leave</option>
                                                <option value="Sick Leave">Sick Leave</option>
                                                <option value="Emergency Leave">Emergency Leave</option>
                                            </select>
                                        </div>

                                        {/* Dates */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-3 transform transition-all duration-300 hover:scale-105 origin-left">
                                                <label className="block text-sm font-bold text-slate-900">Start Date</label>
                                                <input
                                                    type="date"
                                                    value={startDate}
                                                    onChange={(e) => setStartDate(e.target.value)}
                                                    className="w-full bg-gradient-to-br from-slate-50 to-blue-50 border-2 border-white/40 rounded-2xl px-4 py-3.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-white/60 shadow-sm hover:shadow-md"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-3 transform transition-all duration-300 hover:scale-105 origin-left" style={{ transitionDelay: '0.1s' }}>
                                                <label className="block text-sm font-bold text-slate-900">End Date</label>
                                                <input
                                                    type="date"
                                                    value={endDate}
                                                    onChange={(e) => setEndDate(e.target.value)}
                                                    className="w-full bg-gradient-to-br from-slate-50 to-blue-50 border-2 border-white/40 rounded-2xl px-4 py-3.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-white/60 shadow-sm hover:shadow-md"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Duration Toggle with animation */}
                                        <div className="space-y-3">
                                            <label className="block text-sm font-bold text-slate-900">Duration</label>
                                            <div className="grid grid-cols-2 gap-2 p-1.5 bg-gradient-to-br from-slate-100 to-purple-100 rounded-2xl">
                                                {['Full Day', 'Half Day'].map((type) => (
                                                    <button
                                                        key={type}
                                                        type="button"
                                                        onClick={() => setDurationType(type)}
                                                        className={`py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 transform ${durationType === type
                                                                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg scale-105 shadow-purple-500/30'
                                                                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 hover:scale-105'
                                                            }`}
                                                    >
                                                        {type}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Times */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-3 transform transition-all duration-300 hover:scale-105 origin-left">
                                                <label className="block text-sm font-bold text-slate-900">From</label>
                                                <input
                                                    type="time"
                                                    value={fromTime}
                                                    onChange={(e) => setFromTime(e.target.value)}
                                                    className="w-full bg-gradient-to-br from-slate-50 to-blue-50 border-2 border-white/40 rounded-2xl px-4 py-3.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-white/60 shadow-sm hover:shadow-md"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-3 transform transition-all duration-300 hover:scale-105 origin-left" style={{ transitionDelay: '0.1s' }}>
                                                <label className="block text-sm font-bold text-slate-900">To</label>
                                                <input
                                                    type="time"
                                                    value={toTime}
                                                    onChange={(e) => setToTime(e.target.value)}
                                                    className="w-full bg-gradient-to-br from-slate-50 to-blue-50 border-2 border-white/40 rounded-2xl px-4 py-3.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-white/60 shadow-sm hover:shadow-md"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Reason */}
                                        <div className="space-y-3 transform transition-all duration-300 hover:scale-105 origin-left" style={{ transitionDelay: '0.2s' }}>
                                            <label className="block text-sm font-bold text-slate-900">Reason</label>
                                            <textarea
                                                placeholder="Share your reason..."
                                                value={reason}
                                                onChange={(e) => setReason(e.target.value)}
                                                className="w-full bg-gradient-to-br from-slate-50 to-blue-50 border-2 border-white/40 rounded-2xl px-4 py-3.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:border-white/60 h-24 resize-none shadow-sm hover:shadow-md"
                                                required
                                            />
                                        </div>

                                        {/* Duration Summary */}
                                        {startDate && endDate && (
                                            <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-purple-50 border-2 border-purple-200 rounded-2xl px-6 py-4 space-y-2 animate-slide-in-up">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-bold text-slate-900">Total Duration</span>
                                                    <span className="text-3xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
                                                        {calculateDays(startDate, endDate, durationType)}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-600 font-semibold">
                                                    {calculateDays(startDate, endDate, durationType) === 1 ? 'day' : 'days'} of leave
                                                </p>
                                            </div>
                                        )}

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={submitting || submitSuccess}
                                            className="w-full py-4 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 hover:from-purple-700 hover:via-blue-700 hover:to-purple-700 text-white font-bold rounded-2xl transition-all duration-300 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transform hover:scale-105 text-lg"
                                        >
                                            {submitSuccess ? (
                                                <>
                                                    <CheckCircle className="w-5 h-5 animate-bounce" />
                                                    Submitted!
                                                </>
                                            ) : submitting ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-5 h-5" />
                                                    Submit Request
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* History Card */}
                        <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                            <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl overflow-hidden">
                                {/* Animated gradient border */}
                                <div className="h-1 bg-gradient-to-r from-slate-400 via-slate-400 to-slate-400 animate-gradient-x"></div>

                                <div className="p-8">
                                    {/* Header */}
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <Calendar className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-slate-900">Request History</h2>
                                            <p className="text-sm text-slate-600">Track all submissions</p>
                                        </div>
                                    </div>

                                    {/* Table */}
                                    <div className="border-2 border-white/40 rounded-2xl overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="bg-gradient-to-r from-slate-100 to-purple-100 border-b-2 border-white/60">
                                                        <th className="text-left px-6 py-5 text-xs font-black text-slate-700 uppercase tracking-wider">Applied</th>
                                                        <th className="text-left px-6 py-5 text-xs font-black text-slate-700 uppercase tracking-wider">Details</th>
                                                        <th className="text-left px-6 py-5 text-xs font-black text-slate-700 uppercase tracking-wider">Reason</th>
                                                        <th className="text-left px-6 py-5 text-xs font-black text-slate-700 uppercase tracking-wider">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/40">
                                                    {leaves.map((leave, idx) => (
                                                        <tr
                                                            key={leave._id}
                                                            className={`hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-blue-50/50 transition-all duration-300 transform cursor-pointer ${visibleRows.includes(idx)
                                                                    ? 'opacity-100 translate-y-0'
                                                                    : 'opacity-0 translate-y-4'
                                                                }`}
                                                            style={{
                                                                transition: `all 0.5s ease-out ${idx * 0.1}s`
                                                            }}
                                                        >
                                                            <td className="px-6 py-5 text-sm font-semibold text-slate-600">
                                                                {leave.createdAt ? new Date(leave.createdAt).toLocaleDateString('en-GB', {
                                                                    day: '2-digit',
                                                                    month: 'short',
                                                                    year: 'numeric'
                                                                }) : 'N/A'}
                                                            </td>
                                                            <td className="px-6 py-5">
                                                                <div className="space-y-3">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 text-xs font-bold border border-purple-200 hover:shadow-lg transition-all duration-300 transform hover:scale-110">
                                                                            {leave.leaveType || 'General'}
                                                                        </span>
                                                                        <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 hover:shadow-lg transition-all duration-300 transform hover:scale-110">
                                                                            {leave.durationType || 'Full Day'}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                                                        <Calendar className="w-4 h-4 text-slate-400 animate-spin-slow" />
                                                                        <span>
                                                                            {leave.startDate === leave.endDate
                                                                                ? new Date(leave.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
                                                                                : `${new Date(leave.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} – ${new Date(leave.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}`
                                                                            }
                                                                        </span>
                                                                        <span className="ml-auto inline-flex items-center px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 text-xs font-black border border-purple-200 hover:shadow-lg transition-all duration-300">
                                                                            {calculateDays(leave.startDate, leave.endDate, leave.durationType)} {calculateDays(leave.startDate, leave.endDate, leave.durationType) === 1 ? 'day' : 'days'}
                                                                        </span>
                                                                    </div>
                                                                    <div className="text-xs text-slate-500 flex items-center gap-1.5 font-semibold">
                                                                        <Clock className="w-3.5 h-3.5" />
                                                                        {leave.fromTime || '09:00'} – {leave.toTime || '17:00'}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-5">
                                                                <div className="flex items-start gap-2.5 max-w-xs">
                                                                    <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-1 animate-pulse" />
                                                                    <p className="text-sm text-slate-700 line-clamp-2 font-medium" title={leave.reason}>
                                                                        {leave.reason}
                                                                    </p>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-5">
                                                                <div className="space-y-2.5">
                                                                    <div className="flex items-center gap-2.5">
                                                                        {leave.status === 'pending' ? (
                                                                            <>
                                                                                <Clock className="w-4 h-4 text-amber-500 animate-spin-slow" />
                                                                                <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-200 uppercase tracking-wider hover:shadow-lg transition-all duration-300 transform hover:scale-110">
                                                                                    Pending
                                                                                </span>
                                                                            </>
                                                                        ) : leave.status === 'approved' ? (
                                                                            <>
                                                                                <CheckCircle className="w-4 h-4 text-green-500 animate-pulse" />
                                                                                <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200 uppercase tracking-wider hover:shadow-lg transition-all duration-300 transform hover:scale-110">
                                                                                    Approved
                                                                                </span>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <XCircle className="w-4 h-4 text-red-500 animate-pulse" />
                                                                                <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border border-red-200 uppercase tracking-wider hover:shadow-lg transition-all duration-300 transform hover:scale-110">
                                                                                    Rejected
                                                                                </span>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                    {leave.adminRemarks && (
                                                                        <div className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 rounded-xl p-3 space-y-2 hover:shadow-md transition-all duration-300 transform hover:scale-105 origin-left">
                                                                            <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">Admin Remarks</p>
                                                                            <p className="text-sm text-slate-700 font-medium">{leave.adminRemarks}</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {leaves.length === 0 && (
                                            <div className="text-center py-20 bg-gradient-to-br from-slate-50 to-purple-50 animate-fade-in">
                                                <div className="flex justify-center mb-4 animate-bounce">
                                                    <Calendar className="w-16 h-16 text-slate-300" />
                                                </div>
                                                <p className="text-lg font-bold text-slate-600">No leave requests yet</p>
                                                <p className="text-sm text-slate-500 mt-1">Submit your first request to get started</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <style jsx>{`
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes slide-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                        max-height: 0;
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                        max-height: 100px;
                    }
                }

                @keyframes gradient-x {
                    0%, 100% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                }

                @keyframes spin-slow {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }

                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out forwards;
                    opacity: 0;
                }

                .animate-slide-in-up {
                    animation: slide-in-up 0.4s ease-out forwards;
                }

                .animate-gradient-x {
                    background-size: 200% 200%;
                    animation: gradient-x 3s ease-in-out infinite;
                }

                .animate-spin-slow {
                    animation: spin-slow 4s linear infinite;
                }
            `}</style>
        </div>
    );
}