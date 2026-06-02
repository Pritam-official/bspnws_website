"use client";

import React, { useEffect, useState } from 'react';
import { Loader2, Search, Calendar, Check, X, FileText, User, Clock, CheckCircle, XCircle, MessageSquare } from 'lucide-react';

const calculateDays = (start: string, end: string, durationType: string) => {
    if (durationType === 'Half Day') return 0.5;
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return 0;
    const diffTime = Math.abs(e.getTime() - s.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

export default function StaffLeaveAdminPage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    // Modal state for approval/rejection remarks
    const [modalData, setModalData] = useState<{
        isOpen: boolean;
        requestId: string;
        staffName: string;
        action: 'approved' | 'rejected';
        remarks: string;
    }>({
        isOpen: false,
        requestId: '',
        staffName: '',
        action: 'approved',
        remarks: ''
    });

    const fetchLeaves = async () => {
        try {
            const res = await fetch('/api/admin/staff/leave');
            const data = await res.json();
            if (Array.isArray(data)) {
                setRequests(data);
            }
        } catch (error) {
            console.error('Failed to fetch leave requests:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const openActionModal = (id: string, staffName: string, action: 'approved' | 'rejected') => {
        setModalData({
            isOpen: true,
            requestId: id,
            staffName: staffName,
            action: action,
            remarks: ''
        });
    };

    const handleModalSubmit = async () => {
        const { requestId, action, remarks } = modalData;
        
        setUpdatingId(requestId);
        setModalData(prev => ({ ...prev, isOpen: false }));
        
        try {
            const res = await fetch('/api/admin/staff/leave', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    id: requestId, 
                    status: action,
                    adminRemarks: remarks
                }),
            });
            if (res.ok) {
                alert(`Leave request has been successfully ${action}!`);
                fetchLeaves();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to update leave request');
            }
        } catch (error) {
            console.error('Failed to update leave status:', error);
            alert('An error occurred while updating status.');
        } finally {
            setUpdatingId(null);
        }
    };

    // Filter and search requests
    const filtered = requests.filter(req => {
        const matchesSearch = 
            req.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (req.reason && req.reason.toLowerCase().includes(searchTerm.toLowerCase()));
        
        if (activeFilter === 'all') return matchesSearch;
        return matchesSearch && req.status === activeFilter;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-rose-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">
                        Leave <span className="text-rose-600">Requests</span>
                    </h1>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-wider mt-1">
                        Approve, reject, and manage staff leave submissions
                    </p>
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, email, reason..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all w-full shadow-sm"
                    />
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 border-b border-gray-100">
                {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveFilter(tab)}
                        className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border shrink-0 ${
                            activeFilter === tab
                            ? 'bg-rose-600 border-rose-600 text-white shadow-md shadow-rose-600/10'
                            : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50'
                        }`}
                    >
                        {tab} Requests
                    </button>
                ))}
            </div>

            {/* Leave Requests Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/40 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Staff Member</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Leave Details</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Reason & Comments</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="text-right px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((req) => (
                                <tr key={req._id} className="border-b border-gray-50 hover:bg-rose-50/10 transition-colors">
                                    {/* Staff info */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {req.profilePic ? (
                                                <img 
                                                    src={req.profilePic} 
                                                    alt={req.fullName} 
                                                    className="w-10 h-10 rounded-xl object-cover shadow-md shadow-rose-500/10 border border-gray-100"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-rose-500/10">
                                                    <User className="w-4 h-4 text-white" />
                                                </div>
                                            )}
                                            <div>
                                                <span className="text-sm font-bold text-gray-900 block">{req.fullName}</span>
                                                <span className="text-xs text-gray-400 font-semibold">{req.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    {/* Leave dates and types */}
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5">
                                                <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-600 text-[8px] font-black uppercase tracking-wider">
                                                    {req.leaveType || 'General'}
                                                </span>
                                                <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[8px] font-black uppercase tracking-wider">
                                                    {req.durationType || 'Full Day'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-600 mt-1">
                                                <Calendar className="w-4 h-4 text-rose-500 shrink-0" />
                                                <span>
                                                    {req.startDate === req.endDate ? req.startDate : `${req.startDate} to ${req.endDate}`}
                                                </span>
                                                <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-600 text-[8px] font-black uppercase tracking-wider shrink-0">
                                                    {calculateDays(req.startDate, req.endDate, req.durationType)} {calculateDays(req.startDate, req.endDate, req.durationType) === 1 ? 'Day' : 'Days'}
                                                </span>
                                                <span className="text-gray-300">•</span>
                                                <span className="text-[11px] font-semibold text-gray-500 shrink-0">
                                                    {req.fromTime || '09:00'} - {req.toTime || '17:00'}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    {/* Reason */}
                                    <td className="px-6 py-4 max-w-xs">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                                                <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                <span className="truncate" title={req.reason}>{req.reason}</span>
                                            </div>
                                            {req.adminRemarks && (
                                                <div className="flex items-start gap-1 text-[10px] text-gray-500 bg-gray-50 border border-gray-100 rounded-lg p-1.5 max-w-[220px]">
                                                    <MessageSquare className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                                                    <span className="italic break-words">
                                                        <strong>Remarks: </strong> {req.adminRemarks}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    {/* Status pill */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5">
                                            {req.status === 'pending' ? (
                                                <Clock className="w-4 h-4 text-orange-500" />
                                            ) : req.status === 'approved' ? (
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                            ) : (
                                                <XCircle className="w-4 h-4 text-red-500" />
                                            )}
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                                req.status === 'approved' 
                                                    ? 'bg-green-50 text-green-600' 
                                                    : req.status === 'rejected' 
                                                    ? 'bg-red-50 text-red-600' 
                                                    : 'bg-orange-50 text-orange-600'
                                            }`}>
                                                {req.status}
                                            </span>
                                        </div>
                                    </td>
                                    {/* Actions */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            {req.status === 'pending' ? (
                                                updatingId === req._id ? (
                                                    <Loader2 className="w-4 h-4 text-rose-600 animate-spin" />
                                                ) : (
                                                    <>
                                                        <button 
                                                            onClick={() => openActionModal(req._id, req.fullName, 'approved')}
                                                            className="p-2 hover:bg-green-50 rounded-lg text-gray-400 hover:text-green-600 transition-colors"
                                                            title="Approve with remarks"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => openActionModal(req._id, req.fullName, 'rejected')}
                                                            className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors"
                                                            title="Reject with remarks"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )
                                            ) : (
                                                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Processed</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filtered.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">No leave requests found.</p>
                    </div>
                )}
            </div>

            {/* Premium Approval/Rejection Remarks Modal */}
            {modalData.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl border border-gray-100 animate-scale-in">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">
                                {modalData.action === 'approved' ? 'Approve' : 'Reject'} Leave Request
                            </h3>
                            <button 
                                onClick={() => setModalData(prev => ({ ...prev, isOpen: false }))}
                                className="p-1.5 hover:bg-gray-150 rounded-lg text-gray-400 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mb-4">
                            <p className="text-sm text-gray-600 font-medium">
                                You are about to <strong className={modalData.action === 'approved' ? 'text-green-600' : 'text-red-600'}>{modalData.action}</strong> the leave request for <strong className="text-gray-900">{modalData.staffName}</strong>.
                            </p>
                        </div>

                        <div className="space-y-1.5 mb-6">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Admin Remarks / Comments (Optional)</label>
                            <textarea
                                placeholder="Add comments or instructions for the staff member..."
                                value={modalData.remarks}
                                onChange={(e) => setModalData(prev => ({ ...prev, remarks: e.target.value }))}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-gray-700 h-24 resize-none"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setModalData(prev => ({ ...prev, isOpen: false }))}
                                className="flex-1 py-3 bg-gray-50 border border-gray-100 text-gray-500 hover:bg-gray-100 text-xs font-black uppercase tracking-widest rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleModalSubmit}
                                className={`flex-1 py-3 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg ${
                                    modalData.action === 'approved'
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-green-500/20 active:scale-[0.98]'
                                    : 'bg-gradient-to-r from-red-500 to-rose-600 shadow-red-500/20 active:scale-[0.98]'
                                }`}
                            >
                                Submit {modalData.action === 'approved' ? 'Approval' : 'Rejection'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
