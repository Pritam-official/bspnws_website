"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import VolunteerSidebar from '@/components/volunteer-portal/VolunteerSidebar';

// Dummy data for notices
const notices = [
    {
        id: 1,
        title: "Annual General Meeting",
        date: "Oct 24, 2023",
        priority: "high",
        message: "All volunteers are requested to attend the annual general meeting this Friday at the community hall. We will be discussing the roadmap for the upcoming year and recognizing outstanding contributions."
    },
    {
        id: 2,
        title: "Winter Drive Logistics",
        date: "Nov 12, 2023",
        priority: "medium",
        message: "Please review the updated logistics plan for the Winter Donation Drive. The collection points have been shifted to the main square to accommodate more donors."
    },
    {
        id: 3,
        title: "New Safety Guidelines",
        date: "Dec 05, 2023",
        priority: "high",
        message: "Implementation of new safety protocols is mandatory for all field volunteers starting next week. Please collect your safety kits from the office."
    },
    {
        id: 4,
        title: "Volunteer Appreciation Day",
        date: "Jan 15, 2024",
        priority: "low",
        message: "Join us for a fun-filled day of games and food as we celebrate the hard work of our volunteer team! RSVPs are open until Wednesday."
    }
];

export default function NoticePage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        const storedData = localStorage.getItem('volunteer_data');
        if (storedData) {
            setUserData(JSON.parse(storedData));
        }
    }, []);

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
                <header className="relative z-20 bg-white/60 backdrop-blur-md border-b border-white/60 px-4 sm:px-8 py-4 sticky top-0">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {/* Hamburger Menu - Mobile Only */}
                            <button 
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-pink-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                            </button>

                            <Link href="/" className="flex items-center gap-3 group">
                                <div className="w-10 h-10 relative overflow-hidden rounded-xl shadow-lg transition-transform group-hover:scale-110">
                                    <Image src="/logo.jpg" alt="Logo" fill className="object-cover" />
                                </div>
                                <span className="text-xl font-black text-gray-900 tracking-tighter uppercase hidden sm:block">Volunteer Portal</span>
                            </Link>
                        </div>

                        <div className="flex items-center gap-4 sm:gap-6">
                            <button className="text-gray-400 hover:text-pink-600 font-bold transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                            </button>

                            <Link
                                href="/volunteers/profile"
                                className="w-10 h-10 rounded-full border-2 border-pink-600 shadow-xl shadow-pink-600/20 hover:scale-110 transition-all overflow-hidden relative group/btn cursor-pointer"
                            >
                                <Image
                                    src={userData?.profileImage || '/logo.jpg'}
                                    alt="Profile"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-pink-600/20 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                            </Link>
                        </div>
                    </div>
                </header>

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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {notices.map((notice) => (
                            <div
                                key={notice.id}
                                className="bg-white border border-gray-100 p-8 rounded-[2.5rem] hover:border-pink-200 hover:shadow-2xl hover:shadow-pink-600/5 transition-all duration-300 group flex flex-col h-full shadow-xl shadow-gray-200/50"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100">
                                        {notice.date}
                                    </span>
                                    <div className={`w-3 h-3 rounded-full ${notice.priority === 'high' ? 'bg-pink-600 animate-pulse shadow-[0_0_12px_rgba(219,39,119,0.5)]' :
                                        notice.priority === 'medium' ? 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.3)]' : 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                                        }`} title={`Priority: ${notice.priority}`}></div>
                                </div>

                                <h3 className="text-xl font-black text-gray-900 mb-4 group-hover:text-pink-600 transition-colors leading-tight">
                                    {notice.title}
                                </h3>

                                <div className="flex-1">
                                    <p className="text-gray-500 font-medium leading-relaxed text-sm">
                                        {notice.message}
                                    </p>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-50">
                                    <span className="text-xs font-black text-pink-600 flex items-center gap-2 group-hover:translate-x-1 transition-transform cursor-pointer uppercase tracking-widest">
                                        Read details
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty state example */}
                    {notices.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-24 border border-dashed border-gray-200 rounded-[3rem] bg-white/50 backdrop-blur-sm">
                            <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-300 mb-6 border border-gray-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-2">No Notices Yet</h3>
                            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Check back later for updates</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
