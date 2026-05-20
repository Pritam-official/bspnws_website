"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface VolunteerHeaderProps {
    userData: any;
    setIsMobileMenuOpen: (isOpen: boolean) => void;
    title?: string;
    showBack?: boolean;
}

export default function VolunteerHeader({ userData, setIsMobileMenuOpen, title, showBack }: VolunteerHeaderProps) {
    const [hasNotifications, setHasNotifications] = useState(false);

    useEffect(() => {
        if (!userData?.email) return;

        const checkNotifications = async () => {
            try {
                const res = await fetch(`/api/attendance/active?email=${userData.email}`);
                const data = await res.json();
                
                if (Array.isArray(data)) {
                    // Check if any active session has NOT been submitted yet
                    const pending = data.some(session => !session.hasSubmitted);
                    setHasNotifications(pending);
                }
            } catch (error) {
                console.error("Error checking notifications:", error);
            }
        };

        checkNotifications();

        const handleUpdate = () => checkNotifications();
        window.addEventListener('attendanceSubmitted', handleUpdate);

        // Check every 2 minutes for new events
        const interval = setInterval(checkNotifications, 120000);
        return () => {
            clearInterval(interval);
            window.removeEventListener('attendanceSubmitted', handleUpdate);
        };
    }, [userData?.email]);

    return (
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

                    {showBack ? (
                        <div className="flex items-center gap-2">
                            <Link href="/volunteers/dashboard" className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-pink-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            </Link>
                            {title && <span className="text-xl font-black text-gray-900 uppercase tracking-tight">{title}</span>}
                        </div>
                    ) : (
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 relative overflow-hidden rounded-xl shadow-lg transition-transform group-hover:scale-110">
                                <Image src="/logo.jpg" alt="Logo" fill className="object-cover" />
                            </div>
                            <span className="text-xl font-black text-gray-900 tracking-tighter uppercase hidden sm:block">
                                {title || "Volunteer Portal"}
                            </span>
                        </Link>
                    )}
                </div>

                <div className="flex items-center gap-4 sm:gap-6">
                    <button className="relative text-gray-400 hover:text-pink-600 font-bold transition-colors group">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                        
                        {/* Red Dot Indicator */}
                        {hasNotifications && (
                            <span className="absolute top-0 right-0 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600 border-2 border-white"></span>
                            </span>
                        )}
                        
                        {/* Tooltip on hover if pending */}
                        {hasNotifications && (
                            <div className="absolute top-full mt-2 right-0 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
                                New Attendance Request!
                            </div>
                        )}
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
    );
}
