"use client";

import React, { useEffect, useState } from 'react';
import { Loader2, Search, Calendar, Clock, User } from 'lucide-react';

export default function StaffAttendanceAdminPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    const fetchAttendance = async (date?: string) => {
        try {
            setLoading(true);
            const url = date ? `/api/admin/staff/attendance?date=${encodeURIComponent(date)}` : '/api/admin/staff/attendance';
            const res = await fetch(url);
            const data = await res.json();
            if (Array.isArray(data)) {
                setLogs(data);
            }
        } catch (error) {
            console.error('Failed to fetch staff attendance:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance(selectedDate);
    }, [selectedDate]);

    const filtered = logs.filter(log =>
        log.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-rose-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">
                        Staff <span className="text-rose-600">Attendance</span>
                    </h1>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-wider mt-1">
                        View and manage daily check-in & check-out logs
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {/* Date Filter */}
                    <div className="flex items-center gap-2">
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all shadow-sm w-full cursor-pointer text-gray-700"
                        />
                        {selectedDate && (
                            <button
                                onClick={() => setSelectedDate('')}
                                className="px-3 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center shrink-0 border border-rose-100"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                    {/* Search Input */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search staff by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all w-full sm:w-72 shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Attendance Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/40 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Staff Member</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Check In</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Check Out</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((log) => (
                                <tr key={log._id} className="border-b border-gray-50 hover:bg-rose-50/10 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-rose-500/10">
                                                {log.profilePic ? (
                                                    <img src={log.profilePic} alt={log.fullName} className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="w-4 h-4 text-white" />
                                                )}
                                            </div>
                                            <div>
                                                <span className="text-sm font-bold text-gray-900 block">{log.fullName}</span>
                                                <span className="text-xs text-gray-400 font-semibold">{log.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-bold">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-rose-500" />
                                            {log.date}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700 font-bold">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-green-500" />
                                            {log.checkIn || '--:--'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700 font-bold">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-orange-500" />
                                            {log.checkOut || '--:--'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
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
                {filtered.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">No attendance logs found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
