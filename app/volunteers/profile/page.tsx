"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import VolunteerProfile from '@/components/VolunteerProfile';
import VolunteerSidebar from '@/components/VolunteerSidebar';

export default function ProfilePage() {
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        const storedData = localStorage.getItem('volunteer_data');
        if (storedData) {
            setUserData(JSON.parse(storedData));
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <VolunteerSidebar />

            <div className="flex-1 lg:ml-64 relative pb-20">
                {/* Background Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-pink-600/5 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600/5 rounded-full blur-[120px]"></div>
                </div>

                {/* Header */}
                <header className="relative z-20 bg-white/60 backdrop-blur-md border-b border-white/60 px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/volunteers/dashboard" className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-pink-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        </Link>
                        <h1 className="text-xl font-black text-gray-900 uppercase tracking-tight">My Profile</h1>
                    </div>

                    <Link href="/volunteers/dashboard" className="p-1 rounded-full border-2 border-pink-600 shadow-lg shadow-pink-600/20 hover:scale-105 transition-transform overflow-hidden w-10 h-10 relative">
                        <Image
                            src={userData?.profileImage || '/logo.jpg'}
                            alt="Profile"
                            fill
                            className="object-cover"
                        />
                    </Link>
                </header>

                <main className="relative z-10 max-w-4xl mx-auto px-8 pt-12">
                    <div className="mb-8">
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-none mb-2">
                            Personal <span className="text-pink-600">Details</span>
                        </h2>
                        <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px]">
                            Manage your identity and contact information.
                        </p>
                    </div>

                    <VolunteerProfile />
                </main>
            </div>
        </div>
    );
}
