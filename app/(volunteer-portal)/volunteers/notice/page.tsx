"use client";

import React, { useState, useEffect } from 'react';
import VolunteerSidebar from '@/components/volunteer-portal/VolunteerSidebar';
import VolunteerHeader from '@/components/volunteer-portal/VolunteerHeader';

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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [userData, setUserData] = useState<any>(null);
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedData = localStorage.getItem('volunteer_data');
        if (storedData) {
            setUserData(JSON.parse(storedData));
        }
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            const res = await fetch('/api/notices?targetAudience=volunteer');
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
        <div className="min-h-screen relative bg-gray-50 flex overflow-hidden">
            <VolunteerSidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

            <div className="flex-1 lg:ml-64 relative pb-20 overflow-y-auto">
                {/* Background Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-pink-600/5 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                {/* Navigation Header */}
                <VolunteerHeader userData={userData} setIsMobileMenuOpen={setIsMobileMenuOpen} />

                <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 space-y-8 animate-fade-in pb-24 lg:pb-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-none mb-2">
                                Notice <span className="text-pink-600">Board</span>
                            </h1>
                            <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px]">
                                Stay updated with the latest announcements
                            </p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white border border-gray-100 p-8 rounded-[2.5rem] animate-pulse h-[300px]">
                                    <div className="h-4 bg-gray-100 rounded w-1/3 mb-4"></div>
                                    <div className="h-6 bg-gray-100 rounded w-3/4 mb-4"></div>
                                    <div className="h-20 bg-gray-100 rounded w-full mb-4"></div>
                                    <div className="h-4 bg-gray-100 rounded w-1/4 mt-auto"></div>
                                </div>
                            ))}
                        </div>
                    ) : notices.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 border border-dashed border-gray-200 rounded-[3rem] bg-white/50 backdrop-blur-sm">
                            <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-300 mb-6 border border-gray-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-2">No Notices Yet</h3>
                            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Check back later for updates</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {notices.map((notice) => (
                                <div
                                    key={notice._id}
                                    className="bg-white border border-gray-100 p-8 rounded-[2.5rem] hover:border-pink-200 hover:shadow-2xl hover:shadow-pink-600/5 transition-all duration-300 group flex flex-col h-full shadow-xl shadow-gray-200/50"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100">
                                            {notice.date}
                                        </span>
                                        <div className={`w-3 h-3 rounded-full bg-pink-600 shadow-[0_0_12px_rgba(219,39,119,0.3)]`}></div>
                                    </div>

                                    <h3 className="text-xl font-black text-gray-900 mb-4 group-hover:text-pink-600 transition-colors leading-tight">
                                        {notice.title}
                                    </h3>

                                    <div className="flex-1">
                                        <p className="text-gray-500 font-medium leading-relaxed text-sm">
                                            {notice.message || "No detailed message provided. Please refer to the attached file for more information."}
                                        </p>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-gray-50">
                                        <a 
                                            href={notice.file} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-xs font-black text-pink-600 flex items-center gap-2 group-hover:translate-x-1 transition-transform cursor-pointer uppercase tracking-widest"
                                        >
                                            View {notice.fileType}
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
