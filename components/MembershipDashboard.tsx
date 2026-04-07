"use client";

import React from 'react';

interface MembershipDashboardProps {
    paidUpToMonth?: number; // 0-11 for Jan-Dec
    selectedYear?: number;
    onYearChange?: (year: number) => void;
}

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const MembershipDashboard: React.FC<MembershipDashboardProps> = ({
    paidUpToMonth = -1,
    selectedYear = 2026,
    onYearChange
}) => {
    return (
        <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl p-8 shadow-xl shadow-pink-600/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-600/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-pink-600/10 transition-colors"></div>

            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Membership <span className="text-pink-600">Dashboard</span></h2>
                        <div className="bg-pink-600 text-white px-3 py-1 rounded-lg text-sm font-black tracking-widest shadow-lg shadow-pink-600/20">
                            {selectedYear}
                        </div>
                    </div>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Your payment status across the year</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-gray-50 border-2 border-gray-100 rounded-2xl p-1">
                        {[2025, 2026, 2027].map((year) => (
                            <button
                                key={year}
                                onClick={() => onYearChange?.(year)}
                                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${selectedYear === year
                                    ? 'bg-white text-pink-600 shadow-md'
                                    : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {year}
                            </button>
                        ))}
                    </div>
                    <div className="bg-green-50 px-4 py-2 rounded-xl border border-green-100 shrink-0">
                        <span className="text-xs font-black text-green-600 uppercase tracking-widest">Active Member</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {months.map((month, index) => {
                    const isPaid = index <= paidUpToMonth;
                    return (
                        <div
                            key={month}
                            className={`relative group/month p-4 rounded-2xl border-2 transition-all duration-500 flex flex-col items-center justify-center gap-2 ${isPaid
                                ? 'bg-green-50 border-green-200 shadow-lg shadow-green-600/10'
                                : 'bg-gray-50 border-gray-100 opacity-50'
                                }`}
                        >
                            <div className={`w-3 h-3 rounded-full ${isPaid ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${isPaid ? 'text-green-700' : 'text-gray-400'}`}>
                                {month}
                            </span>
                            {isPaid && (
                                <div className="absolute top-2 right-2">
                                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MembershipDashboard;
