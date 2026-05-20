"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import VolunteerSidebar from '@/components/volunteer-portal/VolunteerSidebar';
import VolunteerHeader from '@/components/volunteer-portal/VolunteerHeader';
import MembershipDashboard from '@/components/volunteer-portal/MembershipDashboard';
import MembershipUpdateForm from '@/components/volunteer-portal/MembershipUpdateForm';

export default function MembershipPage() {
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<any>(null);
    const [paidUpToMonth, setPaidUpToMonth] = useState<number>(-1);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [isFetching, setIsFetching] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const fetchMembershipData = async (phone: string, year: number) => {
        setIsFetching(true);
        try {
            const res = await fetch(`/api/volunteers/membership?phoneNumber=${encodeURIComponent(phone)}&year=${year}`);
            const result = await res.json();
            if (result.success && result.data.length > 0) {
                const monthNames = [
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                ];

                let maxMonthIndex = -1;
                result.data.forEach((record: any) => {
                    const idx = monthNames.indexOf(record.renewalMonth);
                    if (idx > maxMonthIndex) maxMonthIndex = idx;
                });

                setPaidUpToMonth(maxMonthIndex);
            } else {
                setPaidUpToMonth(-1);
            }
        } catch (error) {
            console.error("Failed to fetch membership data:", error);
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        const storedData = localStorage.getItem('volunteer_data');
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            const userPhone = parsedData.phoneNumber || parsedData.phone;
            setUserData(parsedData);
            if (userPhone) {
                fetchMembershipData(userPhone, selectedYear);
            }
        }
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, [selectedYear]);

    const handleRenewalMonthChange = (monthIndex: number) => {
        // If monthIndex is -1, it means a submission was successful, so re-fetch data
        if (monthIndex === -1) {
            const userPhone = userData?.phoneNumber || userData?.phone;
            if (userPhone) {
                fetchMembershipData(userPhone, selectedYear);
            }
        } else {
            setPaidUpToMonth(monthIndex);
        }
    };

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

                <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 space-y-8 sm:space-y-12 animate-fade-in pb-24 lg:pb-8">
                    {/* Page Title */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-none mb-2">
                                Membership <span className="text-pink-600">Plan</span>
                            </h1>
                            <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px]">
                                Manage your volunteer membership and payments
                            </p>
                        </div>
                    </div>

                    {/* Dashboard Section */}
                    <MembershipDashboard
                        paidUpToMonth={paidUpToMonth}
                        selectedYear={selectedYear}
                        onYearChange={setSelectedYear}
                    />

                    {/* Update Form Section */}
                    <MembershipUpdateForm onRenewalMonthChange={handleRenewalMonthChange} />
                </main>
            </div>
        </div>
    );
}
