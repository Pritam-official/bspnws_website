"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import { Calendar, MapPin, ArrowRight } from "lucide-react";

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

export default function RecentlyHeldProgrammesPage() {
    const router = useRouter();
    const [programmes, setProgrammes] = useState<Programme[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProgrammes = async () => {
            try {
                const res = await fetch("/api/admin/programmes?type=recently-held");
                const data = await res.json();
                if (Array.isArray(data)) {
                    setProgrammes(data);
                }
            } catch (error) {
                console.error("Failed to fetch recently-held programmes:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProgrammes();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            {/* Header Hero Section */}
            <div className="relative pt-24 sm:pt-32 pb-16 bg-gradient-to-br from-emerald-950 via-[#0d1f17] to-emerald-950 text-white overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>

                <div className="container mx-auto px-6 relative z-10 max-w-5xl">
                    <p className="text-emerald-400 text-xs font-black uppercase tracking-[0.2em] mb-3">BSPNWS · Portfolio of Action</p>
                    <h1 
                        className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
                        style={{ fontFamily: '"Georgia", "Times New Roman", serif' }}
                    >
                        Recently Held Programmes
                    </h1>
                    <p className="text-emerald-200/60 max-w-2xl text-sm sm:text-base font-medium">
                        A retrospective look at our successfully executed projects, welfare workshops, and humanitarian interventions that impacted thousands of lives across West Bengal.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 sm:px-6 py-16 max-w-5xl">
                {loading ? (
                    <div className="flex justify-center items-center py-40">
                        <div className="flex gap-1.5">
                            {[0, 1, 2].map(i => (
                                <div
                                    key={i}
                                    className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"
                                    style={{ animationDelay: `${i * 150}ms` }}
                                />
                            ))}
                        </div>
                    </div>
                ) : programmes.length === 0 ? (
                    <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-xl max-w-2xl mx-auto">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">🌿</div>
                        <h2 className="text-xl font-black text-slate-800 uppercase tracking-wider mb-2">No Records Yet</h2>
                        <p className="text-slate-400 text-sm">We are currently synchronizing our recently completed events. Please check back shortly.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {programmes.map((prog) => (
                            <div 
                                onClick={() => router.push(`/programme/${prog._id}`)} 
                                key={prog._id}
                                className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col cursor-pointer"
                            >
                                {/* Event Cover */}
                                <div className="relative h-48 w-full bg-slate-100 overflow-hidden flex items-center justify-center">
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
                                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-50 relative z-10">
                                            <span className="text-4xl">🌾</span>
                                            <span className="text-[10px] font-bold tracking-widest uppercase mt-2">BSPNWS</span>
                                        </div>
                                    )}
                                    {/* Date Badge */}
                                    <div className="absolute top-4 left-4 z-20 bg-emerald-950/75 backdrop-blur-sm text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                                        <Calendar className="w-3 h-3" />
                                        {formatDate(prog.date)}
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="p-6 flex flex-col flex-1 space-y-4">
                                    <h3 
                                        className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight"
                                        style={{ fontFamily: '"Georgia", serif' }}
                                    >
                                        {prog.title}
                                    </h3>
                                    
                                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                                        <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                        <span className="truncate">{prog.location}</span>
                                    </div>

                                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed line-clamp-3">
                                        {prog.shortDescription}
                                    </p>

                                     {/* Action Links */}
                                     {(prog.imagesLink || prog.videosLink) && (
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

                                    <div className="pt-4 border-t border-slate-50 mt-auto flex items-center justify-between text-xs font-black uppercase tracking-wider text-emerald-600 group-hover:text-emerald-500 transition-colors">
                                        <span>Read Full Report</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
