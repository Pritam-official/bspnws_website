"use client";

import React, { useEffect, useState } from 'react';
import { Loader2, Trash2 } from 'lucide-react';

export default function VolunteerRequestsPage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const res = await fetch('/api/admin/volunteers/requests');
            const data = await res.json();
            setRequests(data);
        } catch (error) {
            console.error('Failed to fetch requests:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleApprove = async (id: string) => {
        if (!confirm('Are you sure you want to approve this volunteer?')) return;
        try {
            const res = await fetch('/api/admin/volunteers/requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, action: 'approve' }),
            });
            if (res.ok) {
                fetchRequests();
            }
        } catch (error) {
            console.error('Approval error:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this request?')) return;
        try {
            const res = await fetch('/api/admin/volunteers/requests', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            if (res.ok) {
                fetchRequests();
            }
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div>
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Volunteer Requests</h1>
                <p className="text-sm text-gray-400 font-bold mt-1">Review and approve pending volunteer applications</p>
            </div>

            {/* Requests Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Applicant</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest hidden md:table-cell">Email</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest hidden lg:table-cell">Address</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest hidden sm:table-cell">Date</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="text-right px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((v) => (
                                <tr key={v._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-xs font-black shadow-sm overflow-hidden">
                                                {v.profilePic ? (
                                                    <img src={v.profilePic} alt={v.fullName} className="w-full h-full object-cover" />
                                                ) : (
                                                    v.fullName.charAt(0)
                                                )}
                                            </div>
                                            <span className="text-sm font-bold text-gray-900">{v.fullName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">{v.phoneNumber}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-medium hidden md:table-cell">{v.email}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-medium hidden lg:table-cell">{v.address}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-medium hidden sm:table-cell">
                                        {new Date(v.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 rounded-lg bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest">
                                            {v.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => handleApprove(v._id)}
                                                className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg text-xs font-black uppercase tracking-wider transition-colors" 
                                                title="Approve"
                                            >
                                                Approve
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(v._id)}
                                                className="p-2 hover:bg-red-50 rounded-lg transition-colors group" 
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {requests.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-sm text-gray-400 font-bold">No pending requests found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
