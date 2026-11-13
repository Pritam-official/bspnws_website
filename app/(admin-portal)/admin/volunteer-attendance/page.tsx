"use client";

import React, { useState, useEffect } from 'react';
import { Edit3, Check, X, Loader2, Search } from 'lucide-react';

const gradients = [
    'from-blue-500 to-indigo-600',
    'from-pink-500 to-rose-600',
    'from-emerald-500 to-green-600',
    'from-amber-500 to-orange-600',
    'from-violet-500 to-purple-600',
    'from-cyan-500 to-teal-600',
];

const getInitials = (name: string) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'V';
};

const getGradient = (index: number) => {
    return gradients[index % gradients.length];
};

export default function VolunteerAttendancePage() {
    const [formData, setFormData] = useState({
        projectName: '',
        description: '',
        venue: '',
        date: '',
    });
    const [sessions, setSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [filterProject, setFilterProject] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    // State for editing status
    const [editingRecord, setEditingRecord] = useState<any | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<'Present' | 'Absent'>('Present');
    const [updatingStatus, setUpdatingStatus] = useState(false);

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const res = await fetch('/api/attendance/session');
            const data = await res.json();
            if (Array.isArray(data)) {
                setSessions(data);
            }
        } catch (error) {
            console.error('Error fetching sessions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.projectName || !formData.date) {
            alert('Project name and date are required');
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch('/api/attendance/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert('Attendance session created successfully');
                setFormData({ projectName: '', description: '', venue: '', date: '' });
                fetchSessions();
            } else {
                const err = await res.json();
                alert(`Error: ${err.error || 'Failed to create session'}`);
            }
        } catch (error) {
            console.error('Error creating session:', error);
            alert('Failed to create session');
        } finally {
            setSubmitting(false);
        }
    };

    // Flatten all records from all sessions for the table
    const allRecords = sessions.flatMap(session => 
        (session.records || []).map((record: any) => ({
            ...record,
            projectName: session.projectName,
            sessionDate: session.date
        }))
    );

    const uniqueProjects = ['All', ...Array.from(new Set(sessions.map(s => s.projectName)))];
    
    const filteredRecords = allRecords.filter(record => {
        const matchesProject = filterProject === 'All' || record.projectName === filterProject;
        const matchesSearch = !searchTerm.trim() || 
            (record.name && record.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (record.email && record.email.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesProject && matchesSearch;
    });

    const totalSessions = sessions.length;
    const totalPresent = allRecords.filter(r => r.status === 'Present').length;
    const totalAbsent = allRecords.filter(r => r.status === 'Absent').length;

    const handleCloseSession = async (sessionId: string) => {
        if (!confirm('Are you sure you want to close this session? All volunteers who haven\'t submitted will be marked as Absent immediately.')) return;

        try {
            const res = await fetch('/api/attendance/session', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId }),
            });

            if (res.ok) {
                alert('Session closed and settled successfully');
                fetchSessions();
            } else {
                const err = await res.json();
                alert(`Error: ${err.error || 'Failed to close session'}`);
            }
        } catch (error) {
            console.error('Error closing session:', error);
            alert('Failed to close session');
        }
    };

    // Open edit modal for an individual attendance record
    const handleOpenEditModal = (record: any) => {
        setEditingRecord(record);
        setSelectedStatus(record.status === 'Present' ? 'Present' : 'Absent');
    };

    const handleCloseEditModal = () => {
        if (updatingStatus) return;
        setEditingRecord(null);
    };

    // Submit status change to API
    const handleUpdateStatus = async (overrideStatus?: 'Present' | 'Absent') => {
        const targetStatus = overrideStatus || selectedStatus;
        if (!editingRecord || !targetStatus) return;

        setUpdatingStatus(true);
        try {
            const res = await fetch('/api/admin/volunteer-attendance', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recordId: editingRecord._id,
                    status: targetStatus,
                }),
            });

            if (res.ok) {
                // Optimistically update state so user sees immediate results
                setSessions(prevSessions =>
                    prevSessions.map(session => {
                        const hasRecord = (session.records || []).some((r: any) => r._id === editingRecord._id);
                        if (!hasRecord) return session;

                        const updatedRecords = (session.records || []).map((r: any) =>
                            r._id === editingRecord._id ? { ...r, status: targetStatus } : r
                        );
                        const presentCount = updatedRecords.filter((r: any) => r.status === 'Present').length;
                        const absentCount = updatedRecords.filter((r: any) => r.status === 'Absent').length;

                        return {
                            ...session,
                            records: updatedRecords,
                            stats: {
                                ...session.stats,
                                present: presentCount,
                                absent: absentCount,
                            },
                        };
                    })
                );

                setEditingRecord(null);
                // Background refresh to confirm database sync
                fetchSessions();
            } else {
                const err = await res.json();
                alert(`Error: ${err.error || 'Failed to update attendance status'}`);
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update attendance status');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const activeSessions = sessions.filter(s => s.status === 'Active');

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div>
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Volunteer Attendance</h1>
                <p className="text-sm text-gray-400 font-bold mt-1">Track and manage volunteer attendance for projects</p>
            </div>

            {/* Create Attendance Form */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 shadow-sm">
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    Create Attendance Request
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Project Name</label>
                            <input
                                type="text"
                                name="projectName"
                                value={formData.projectName}
                                onChange={handleChange}
                                placeholder="Enter project name"
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Venue</label>
                            <input
                                type="text"
                                name="venue"
                                value={formData.venue}
                                onChange={handleChange}
                                placeholder="Enter venue"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter event description..."
                                rows={3}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl text-sm font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
                        >
                            {submitting ? 'Sending...' : 'Broadcast Attendance'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 shadow-sm">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-2xl font-black text-gray-900">{allRecords.length}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Submissions</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 shadow-sm">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-2xl font-black text-gray-900">{totalPresent}</p>
                        <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Present</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 shadow-sm">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg flex items-center justify-center text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-2xl font-black text-gray-900">{totalAbsent}</p>
                        <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">Absent</p>
                    </div>
                </div>
            </div>

            {/* Active Sessions Section */}
            {activeSessions.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        Active Sessions
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {activeSessions.map((session) => (
                            <div key={session._id} className="bg-white rounded-xl border border-blue-100 p-5 shadow-sm hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-sm font-black text-gray-900">{session.projectName}</h3>
                                    <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full uppercase">Active</span>
                                </div>
                                <div className="space-y-1 mb-4">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Venue: {session.venue || 'TBA'}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Date: {session.date}</p>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex gap-3">
                                        <div className="text-center">
                                            <p className="text-xs font-black text-green-600">{session.stats.present}</p>
                                            <p className="text-[8px] font-bold text-gray-400 uppercase">Present</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs font-black text-red-600">{session.stats.absent}</p>
                                            <p className="text-[8px] font-bold text-gray-400 uppercase">Absent</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleCloseSession(session._id)}
                                        className="text-[9px] font-black uppercase tracking-widest px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                        Close & Settle
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Filter and Search Bar */}
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Filter by Project:</span>
                    <select
                        value={filterProject}
                        onChange={(e) => setFilterProject(e.target.value)}
                        className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                    >
                        {uniqueProjects.map(p => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                    <button 
                      onClick={fetchSessions}
                      className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                      title="Refresh Data"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </button>
                </div>

                {/* Quick Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search volunteer by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-full sm:w-72"
                    />
                </div>
            </div>

            {/* Attendance Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Attendance History</h2>
                    <span className="text-[10px] font-bold text-gray-400">{filteredRecords.length} records found</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Volunteer</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Project</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Programme Date</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Submission Time</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRecords.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs"> No attendance records found </td>
                                </tr>
                            ) : (
                                filteredRecords.map((record, index) => (
                                    <tr key={record._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {record.profilePic ? (
                                                    <img
                                                        src={record.profilePic}
                                                        alt={record.name}
                                                        className="w-9 h-9 rounded-xl object-cover shadow-sm"
                                                    />
                                                ) : (
                                                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${getGradient(index)} flex items-center justify-center text-white text-xs font-black shadow-sm`}>
                                                        {getInitials(record.name)}
                                                    </div>
                                                )}
                                                <div className="flex flex-col">
                                                  <span className="text-sm font-bold text-gray-900">{record.name}</span>
                                                  <span className="text-[10px] text-gray-400 font-medium">{record.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">{record.projectName}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">{record.sessionDate}</td>
                                        <td className="px-6 py-4 text-[11px] text-gray-400 font-bold"> {new Date(record.submittedAt).toLocaleString()} </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 ${record.status === 'Present'
                                                    ? 'bg-green-50 text-green-600 border border-green-100/80'
                                                    : 'bg-red-50 text-red-600 border border-red-100/80'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${record.status === 'Present' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                    {record.status}
                                                </span>
                                                <button
                                                    onClick={() => handleOpenEditModal(record)}
                                                    className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all cursor-pointer flex items-center justify-center group"
                                                    title={`Edit status for ${record.name} (Current: ${record.status})`}
                                                    aria-label={`Edit status for ${record.name}`}
                                                >
                                                    <Edit3 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Attendance Status Modal */}
            {editingRecord && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in"
                    onClick={handleCloseEditModal}
                >
                    <div 
                        className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                                    <Edit3 className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-black text-gray-900 tracking-tight">Edit Attendance Status</h3>
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Change volunteer status</p>
                                </div>
                            </div>
                            <button
                                onClick={handleCloseEditModal}
                                disabled={updatingStatus}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Volunteer Details Card */}
                        <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100 mb-6 space-y-2.5">
                            <div className="flex items-center gap-3">
                                {editingRecord.profilePic ? (
                                    <img
                                        src={editingRecord.profilePic}
                                        alt={editingRecord.name}
                                        className="w-10 h-10 rounded-xl object-cover shadow-xs"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-xs">
                                        {getInitials(editingRecord.name)}
                                    </div>
                                )}
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-black text-gray-900 truncate">{editingRecord.name}</p>
                                    <p className="text-[11px] font-medium text-gray-400 truncate">{editingRecord.email || 'No email'}</p>
                                </div>
                            </div>
                            <div className="pt-2.5 border-t border-gray-200/60 grid grid-cols-2 gap-2 text-xs">
                                <div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Project</span>
                                    <span className="font-bold text-gray-700 truncate block">{editingRecord.projectName}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Date</span>
                                    <span className="font-bold text-gray-700 block">{editingRecord.sessionDate}</span>
                                </div>
                            </div>
                        </div>

                        {/* Status Selection Cards */}
                        <div className="mb-6">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">
                                Select New Status
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {/* Present Option */}
                                <button
                                    type="button"
                                    onClick={() => setSelectedStatus('Present')}
                                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                                        selectedStatus === 'Present'
                                            ? 'border-green-500 bg-green-50/70 text-green-700 shadow-lg shadow-green-500/10'
                                            : 'border-gray-200 hover:border-green-300 hover:bg-gray-50/50 text-gray-600'
                                    }`}
                                >
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                                        selectedStatus === 'Present' ? 'bg-green-600 text-white shadow-sm' : 'bg-gray-100 text-gray-400'
                                    }`}>
                                        <Check className="w-4 h-4 stroke-[3]" />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-wider">Present</span>
                                    <span className="text-[10px] text-gray-400 font-semibold">Attended event</span>
                                </button>

                                {/* Absent Option */}
                                <button
                                    type="button"
                                    onClick={() => setSelectedStatus('Absent')}
                                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                                        selectedStatus === 'Absent'
                                            ? 'border-red-500 bg-red-50/70 text-red-700 shadow-lg shadow-red-500/10'
                                            : 'border-gray-200 hover:border-red-300 hover:bg-gray-50/50 text-gray-600'
                                    }`}
                                >
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                                        selectedStatus === 'Absent' ? 'bg-red-600 text-white shadow-sm' : 'bg-gray-100 text-gray-400'
                                    }`}>
                                        <X className="w-4 h-4 stroke-[3]" />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-wider">Absent</span>
                                    <span className="text-[10px] text-gray-400 font-semibold">Did not attend</span>
                                </button>
                            </div>
                        </div>

                        {/* Status Change Summary Box */}
                        <div className="mb-6 p-3 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center justify-between text-xs text-blue-900">
                            <span className="text-[11px] font-medium text-gray-600">Current Status:</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                                editingRecord.status === 'Present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                                {editingRecord.status}
                            </span>
                        </div>

                        {/* Modal Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={handleCloseEditModal}
                                disabled={updatingStatus}
                                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => handleUpdateStatus()}
                                disabled={updatingStatus || selectedStatus === editingRecord.status}
                                className={`flex-1 py-3 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                                    selectedStatus === 'Present'
                                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-green-500/25'
                                        : 'bg-gradient-to-r from-red-500 to-rose-600 hover:shadow-red-500/25'
                                }`}
                            >
                                {updatingStatus ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : selectedStatus === editingRecord.status ? (
                                    'No Change'
                                ) : (
                                    `Mark as ${selectedStatus}`
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
