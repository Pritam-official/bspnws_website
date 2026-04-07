"use client";

import React, { useState } from 'react';

const dummyReports = [
    { id: 1, title: 'BSPNWS Annual Report 2025-26', type: 'Annual Reports', date: '15/03/2026', gradient: 'from-emerald-500 to-green-600' },
    { id: 2, title: 'Financial Audit Report Q4 2025', type: 'Audit Reports', date: '10/03/2026', gradient: 'from-blue-500 to-indigo-600' },
    { id: 3, title: 'IT Returns FY 2024-25', type: 'IT Returns', date: '01/03/2026', gradient: 'from-violet-500 to-purple-600' },
    { id: 4, title: 'BSPNWS Annual Report 2024-25', type: 'Annual Reports', date: '15/03/2025', gradient: 'from-emerald-500 to-green-600' },
];

const reportTypes = ['Annual Reports', 'Audit Reports', 'IT Returns'];

export default function AnnualReportsPage() {
    const [formData, setFormData] = useState({ type: 'Annual Reports' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Report add functionality will be enabled later.');
    };

    return (
        <div>
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Annual Reports</h1>
                <p className="text-sm text-gray-400 font-bold mt-1">Manage annual, audit, and IT return reports</p>
            </div>

            {/* Add New Report Form */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center text-white">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    Add New Report
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ type: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all appearance-none cursor-pointer"
                        >
                            {reportTypes.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Upload File (PDF or Image)</label>
                        <input
                            type="file"
                            accept=".pdf,image/*"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-600"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl text-sm font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300"
                        >
                            Add Report
                        </button>
                    </div>
                </form>
            </div>

            {/* Reports List */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">All Reports</h2>
                </div>
                <div className="divide-y divide-gray-50">
                    {dummyReports.map((report) => (
                        <div key={report.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${report.gradient} flex items-center justify-center text-white shadow-sm`}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{report.title}</p>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-[10px] font-bold text-gray-400">{report.date}</span>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                            report.type === 'Annual Reports' ? 'bg-emerald-50 text-emerald-600' :
                                            report.type === 'Audit Reports' ? 'bg-blue-50 text-blue-600' :
                                            'bg-violet-50 text-violet-600'
                                        }`}>
                                            {report.type}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors group" title="Edit">
                                    <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button className="p-2 hover:bg-red-50 rounded-lg transition-colors group" title="Delete">
                                    <svg className="w-4 h-4 text-gray-400 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
