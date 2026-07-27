"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, ArrowUpRight, ArrowRight, Heart } from "lucide-react";

interface Programme {
    _id: string;
    title: string;
    shortDescription: string;
    fullDescription: string;
    date: string;
    location: string;
    image?: string;
    imagesLink?: string;
    videosLink?: string;
    type: "recently-held" | "upcoming";
}

function formatDate(dateStr: string) {
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    } catch {
        return dateStr;
    }
}

export default function ProgrammeSection() {
    const router = useRouter();
    const [recentProgrammes, setRecentProgrammes] = useState<Programme[]>([]);
    const [upcomingProgrammes, setUpcomingProgrammes] = useState<Programme[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"recent" | "upcoming">("recent");

    useEffect(() => {
        const fetchProgrammes = async () => {
            try {
                // Fetch both types in parallel
                const [resRecent, resUpcoming] = await Promise.all([
                    fetch("/api/admin/programmes?type=recently-held"),
                    fetch("/api/admin/programmes?type=upcoming")
                ]);
                
                const dataRecent = await resRecent.json();
                const dataUpcoming = await resUpcoming.json();

                if (Array.isArray(dataRecent)) {
                    setRecentProgrammes(dataRecent.slice(0, 3)); // show top 3 on home page
                }
                if (Array.isArray(dataUpcoming)) {
                    setUpcomingProgrammes(dataUpcoming.slice(0, 3)); // show top 3 on home page
                }
            } catch (error) {
                console.error("Failed to fetch homepage programmes:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProgrammes();
    }, []);

    const displayedProgrammes = activeTab === "recent" ? recentProgrammes : upcomingProgrammes;

    if (loading) return null; // Let it load silently or render placeholder

    // Don't render the section if there are no programmes at all
    if (recentProgrammes.length === 0 && upcomingProgrammes.length === 0) return null;

    return (
        <section className="py-20 bg-gray-50 relative overflow-hidden">
            {/* Decorative Orbs */}
            <div className="absolute top-1/4 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>

            <div className="container mx-auto px-6 relative z-10">
                
                {/* Section Header */}
                <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-12 gap-6 text-center md:text-left">
                    <div>
                        <span className="text-sm font-semibold tracking-wider uppercase text-primary mb-3 block">
                            Our Actions & Plans
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
                            BSPNWS Programmes
                        </h2>
                        <div className="w-20 h-1 bg-primary mt-4 rounded-full mx-auto md:mx-0"></div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex bg-white p-1.5 rounded-2xl border border-gray-100 shadow-md">
                        <button
                            onClick={() => setActiveTab("recent")}
                            className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-widest transition-all ${
                                activeTab === "recent"
                                    ? "bg-primary text-white shadow-md shadow-primary/20"
                                    : "text-gray-500 hover:text-primary hover:bg-gray-50"
                            }`}
                        >
                            Recently Held
                        </button>
                        <button
                            onClick={() => setActiveTab("upcoming")}
                            className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-widest transition-all ${
                                activeTab === "upcoming"
                                    ? "bg-secondary text-white shadow-md shadow-secondary/20"
                                    : "text-gray-500 hover:text-secondary hover:bg-gray-50"
                            }`}
                        >
                            Upcoming
                        </button>
                    </div>
                </div>

                {/* Programmes Grid */}
                {displayedProgrammes.length === 0 ? (
                    <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-xl max-w-2xl mx-auto">
                        <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">🗓️</div>
                        <h3 className="font-bold text-gray-800 text-lg mb-1">No programmes to display</h3>
                        <p className="text-gray-400 text-sm">Please select the other tab or check back later.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {displayedProgrammes.map((prog) => (
                            <div
                                onClick={() => router.push(`/programme/${prog._id}`)}
                                key={prog._id}
                                className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col cursor-pointer"
                            >
                                {/* Cover Image */}
                                <div className="relative h-48 w-full bg-gray-100 overflow-hidden flex items-center justify-center">
                                    {prog.image ? (
                                        <>
                                            {/* Blurred background to prevent empty side spaces */}
                                            <img
                                                src={prog.image}
                                                alt=""
                                                className="absolute inset-0 w-full h-full object-cover blur-md scale-110 opacity-30 select-none pointer-events-none"
                                            />
                                            {/* Main uncropped image */}
                                            <img
                                                src={prog.image}
                                                alt={prog.title}
                                                className="relative z-10 max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 relative z-10">
                                            <span className="text-4xl">🌾</span>
                                            <span className="text-[10px] font-bold tracking-widest uppercase mt-2">BSPNWS Event</span>
                                        </div>
                                    )}
                                    {/* Date Overlay */}
                                    <div className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10">
                                        <Calendar className="w-3.5 h-3.5 text-primary" />
                                        {formatDate(prog.date)}
                                    </div>
                                </div>

                                {/* Body Description */}
                                <div className="p-6 flex flex-col flex-1 space-y-4">
                                    <h3 
                                        className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors leading-tight"
                                        style={{ fontFamily: '"Georgia", serif' }}
                                    >
                                        {prog.title}
                                    </h3>
                                    
                                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold">
                                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                                        <span className="truncate">{prog.location}</span>
                                    </div>

                                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                                        {prog.shortDescription}
                                    </p>

                                    {/* Action Links */}
                                    {activeTab === "recent" && (prog.imagesLink || prog.videosLink) && (
                                        <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-slate-100" onClick={e => e.stopPropagation()}>
                                            {prog.imagesLink && (
                                                <a
                                                    href={prog.imagesLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full inline-flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-blue-50/40 border border-slate-100 hover:border-blue-100 text-slate-700 hover:text-blue-600 transition-all duration-300 text-[11px] font-bold group/btn"
                                                >
                                                    <span className="flex items-center gap-1.5">
                                                        <svg className="w-3.5 h-3.5 fill-[#1877F2] shrink-0" viewBox="0 0 24 24">
                                                            <path d="M9.101 23.681v-9.554H6.07V10.62h3.031V7.896c0-3.104 1.896-4.799 4.671-4.799 1.328 0 2.47.099 2.802.143v3.249l-1.923.001c-1.506 0-1.798.716-1.798 1.767v2.363h3.599l-.469 3.507h-3.13v9.554H9.101z" />
                                                        </svg>
                                                        See this programme related full images
                                                    </span>
                                                    <svg className="w-3 h-3 text-slate-400 group-hover/btn:translate-x-0.5 group-hover/btn:text-blue-500 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </a>
                                            )}
                                            {prog.videosLink && (
                                                <a
                                                    href={prog.videosLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full inline-flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-blue-50/40 border border-slate-100 hover:border-blue-100 text-slate-700 hover:text-blue-600 transition-all duration-300 text-[11px] font-bold group/btn"
                                                >
                                                    <span className="flex items-center gap-1.5">
                                                        <svg className="w-3.5 h-3.5 fill-[#1877F2] shrink-0" viewBox="0 0 24 24">
                                                            <path d="M9.101 23.681v-9.554H6.07V10.62h3.031V7.896c0-3.104 1.896-4.799 4.671-4.799 1.328 0 2.47.099 2.802.143v3.249l-1.923.001c-1.506 0-1.798.716-1.798 1.767v2.363h3.599l-.469 3.507h-3.13v9.554H9.101z" />
                                                        </svg>
                                                        See this programme related full videos
                                                    </span>
                                                    <svg className="w-3 h-3 text-slate-400 group-hover/btn:translate-x-0.5 group-hover/btn:text-blue-500 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </a>
                                            )}
                                        </div>
                                    )}

                                    <div className="pt-4 border-t border-gray-50 mt-auto flex items-center justify-between text-xs font-black uppercase tracking-wider text-primary group-hover:text-primary/70 transition-colors">
                                        {activeTab === "upcoming" ? (
                                            <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 fill-current text-primary" /> Join / Support</span>
                                        ) : (
                                            <span>Read Full Report</span>
                                        )}
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer View All Button */}
                <div className="mt-12 text-center">
                    <Link
                        href={activeTab === "recent" ? "/programme/recent" : "/programme/upcoming"}
                        className="inline-flex items-center gap-2 bg-white text-gray-900 border-2 border-gray-100 px-8 py-3.5 rounded-xl font-bold hover:border-primary/50 transition-all shadow-md group"
                    >
                        View All {activeTab === "recent" ? "Recently Held" : "Upcoming"} Programmes
                        <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                    </Link>
                </div>

            </div>
        </section>
    );
}
