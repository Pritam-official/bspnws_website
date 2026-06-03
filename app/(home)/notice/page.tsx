"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/shared/Navbar';
import Image from 'next/image';

interface Notice {
    _id: string;
    title: string;
    file: string;
    message?: string;
    fileType: 'PDF' | 'Image';
    date: string;
    createdAt: string;
}

export default function NoticePage() {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            const res = await fetch('/api/notices');
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

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            
            <main className="flex-grow pt-24 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight mb-4">
                            General <span className="text-primary">Notices</span>
                        </h1>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
                            Official announcements and updates from BSPNWS
                        </p>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white rounded-3xl border border-gray-100 p-8 h-80 animate-pulse"></div>
                            ))}
                        </div>
                    ) : notices.length === 0 ? (
                        <div className="bg-white rounded-[3rem] p-20 text-center border border-gray-100 shadow-xl shadow-gray-200/50">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">No Notices Available</h3>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Check back later for official updates</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {notices.map((notice) => (
                                <div key={notice._id} className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-xl shadow-gray-200/30 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 transition-all group flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-6">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100">
                                            {notice.date}
                                        </span>
                                        <div className="w-3 h-3 bg-primary rounded-full shadow-[0_0_12px_rgba(50,205,50,0.4)]"></div>
                                    </div>

                                    <h3 className="text-xl font-black text-gray-900 mb-4 group-hover:text-primary transition-colors leading-tight">
                                        {notice.title}
                                    </h3>

                                    <div className="flex-1">
                                        <p className="text-gray-500 font-medium leading-relaxed text-sm line-clamp-4">
                                            {notice.message || "Please refer to the attached document for full details regarding this notice."}
                                        </p>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-gray-50">
                                        <a 
                                            href={notice.file} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-3 text-xs font-black text-primary uppercase tracking-widest hover:gap-4 transition-all"
                                        >
                                            View {notice.fileType}
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

        </div>
    );
}
