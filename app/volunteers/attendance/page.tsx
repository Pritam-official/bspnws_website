"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import VolunteerSidebar from '@/components/VolunteerSidebar';
import AttendanceSection from '@/components/AttendanceSection';

export default function VolunteerAttendancePage() {
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        const storedData = localStorage.getItem('volunteer_data');
        if (storedData) {
            setUserData(JSON.parse(storedData));
        }
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative bg-gray-50 flex overflow-hidden">
            <VolunteerSidebar />

            <div className="flex-1 lg:ml-64 relative pb-20 overflow-y-auto">
                {/* Background Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-pink-600/5 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                {/* Navigation Header */}
                <header className="relative z-20 bg-white/60 backdrop-blur-md border-b border-white/60 px-8 py-4">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 relative overflow-hidden rounded-xl shadow-lg transition-transform group-hover:scale-110">
                                <Image src="/logo.jpg" alt="Logo" fill className="object-cover" />
                            </div>
                            <span className="text-xl font-black text-gray-900 tracking-tighter uppercase">Volunteer Portal</span>
                        </Link>

                        <div className="flex items-center gap-6">
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

                <main className="relative z-10 max-w-7xl mx-auto px-8 pt-12 space-y-10 animate-fade-in">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-none mb-2">
                                Attendance <span className="text-pink-600">Logs</span>
                            </h1>
                            <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px]">
                                View and track your contribution history
                            </p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <AttendanceSection />
                    </div>
                </main>
            </div>
        </div>
    );
}
