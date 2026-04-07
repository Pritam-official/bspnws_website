"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Officer {
    _id: string;
    name: string;
    designation: string;
    joiningDate: string;
    image?: string;
}

export default function OfficersPage() {
    const [officers, setOfficers] = useState<Officer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOfficers = async () => {
            try {
                const res = await fetch('/api/admin/officers');
                const data = await res.json();
                if (Array.isArray(data)) {
                    setOfficers(data);
                }
            } catch (error) {
                console.error("Failed to fetch officers:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOfficers();
    }, []);

    const getInitials = (name: string) =>
        name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

    return (
        <div className="min-h-screen bg-[#F5F4F0] pt-28 pb-24 px-6">

            {/* Thin top accent bar */}
            <div className="fixed top-0 left-0 right-0 h-0.5 bg-[#1C1C1C] z-50" />

            <div className="max-w-6xl mx-auto">

                {/* ── Header ── */}
                <header className="mb-20 border-b border-[#1C1C1C]/10 pb-10">
                    <div className="flex items-end justify-between flex-wrap gap-6">
                        <div>
                            <p className="text-[11px] font-semibold tracking-[0.2em] text-[#1C1C1C]/40 uppercase mb-3">
                                BSPNWS · Official Directory
                            </p>
                            <h1
                                className="text-[clamp(2.4rem,6vw,4.5rem)] font-black leading-[1.03] tracking-[-0.03em] text-[#1C1C1C]"
                                style={{ fontFamily: '"Georgia", "Times New Roman", serif' }}
                            >
                                Our Officers
                            </h1>
                        </div>
                        <div className="text-right">
                            <p className="text-[11px] tracking-widest text-[#1C1C1C]/35 uppercase font-medium mb-1">
                                Total Members
                            </p>
                            <p className="text-5xl font-black text-[#1C1C1C] tabular-nums">
                                {loading ? '—' : String(officers.length).padStart(2, '0')}
                            </p>
                        </div>
                    </div>
                </header>

                {/* ── Loading ── */}
                {loading ? (
                    <div className="flex justify-center items-center py-40">
                        <div className="flex gap-1.5">
                            {[0, 1, 2].map(i => (
                                <div
                                    key={i}
                                    className="w-2 h-2 rounded-full bg-[#1C1C1C]/30 animate-pulse"
                                    style={{ animationDelay: `${i * 150}ms` }}
                                />
                            ))}
                        </div>
                    </div>

                ) : officers.length === 0 ? (
                    /* ── Empty State ── */
                    <div className="border border-[#1C1C1C]/10 rounded-sm bg-white py-24 text-center">
                        <div className="w-10 h-0.5 bg-[#1C1C1C]/20 mx-auto mb-6" />
                        <p className="text-sm font-semibold text-[#1C1C1C]/50 tracking-widest uppercase">
                            Directory updating
                        </p>
                        <p className="text-xs text-[#1C1C1C]/30 mt-2">New profiles will appear here shortly.</p>
                    </div>

                ) : (
                    /* ── Officers Grid ── */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-[#1C1C1C]/8">
                        {officers.map((officer, index) => (
                            <article
                                key={officer._id}
                                className="group bg-[#F5F4F0] hover:bg-white transition-colors duration-300 p-8 flex flex-col"
                            >
                                {/* Index number */}
                                <span className="text-[10px] font-black tracking-[0.18em] text-[#1C1C1C]/20 uppercase mb-6">
                                    {String(index + 1).padStart(2, '0')}
                                </span>

                                {/* Avatar */}
                                <div className="mb-7">
                                    <div className="w-28 h-28 rounded-full overflow-hidden bg-[#E8E6E0] border border-[#1C1C1C]/8 flex items-center justify-center">
                                        {officer.image ? (
                                            <img
                                                src={officer.image}
                                                alt={officer.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span
                                                className="text-2xl font-black text-[#1C1C1C]/25 tracking-tight"
                                                style={{ fontFamily: '"Georgia", serif' }}
                                            >
                                                {getInitials(officer.name)}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Name */}
                                <h2
                                    className="text-[1.15rem] font-black text-[#1C1C1C] leading-tight tracking-[-0.02em] mb-1.5"
                                    style={{ fontFamily: '"Georgia", "Times New Roman", serif' }}
                                >
                                    {officer.name}
                                </h2>

                                {/* Designation */}
                                <p className="text-[12px] font-semibold text-[#1C1C1C]/45 tracking-wide uppercase mb-auto">
                                    {officer.designation}
                                </p>

                                {/* Footer */}
                                <div className="mt-8 pt-5 border-t border-[#1C1C1C]/8">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[9px] font-black tracking-[0.18em] text-[#1C1C1C]/25 uppercase mb-0.5">
                                                Member since
                                            </p>
                                            <p className="text-[12px] font-bold text-[#1C1C1C]/60">
                                                {officer.joiningDate}
                                            </p>
                                        </div>
                                        {/* Accent dot */}
                                        <div className="w-2 h-2 rounded-full bg-[#1C1C1C]/10 group-hover:bg-primary transition-colors duration-300" />
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {/* ── Footer ── */}
                <footer className="mt-16 border-t border-[#1C1C1C]/10 pt-8 flex items-center justify-between flex-wrap gap-4">
                    <p className="text-[11px] tracking-widest text-[#1C1C1C]/30 uppercase font-medium">
                        BSPNWS · Leadership
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-[12px] font-bold text-[#1C1C1C]/50 hover:text-[#1C1C1C] tracking-wider uppercase transition-colors duration-200 group"
                    >
                        <svg
                            className="w-3.5 h-3.5 rotate-180 group-hover:-translate-x-0.5 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                        Back to Home
                    </Link>
                </footer>

            </div>
        </div>
    );
}