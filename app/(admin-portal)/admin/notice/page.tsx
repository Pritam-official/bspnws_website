"use client";

import React, { useState, useEffect } from 'react';

interface Notice {
    _id: string;
    title: string;
    file: string; // This will now be a Google Drive Link
    message?: string;
    fileType: 'PDF' | 'Image';
    date: string;
    createdAt: string;
}

export default function NoticePage() {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ 
        title: '',
        message: '',
        file: '', // Google Drive Link
        fileType: 'PDF' as 'PDF' | 'Image',
        date: new Date().toLocaleDateString('en-GB')
    });

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            const res = await fetch('/api/admin/notices');
            const data = await res.json();
            if (Array.isArray(data)) {
                setNotices(data);
            }
        } catch (error) {
            console.error("Failed to fetch notices:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.file) {
            alert('Please provide a title and a Google Drive link');
            return;
        }
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/admin/notices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setFormData({ 
                    title: '', 
                    message: '',
                    file: '', 
                    fileType: 'PDF', 
                    date: new Date().toLocaleDateString('en-GB') 
                });
                fetchNotices();
                alert('Notice broadcasted successfully!');
            } else {
                const error = await res.json();
                alert(`Error: ${error.error}`);
            }
        } catch (error) {
            console.error("Failed to add notice:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this notice?')) return;
        try {
            const res = await fetch(`/api/admin/notices?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchNotices();
                alert('Notice deleted successfully!');
            } else {
                alert('Failed to delete notice');
            }
        } catch (error) {
            console.error("Failed to delete notice:", error);
        }
    };

    const getGradient = (type: string) => {
        return type === 'PDF' ? 'from-pink-500 to-rose-600' : 'from-emerald-500 to-green-600';
    };

    return (
        <div>
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Notices</h1>
                <p className="text-sm text-gray-400 font-bold mt-1">Manage all notice postings via Google Drive links</p>
            </div>

            {/* Add New Notice Form */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center text-white">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    Broadcast New Notice
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Enter notice title"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Google Drive Link (PDF/Image)</label>
                            <div className="relative">
                                <input
                                    type="url"
                                    value={formData.file}
                                    onChange={(e) => setFormData(prev => ({ ...prev, file: e.target.value }))}
                                    placeholder="https://drive.google.com/file/d/..."
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                                />
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.826L11.414 10M11.414 10l1.293-1.293A4 4 0 0011.414 3H5.586A2 2 0 004 5v14a2 2 0 002 2h8a2 2 0 002-2v-3.586a2 2 0 01.586-1.414l2-2a2 2 0 012.828 0 2 2 0 010 2.828l-2 2" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                        <div className="lg:col-span-2 space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Message (Optional)</label>
                            <textarea
                                value={formData.message}
                                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                                placeholder="Enter detailed message for volunteers..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all resize-none h-24"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Link Type</label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, fileType: 'PDF' }))}
                                    className={`py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${
                                        formData.fileType === 'PDF' 
                                        ? 'bg-pink-50 border-pink-500 text-pink-600 shadow-sm' 
                                        : 'bg-gray-50 border-gray-100 text-gray-400 hover:bg-gray-100'
                                    }`}
                                >
                                    PDF
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, fileType: 'Image' }))}
                                    className={`py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${
                                        formData.fileType === 'Image' 
                                        ? 'bg-pink-50 border-pink-500 text-pink-600 shadow-sm' 
                                        : 'bg-gray-50 border-gray-100 text-gray-400 hover:bg-gray-100'
                                    }`}
                                >
                                    Image
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full lg:w-auto px-10 py-4 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl text-sm font-black uppercase tracking-widest shadow-lg shadow-pink-500/20 hover:shadow-xl hover:shadow-pink-500/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {isSubmitting ? 'Broadcasting...' : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.167a2.405 2.405 0 00-1.712-1.558L1.1 11.111A1.76 1.76 0 011.1 7.778l2.724-.722a2.405 2.405 0 001.712-1.558L7.683 2.1a1.76 1.76 0 013.417.592z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Broadcast Notice
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Notices List */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center text-[#111827]">
                    <h2 className="text-sm font-black uppercase tracking-widest">Current Broadcasts</h2>
                    {!loading && <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{notices.length} Active</span>}
                </div>
                <div className="divide-y divide-gray-50">
                    {loading ? (
                        <div className="p-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">Loading notices...</div>
                    ) : notices.length === 0 ? (
                        <div className="p-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">No active notices found.</div>
                    ) : (
                        notices.map((notice) => (
                            <div key={notice._id} className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-5 sm:py-4 gap-4 hover:bg-gray-50/50 transition-colors">
                                <div className="flex items-center gap-4 min-w-0 flex-1">
                                    <div className={`w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br ${getGradient(notice.fileType)} flex items-center justify-center text-white shadow-sm`}>
                                        {notice.fileType === 'PDF' ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-bold text-gray-900 truncate">{notice.title}</p>
                                        <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{notice.message || "No detailed message"}</p>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <span className="text-[10px] font-bold text-gray-400">{notice.date}</span>
                                            <span className="text-[10px] font-bold text-gray-300">•</span>
                                            <span className={`text-[10px] font-black uppercase ${
                                                notice.fileType === 'PDF' ? 'text-red-500' : 'text-blue-500'
                                            }`}>
                                                {notice.fileType} LINK
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 self-end sm:self-auto">
                                    <a 
                                        href={notice.file} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="p-2.5 bg-gray-50 sm:bg-transparent hover:bg-blue-50 rounded-lg transition-colors group" 
                                        title="View Link"
                                    >
                                        <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                    <button 
                                        onClick={() => handleDelete(notice._id)}
                                        className="p-2.5 bg-gray-50 sm:bg-transparent hover:bg-red-50 rounded-lg transition-colors group" 
                                        title="Delete"
                                    >
                                        <svg className="w-4 h-4 text-gray-400 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
