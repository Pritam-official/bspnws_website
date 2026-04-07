"use client";

import React, { useState } from 'react';

const dummyNotices = [
    { id: 1, title: 'Annual General Meeting 2026', type: 'PDF', date: '30/03/2026', gradient: 'from-pink-500 to-rose-600' },
    { id: 2, title: 'Tree Plantation Drive - April 2026', type: 'Image', date: '28/03/2026', gradient: 'from-emerald-500 to-green-600' },
    { id: 3, title: 'Monthly Report Submission Deadline', type: 'PDF', date: '25/03/2026', gradient: 'from-blue-500 to-indigo-600' },
    { id: 4, title: 'Volunteer Training Workshop', type: 'PDF', date: '20/03/2026', gradient: 'from-violet-500 to-purple-600' },
];

export default function NoticePage() {
    const [formData, setFormData] = useState({ title: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Notice add functionality will be enabled later.');
    };

    return (
        <div>
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Notices</h1>
                <p className="text-sm text-gray-400 font-bold mt-1">Manage all notice postings</p>
            </div>

            {/* Add New Notice Form */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center text-white">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    Add New Notice
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter notice title"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Upload File (PDF or Image)</label>
                        <input
                            type="file"
                            accept=".pdf,image/*"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-pink-50 file:text-pink-600"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl text-sm font-black uppercase tracking-widest shadow-lg shadow-pink-500/20 hover:shadow-xl hover:shadow-pink-500/30 hover:-translate-y-0.5 transition-all duration-300"
                        >
                            Add Notice
                        </button>
                    </div>
                </form>
            </div>

            {/* Notices List */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">All Notices</h2>
                </div>
                <div className="divide-y divide-gray-50">
                    {dummyNotices.map((notice) => (
                        <div key={notice.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${notice.gradient} flex items-center justify-center text-white shadow-sm`}>
                                    {notice.type === 'PDF' ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{notice.title}</p>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-[10px] font-bold text-gray-400">{notice.date}</span>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                            notice.type === 'PDF' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                                        }`}>
                                            {notice.type}
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
