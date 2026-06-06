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
    const [dbRecords, setDbRecords] = useState<any[]>([]);
    const [previewData, setPreviewData] = useState<{ monthIndex: number; year: number } | null>(null);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [isFetching, setIsFetching] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const fetchMembershipData = async (phone: string) => {
        setIsFetching(true);
        try {
            const res = await fetch(`/api/volunteers/membership?phoneNumber=${encodeURIComponent(phone)}`);
            const result = await res.json();
            if (result.success) {
                setDbRecords(result.data || []);
            } else {
                setDbRecords([]);
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
                fetchMembershipData(userPhone);
            }
        }
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const handleRenewalMonthChange = (monthIndex: number, year?: number) => {
        // If monthIndex is -1, it means a submission was successful, so re-fetch data
        if (monthIndex === -1) {
            setPreviewData(null);
            const userPhone = userData?.phoneNumber || userData?.phone;
            if (userPhone) {
                fetchMembershipData(userPhone);
            }
        } else {
            setPreviewData({ monthIndex, year: year ?? new Date().getFullYear() });
        }
    };

    // Robust multi-year green ticks check formula
    const computedPaidUpToMonth = React.useMemo(() => {
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        let maxVal = -1;

        // Find the maximum (renewalYear * 12 + monthIndex) across all database records
        dbRecords.forEach((record: any) => {
            const idx = monthNames.indexOf(record.renewalMonth);
            if (idx !== -1 && record.renewalYear) {
                const val = record.renewalYear * 12 + idx;
                if (val > maxVal) {
                    maxVal = val;
                }
            }
        });

        // Factor in the live form editing preview
        if (previewData) {
            const val = previewData.year * 12 + previewData.monthIndex;
            if (val > maxVal) {
                maxVal = val;
            }
        }

        if (maxVal === -1) {
            return -1;
        }

        const selectedYearStart = selectedYear * 12;
        const selectedYearEnd = selectedYearStart + 11;

        if (maxVal >= selectedYearEnd) {
            return 11; // All months in this year are paid
        } else if (maxVal >= selectedYearStart) {
            return maxVal - selectedYearStart; // Paid up to a specific month in this year
        } else {
            return -1; // No months in this year are paid
        }
    }, [dbRecords, previewData, selectedYear]);

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
                        paidUpToMonth={computedPaidUpToMonth}
                        selectedYear={selectedYear}
                        onYearChange={setSelectedYear}
                    />

                    {/* Update Form Section */}
                    <MembershipUpdateForm onRenewalMonthChange={handleRenewalMonthChange} />

                    {/* Membership History Section */}
                    <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl p-8 shadow-xl shadow-pink-600/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-600/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <div className="mb-6">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                                Payment & Renewal <span className="text-pink-600">History</span>
                            </h2>
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1">
                                Your past membership contributions
                            </p>
                        </div>

                        {isFetching ? (
                            <div className="flex items-center justify-center py-10">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-600"></div>
                            </div>
                        ) : dbRecords.length === 0 ? (
                            <div className="text-center py-10 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                                <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm font-bold text-gray-400">No renewal history found.</p>
                                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">Your submissions will appear here instantly</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded-2xl border border-gray-100">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-100">
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Plan Details</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Paid Up To</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment Date</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Method</th>
                                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 bg-white">
                                        {dbRecords.map((record) => (
                                            <tr key={record._id} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-gray-800 capitalize">{record.membershipStatus} Plan</span>
                                                        <span className="text-[9px] font-black text-pink-600 uppercase tracking-widest mt-0.5">{record.memberType || 'Normal Member'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-50 border border-green-100 text-green-700 text-xs font-bold">
                                                        <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        {record.renewalMonth} {record.renewalYear}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-xs font-semibold text-gray-600">
                                                    {new Date(record.date).toLocaleDateString('en-US', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-extrabold text-gray-900">
                                                    ₹{record.amount?.toLocaleString('en-IN')}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${record.paymentMethod === 'online'
                                                        ? 'bg-blue-50 text-blue-600 border border-blue-100'
                                                        : 'bg-amber-50 text-amber-600 border border-amber-100'
                                                        }`}>
                                                        {record.paymentMethod}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                                                            Success
                                                        </span>
                                                        {record.receiptImage && (
                                                            <button
                                                                onClick={() => {
                                                                    const win = window.open();
                                                                    if (win) {
                                                                        win.document.write(`<iframe src="${record.receiptImage}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
                                                                    }
                                                                }}
                                                                className="text-gray-400 hover:text-pink-600 p-1 rounded-lg hover:bg-pink-50 transition-colors"
                                                                title="View Receipt"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
