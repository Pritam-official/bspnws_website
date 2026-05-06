"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="max-w-[1400px] mx-auto px-4 h-20 flex items-center justify-between gap-4">
                    <Link href="/" className="flex-shrink-0 flex items-center gap-2 group">
                        <div className="relative w-12 h-12 transition-transform group-hover:scale-105">
                            <Image src="/logo.jpg" alt="Logo" fill className="object-contain rounded-full border border-gray-100" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-black tracking-tighter text-gray-900 leading-none">BSPNWS</span>
                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none mt-0.5">Welfare Society</span>
                        </div>
                    </Link>
                    <Link href="/volunteers/dashboard" className="text-sm font-bold text-gray-600 hover:text-primary transition-colors">
                        Back to Dashboard
                    </Link>
                </div>
            </nav>

            <div className="pt-32 pb-24 container mx-auto px-4 max-w-6xl">
                <div className="space-y-8 animate-slide-up">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                            Notice <span className="text-primary">Board</span>
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                            Stay updated with the latest announcements, schedules, and important information from the administration.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {notices.map((notice) => (
                            <div
                                key={notice.id}
                                className="bg-white border-2 border-gray-100 p-6 rounded-2xl hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group flex flex-col h-full"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full">
                                        {notice.date}
                                    </span>
                                    <div className={`w-3 h-3 rounded-full ${notice.priority === 'high' ? 'bg-red-500 animate-pulse' :
                                        notice.priority === 'medium' ? 'bg-amber-500' : 'bg-green-500'
                                        }`} title={`Priority: ${notice.priority}`}></div>
                                </div>

                                <h3 className="text-xl font-extrabold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                                    {notice.title}
                                </h3>

                                <div className="flex-1">
                                    <p className="text-gray-600 leading-relaxed text-sm">
                                        {notice.message}
                                    </p>
                                </div>

                                <div className="mt-6 pt-4 border-t border-gray-50">
                                    <span className="text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform cursor-pointer">
                                        Read details
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty state example */}
                    {notices.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">No Notices Yet</h3>
                            <p className="text-gray-500 text-sm">Check back later for updates from the admin.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
