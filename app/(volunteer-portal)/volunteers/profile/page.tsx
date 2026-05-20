"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import VolunteerProfile from '@/components/volunteer-portal/VolunteerProfile';
import VolunteerSidebar from '@/components/volunteer-portal/VolunteerSidebar';
import VolunteerHeader from '@/components/volunteer-portal/VolunteerHeader';

export default function ProfilePage() {
    const [userData, setUserData] = useState<any>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const storedData = localStorage.getItem('volunteer_data');
        if (storedData) {
            setUserData(JSON.parse(storedData));
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <VolunteerSidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

            <div className="flex-1 lg:ml-64 relative pb-24 lg:pb-8">
                {/* Background Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-pink-600/5 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600/5 rounded-full blur-[120px]"></div>
                </div>

                {/* Header */}
                <VolunteerHeader 
                    userData={userData} 
                    setIsMobileMenuOpen={setIsMobileMenuOpen} 
                    title="My Profile" 
                    showBack={true} 
                />

                <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-8 pt-8 sm:pt-12">
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
