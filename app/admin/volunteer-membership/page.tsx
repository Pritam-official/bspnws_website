"use client";

import React, { useState } from 'react';

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const dummyMembership = [
    { id: 1, name: 'Rahul Sharma', phone: '+91-9876543210', paidUpToMonth: 'May', status: 'Complete', date: '15/05/2026', initials: 'RS', gradient: 'from-blue-500 to-indigo-600' },
    { id: 2, name: 'Priya Das', phone: '+91-9123456789', paidUpToMonth: 'April', status: 'Complete', date: '10/04/2026', initials: 'PD', gradient: 'from-pink-500 to-rose-600' },
    { id: 3, name: 'Amit Kumar', phone: '+91-9988776655', paidUpToMonth: 'March', status: 'Complete', date: '05/03/2026', initials: 'AK', gradient: 'from-emerald-500 to-green-600' },
    { id: 4, name: 'Sneha Roy', phone: '+91-8877665544', paidUpToMonth: 'June', status: 'Complete', date: '01/06/2026', initials: 'SR', gradient: 'from-amber-500 to-orange-600' },
    { id: 5, name: 'Deepak Ghosh', phone: '+91-7766554433', paidUpToMonth: 'February', status: 'Complete', date: '20/02/2026', initials: 'DG', gradient: 'from-violet-500 to-purple-600' },
    { id: 6, name: 'Anjali Dey', phone: '+91-6655443322', paidUpToMonth: 'May', status: 'Complete', date: '12/05/2026', initials: 'AD', gradient: 'from-cyan-500 to-teal-600' },
];

export default function VolunteerMembershipPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterMonth, setFilterMonth] = useState('All');

    const filtered = dummyMembership.filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.phone.includes(searchTerm);
        const matchesMonth = filterMonth === 'All' || m.paidUpToMonth === filterMonth;
        return matchesSearch && matchesMonth;
    });

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Volunteer Membership</h1>
                <p className="text-sm text-gray-400 font-bold mt-1">Track volunteer membership payment status</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4 hover:shadow-lg transition-all">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <div>
                        <p className="text-2xl font-black text-gray-900">{dummyMembership.length}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Members</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4 hover:shadow-lg transition-all">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                        <p className="text-2xl font-black text-gray-900">{dummyMembership.length}</p>
                        <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Paid Complete</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4 hover:shadow-lg transition-all">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-pink-500/20">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                        <p className="text-2xl font-black text-gray-900">₹{dummyMembership.length * 100}</p>
                        <p className="text-[10px] font-black text-pink-600 uppercase tracking-widest">Total Collected</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input type="text" placeholder="Search by name or phone..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all" />
                </div>
                <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all appearance-none cursor-pointer">
                    <option value="All">All Months</option>
                    {months.map(m => (<option key={m} value={m}>{m}</option>))}
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">All Membership Records</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Volunteer</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest hidden md:table-cell">Paid Up To</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest hidden sm:table-cell">Date</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((m) => (
                                <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${m.gradient} flex items-center justify-center text-white text-xs font-black shadow-sm`}>{m.initials}</div>
                                            <span className="text-sm font-bold text-gray-900">{m.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">{m.phone}</td>
                                    <td className="px-6 py-4 hidden md:table-cell"><span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold">{m.paidUpToMonth}</span></td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-medium hidden sm:table-cell">{m.date}</td>
                                    <td className="px-6 py-4"><span className="px-3 py-1 rounded-lg bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest">{m.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filtered.length === 0 && (<div className="text-center py-12"><p className="text-sm text-gray-400 font-bold">No records found.</p></div>)}
            </div>
        </div>
    );
}
