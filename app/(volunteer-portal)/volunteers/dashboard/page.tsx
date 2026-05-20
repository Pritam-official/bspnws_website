"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import VolunteerSidebar from '@/components/volunteer-portal/VolunteerSidebar';
import PerformanceDashboard from '@/components/volunteer-portal/PerformanceDashboard';
import VolunteerHeader from '@/components/volunteer-portal/VolunteerHeader';


export default function VolunteerDashboardPage() {
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<any>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        // Simulate initial load
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
            {/* Sidebar - Fixed Left */}
            <VolunteerSidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

            {/* Main Content Area */}
            <div className="flex-1 lg:ml-64 relative pb-20 overflow-y-auto">
                {/* Background Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-pink-600/5 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                {/* Navigation Header */}
                <VolunteerHeader userData={userData} setIsMobileMenuOpen={setIsMobileMenuOpen} />

                <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 space-y-8 sm:space-y-10 animate-fade-in pb-24 lg:pb-8">
                    {/* Welcome Text */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-none mb-2">
                                Volunteer <span className="text-pink-600">Home</span>
                            </h1>
                            <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px]">
                                Your overview for today: {userData?.signupDate || 'Monday, 28th January 2026'}
                            </p>
                        </div>
                    </div>

                    {/* Dashboards Section */}
                    <div className="space-y-8">

                        <div className="grid grid-cols-1 gap-8">
                            <PerformanceDashboard />
                        </div>
                    </div>
                </main>
            </div >
        </div >
    );
}
