"use client";

import React, { useEffect, useState } from 'react';
import { Loader2, Trash2, Search } from 'lucide-react';

export default function AllVolunteersPage() {
    const [volunteers, setVolunteers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchVolunteers = async () => {
        try {
            const res = await fetch('/api/admin/volunteers');
            const data = await res.json();
            setVolunteers(data);
        } catch (error) {
            console.error('Failed to fetch volunteers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVolunteers();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to remove this volunteer?')) return;
        try {
            const res = await fetch('/api/admin/volunteers', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            if (res.ok) {
                fetchVolunteers();
            }
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const filtered = volunteers.filter(v =>
        v.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">All Volunteers</h1>
                    <p className="text-sm text-gray-400 font-bold mt-1">Manage all registered volunteers</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search volunteers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all w-full sm:w-72"
                    />
                </div>
            </div>

            {/* Volunteers Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Volunteer</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest hidden md:table-cell">Email</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest hidden lg:table-cell">Address</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest hidden sm:table-cell">Joined</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="text-right px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((v) => (
                                <tr key={v._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-green-600 flex items-center justify-center text-white text-xs font-black shadow-sm overflow-hidden">
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
                                        {new Date(v.approvedAt || v.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 rounded-lg bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest">
                                            Active
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
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
                {filtered.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-sm text-gray-400 font-bold">No volunteers found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
