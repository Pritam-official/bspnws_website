"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import { Calendar, MapPin, ArrowLeft, Clock, Tag } from "lucide-react";

interface Programme {
    _id: string;
    title: string;
    shortDescription: string;
    fullDescription: string;
    date: string;
    location: string;
    image?: string;
    type: "recently-held" | "upcoming";
}

function formatDate(dateStr: string) {
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
    } catch {
        return dateStr;
    }
}

export default function ProgrammeDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [programme, setProgramme] = useState<Programme | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!params?.id) return;
        const fetchDetail = async () => {
            try {
                const res = await fetch(`/api/admin/programmes/${params.id}`);
                if (!res.ok) {
                    throw new Error("Programme not found");
                }
                const data = await res.json();
                setProgramme(data);
            } catch (error) {
                console.error("Failed to fetch programme details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [params]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
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
            </div>
        );
    }

    if (!programme) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <Navbar />
                <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-2xl mb-4 font-bold">⚠️</div>
                    <h1 className="text-xl font-bold text-slate-800 mb-2">Programme Not Found</h1>
                    <p className="text-slate-400 text-sm mb-6 max-w-sm">The event you are looking for may have been removed or updated by an administrator.</p>
                    <button 
                        onClick={() => router.back()} 
                        className="inline-flex items-center gap-2 bg-emerald-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider hover:bg-emerald-500 transition-all shadow-md"
                    >
                        <ArrowLeft className="w-4 h-4" /> Go Back
                    </button>
                </div>
            </div>
        );
    }

    const isUpcoming = programme.type === "upcoming";

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <Navbar />

            {/* Back Button Overlay */}
            <div className="pt-24 sm:pt-28 container mx-auto px-6 max-w-4xl">
                <button 
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-all text-xs uppercase tracking-wider group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Back to Listings
                </button>
            </div>

            {/* Main Detail Content */}
            <article className="container mx-auto px-4 sm:px-6 py-6 max-w-4xl">
                <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100">
                    
                    {/* Header Image */}
                    <div className="relative h-64 sm:h-[400px] w-full bg-slate-100">
                        {programme.image ? (
                            <img 
                                src={programme.image} 
                                alt={programme.title} 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-100">
                                <span className="text-7xl">🗓️</span>
                                <span className="text-xs font-black tracking-[0.2em] uppercase mt-4">BSPNWS Community Event</span>
                            </div>
                        )}
                        {/* Status Overlay Badge */}
                        <div className="absolute top-6 right-6">
                            <span className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-md shadow-md border ${
                                isUpcoming 
                                    ? "bg-amber-500/90 text-white border-amber-400/20" 
                                    : "bg-emerald-600/90 text-white border-emerald-500/20"
                            }`}>
                                {isUpcoming ? "Upcoming Event" : "Completed Event"}
                            </span>
                        </div>
                    </div>

                    {/* Body Details */}
                    <div className="p-8 sm:p-12 space-y-8">
                        
                        {/* Title Block */}
                        <div className="space-y-4">
                            <h1 
                                className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-tight"
                                style={{ fontFamily: '"Georgia", "Times New Roman", serif' }}
                            >
                                {programme.title}
                            </h1>
                            
                            {/* Meta Info Row */}
                            <div className="flex flex-wrap gap-4 sm:gap-6 pt-2 text-slate-500 text-xs sm:text-sm font-semibold border-b border-slate-100 pb-6">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-emerald-500 shrink-0" />
                                    <span>{formatDate(programme.date)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                                    <span>{programme.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-emerald-500 shrink-0" />
                                    <span className="capitalize">{programme.type.replace("-", " ")}</span>
                                </div>
                            </div>
                        </div>

                        {/* Brief Summary Section */}
                        <div className="p-6 bg-slate-50 rounded-2xl border-l-4 border-emerald-500 text-slate-700 leading-relaxed text-sm sm:text-base font-medium">
                            <h3 className="text-slate-900 font-black text-xs uppercase tracking-widest mb-2 leading-none">Programme Summary</h3>
                            {programme.shortDescription}
                        </div>

                        {/* Long Description Body */}
                        <div className="space-y-6">
                            <h3 className="text-slate-900 font-black text-xs uppercase tracking-widest mb-1.5 leading-none">Detailed Report & Description</h3>
                            <div className="text-slate-600 leading-relaxed text-sm sm:text-base whitespace-pre-wrap space-y-4 font-normal">
                                {programme.fullDescription}
                            </div>
                        </div>

                        {/* Special Call To Action for Upcoming Programmes */}
                        {isUpcoming && (
                            <div className="pt-8 border-t border-slate-100 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-xl animate-bounce">🤝</div>
                                <h3 className="text-lg font-bold text-slate-800">Would you like to support or volunteer for this program?</h3>
                                <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto">Get in touch with our coordinating officers to help secure logistics or distribute materials at the location.</p>
                                <div className="flex gap-4">
                                    <Link 
                                        href="/contact" 
                                        className="bg-emerald-600 text-white font-bold px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider hover:bg-emerald-500 transition-all shadow-md shadow-emerald-500/10"
                                    >
                                        Inquire Now
                                    </Link>
                                    <Link 
                                        href="/volunteers/become" 
                                        className="bg-slate-100 text-slate-700 border border-slate-200 font-bold px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider hover:bg-slate-200 transition-all"
                                    >
                                        Become a Volunteer
                                    </Link>
                                </div>
                            </div>
                        )}

                    </div>

                </div>
            </article>
        </div>
    );
}
