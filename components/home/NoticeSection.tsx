"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Notice {
    _id: string;
    title: string;
    date: string;
    fileType: 'PDF' | 'Image';
}

const NoticeSection = () => {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const res = await fetch('/api/notices');
                const data = await res.json();
                if (Array.isArray(data)) {
                    // Show only the latest 3 notices
                    setNotices(data.slice(0, 3));
                }
            } catch (error) {
                console.error("Failed to fetch notices:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNotices();
    }, []);

    if (!loading && notices.length === 0) return null;

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="max-w-2xl text-center md:text-left">
                        <div className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                            Stay Updated
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-none">
                            Latest <span className="text-primary italic">Notices</span>
                        </h2>
                        <p className="text-gray-500 font-medium mt-4 text-lg">
                            Important announcements, event updates, and official communications from our society.
                        </p>
                    </div>
                    <Link 
                        href="/notice" 
                        className="group flex items-center gap-3 text-sm font-black text-gray-900 uppercase tracking-widest hover:text-primary transition-colors"
                    >
                        View All Notices
                        <div className="w-10 h-10 rounded-full border-2 border-gray-100 flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </div>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="h-64 bg-gray-50 rounded-[2.5rem] animate-pulse border border-gray-100"></div>
                        ))
                    ) : (
                        notices.map((notice, idx) => (
                            <div 
                                key={notice._id} 
                                className="bg-white border-2 border-gray-50 p-8 rounded-[2.5rem] hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group flex flex-col h-full relative"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100">
                                        {notice.date}
                                    </span>
                                    <span className={`px-2 py-1 rounded text-[8px] font-black uppercase ${
                                        notice.fileType === 'PDF' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                                    }`}>
                                        {notice.fileType}
                                    </span>
                                </div>
                                <h3 className="text-xl font-black text-gray-900 mb-6 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                                    {notice.title}
                                </h3>
                                <div className="mt-auto pt-6 border-t border-gray-50">
                                    <Link 
                                        href="/notice" 
                                        className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all"
                                    >
                                        Read More
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default NoticeSection;
