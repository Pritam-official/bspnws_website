"use client";

import React, { useState, useEffect, useCallback } from 'react';

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

interface MembershipRecord {
    _id: string;
    name: string;
    phoneNumber: string;
    date: string;
    membershipStatus: string;
    renewalMonth: string;
    paymentMethod: string;
    amount: number;
    submittedAt: string;
}

function getInitials(name: string) {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

const gradients = [
    'from-blue-600 to-indigo-600',
    'from-rose-600 to-pink-600',
    'from-emerald-600 to-teal-600',
    'from-amber-600 to-orange-600',
    'from-violet-600 to-purple-600',
    'from-cyan-600 to-blue-600',
    'from-lime-600 to-green-600',
    'from-fuchsia-600 to-pink-600',
];

function getGradient(index: number) {
    return gradients[index % gradients.length];
}

export default function VolunteerMembershipPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterMonth, setFilterMonth] = useState('All');
    const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
    const [memberships, setMemberships] = useState<MembershipRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMemberships = useCallback(async (month: string) => {
        setLoading(true);
        setError(null);
        try {
            const query = month !== 'All' ? `?month=${encodeURIComponent(month)}` : '';
            const res = await fetch(`/api/admin/volunteer-membership${query}`);
            const data = await res.json();
            if (data.success) {
                setMemberships(data.data);
            } else {
                setError(data.message || 'Failed to load membership data.');
            }
        } catch {
            setError('Network error. Could not reach the server.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMemberships(filterMonth);
    }, [filterMonth, fetchMemberships]);

    // Client-side search filter (month filter is handled by API)
    const filtered = memberships.filter((m) => {
        const term = searchTerm.toLowerCase();
        return (
            m.name.toLowerCase().includes(term) ||
            m.phoneNumber.includes(searchTerm)
        );
    });

    // Stats
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const currentMonthIndex = months.indexOf(currentMonth);

    const upToDateMembers = memberships.filter((m) => {
        const monthIndex = months.indexOf(m.renewalMonth);
        return monthIndex >= currentMonthIndex;
    }).length;

    const totalRevenue = memberships.reduce((sum, m) => sum + (m.amount || 0), 0);

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '—';
        try {
            const d = new Date(dateStr);
            return d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* Header Section */}
                <div className="mb-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-1 h-8 bg-indigo-600 rounded-full"></div>
                                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                                    Volunteer Membership
                                </h1>
                            </div>
                            <p className="text-slate-500 font-medium pl-4">
                                Comprehensive management of volunteer contributions
                            </p>
                        </div>
                        <div className="hidden md:flex items-center gap-2 text-slate-400 text-sm">
                            <span className="inline-flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                Live Data
                            </span>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-slate-300 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">Active</span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 mb-1">
                            {loading ? '—' : memberships.length}
                        </p>
                        <p className="text-sm font-medium text-slate-500">Total Records</p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-slate-300 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Current</span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 mb-1">
                            {loading ? '—' : upToDateMembers}
                        </p>
                        <p className="text-sm font-medium text-slate-500">Up to Date</p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-slate-300 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Pending</span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 mb-1">
                            {loading ? '—' : memberships.length - upToDateMembers}
                        </p>
                        <p className="text-sm font-medium text-slate-500">Awaiting Renewal</p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-slate-300 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className="text-xs font-medium text-violet-600 bg-violet-50 px-2 py-1 rounded-full">Revenue</span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900 mb-1">
                            {loading ? '—' : `₹${totalRevenue.toLocaleString('en-IN')}`}
                        </p>
                        <p className="text-sm font-medium text-slate-500">Total Collection</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-8 shadow-sm">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                        <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full lg:w-auto">
                            {/* Search */}
                            <div className="relative flex-1 min-w-[280px]">
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search by name or phone..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                />
                            </div>

                            {/* Month Filter */}
                            <div className="relative">
                                <select
                                    value={filterMonth}
                                    onChange={(e) => setFilterMonth(e.target.value)}
                                    className="appearance-none bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer min-w-[160px]"
                                >
                                    <option value="All">All Months</option>
                                    {months.map((m) => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        {/* View Mode Toggle */}
                        <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setViewMode('table')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'table' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                            <p className="text-slate-500 font-medium">Loading membership records...</p>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {!loading && error && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                        <svg className="w-10 h-10 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-red-700 font-semibold">{error}</p>
                        <button
                            onClick={() => fetchMemberships(filterMonth)}
                            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Grid View */}
                {!loading && !error && viewMode === 'grid' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((m, index) => (
                            <div key={m._id} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300">
                                <div className="p-6">
                                    <div className="flex items-center gap-4 mb-5">
                                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getGradient(index)} flex items-center justify-center text-white text-base font-bold shadow-md group-hover:scale-105 transition-transform duration-300`}>
                                            {getInitials(m.name)}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-0.5">{m.name}</h3>
                                            <p className="text-xs text-slate-500 font-medium">{m.phoneNumber}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-slate-100">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Paid Up To</span>
                                            <span className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold">
                                                {m.renewalMonth}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Membership Plan</span>
                                            <span className="text-sm font-bold text-indigo-600 capitalize">{m.membershipStatus}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Payment Date</span>
                                            <span className="text-sm font-medium text-slate-700">{formatDate(m.date)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</span>
                                            <span className="text-sm font-bold text-slate-900">₹{m.amount?.toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Method</span>
                                            <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${m.paymentMethod === 'online' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>
                                                {m.paymentMethod === 'online' ? 'Online' : 'Offline'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-slate-50 px-6 py-3 border-t border-slate-100">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-500 capitalize">{m.membershipStatus}</span>
                                        <span className="text-emerald-600 font-medium">Complete</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Table View */}
                {!loading && !error && viewMode === 'table' && (
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Volunteer</th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Contact</th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider hidden md:table-cell">Paid Up To</th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider hidden md:table-cell">Plan</th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider hidden lg:table-cell">Payment Date</th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider hidden lg:table-cell">Amount</th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Method</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filtered.map((m, index) => (
                                        <tr key={m._id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getGradient(index)} flex items-center justify-center text-white text-sm font-bold`}>
                                                        {getInitials(m.name)}
                                                    </div>
                                                    <span className="text-sm font-semibold text-slate-900">{m.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600 font-medium">{m.phoneNumber}</td>
                                            <td className="px-6 py-4 hidden md:table-cell">
                                                <span className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold">
                                                    {m.renewalMonth}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 hidden md:table-cell">
                                                <span className="text-sm font-medium text-indigo-600 capitalize">{m.membershipStatus}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600 font-medium hidden lg:table-cell">{formatDate(m.date)}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-slate-900 hidden lg:table-cell">₹{m.amount?.toLocaleString('en-IN')}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${m.paymentMethod === 'online' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>
                                                    {m.paymentMethod === 'online' ? 'Online' : 'Offline'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && filtered.length === 0 && (
                    <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">No records found</h3>
                        <p className="text-sm text-slate-500 font-medium">
                            {filterMonth !== 'All'
                                ? `No membership payments recorded for ${filterMonth}.`
                                : 'No membership records exist yet.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}