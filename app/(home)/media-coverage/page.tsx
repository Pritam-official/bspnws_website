"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import { Sparkles, ArrowLeft, Info, Eye, X, ZoomIn, Play, ExternalLink } from "lucide-react";

interface MediaItem {
    _id: string;
    type: "outlet" | "coverage";
    title: string;
    image: string;
    newsLink?: string;
    videoLink?: string;
}

export default function MediaCoverageShowcasePage() {
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [lightboxImage, setLightboxImage] = useState<MediaItem | null>(null);

    const handleCoverageClick = (item: MediaItem) => {
        if (item.videoLink) {
            window.open(item.videoLink, '_blank');
        } else if (item.newsLink) {
            window.open(item.newsLink, '_blank');
        } else {
            setLightboxImage(item);
        }
    };

    useEffect(() => {
        const fetchMediaItems = async () => {
            try {
                const res = await fetch("/api/admin/media-coverage");
                const data = await res.json();
                if (Array.isArray(data)) {
                    setMediaItems(data);
                }
            } catch (error) {
                console.error("Failed to fetch media coverage items:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMediaItems();
    }, []);

    // Filter items by type
    const outlets = mediaItems.filter(item => item.type === "outlet");
    const coverages = mediaItems.filter(item => item.type === "coverage");

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <Navbar />

            {/* Header Hero Section */}
            <div className="relative pt-24 sm:pt-32 pb-16 bg-gradient-to-br from-slate-900 via-[#0d1511] to-slate-900 text-white overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>

                <div className="container mx-auto px-6 relative z-10 max-w-5xl text-center">
                    <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full mb-6 border border-emerald-500/20">
                        <Sparkles className="w-4 h-4 animate-spin-slow" />
                        <span className="text-xs font-black uppercase tracking-widest">News & Media presence</span>
                    </div>
                    <h1
                        className="text-4xl md:text-5xl font-black tracking-tight mb-4"
                        style={{ fontFamily: '"Georgia", "Times New Roman", serif' }}
                    >
                        Media Coverage
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base font-medium">
                        Discover BSPNWS in the news. View our official press features, news outlet publications, and statements highlighting our service initiatives.
                    </p>
                </div>
            </div>

            {/* Main Showcase Section */}
            <div className="container mx-auto px-4 sm:px-6 py-16 max-w-5xl space-y-20">
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
                ) : mediaItems.length === 0 ? (
                    <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-xl max-w-2xl mx-auto space-y-6">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto">📰</div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-black text-slate-800 uppercase tracking-wider">No Media Coverage Records</h2>
                            <p className="text-slate-400 text-sm max-w-md mx-auto">We are currently compiling our news publications. Check back soon for updates.</p>
                        </div>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 bg-emerald-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider hover:bg-emerald-500 transition-all shadow-md"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to Home
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Section 1: Media Outlets */}
                        {outlets.length > 0 && (
                            <div className="space-y-8">
                                <div className="text-center md:text-left border-b border-slate-100 pb-4">
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight" style={{ fontFamily: '"Georgia", serif' }}>
                                        Media Outlets
                                    </h2>
                                    <p className="text-sm text-slate-400 font-bold mt-1 uppercase tracking-wider">Press Channels Representing Our Mission</p>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                    {outlets.map((item) => (
                                        <div
                                            key={item._id}
                                            className="group bg-white rounded-2xl p-4 border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center min-h-[120px]"
                                            title={item.title}
                                        >
                                            <div className="relative w-full h-20 flex items-center justify-center">
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="max-w-full max-h-full object-contain group-hover:scale-105 transition-all duration-500"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Section 2: Media Coverage (Published News Images) */}
                        {coverages.length > 0 && (
                            <div className="space-y-8">
                                <div className="text-center md:text-left border-b border-slate-100 pb-4">
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight" style={{ fontFamily: '"Georgia", serif' }}>
                                        Media Coverage
                                    </h2>
                                    <p className="text-sm text-slate-400 font-bold mt-1 uppercase tracking-wider">Clippings & Highlights of Published News</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {coverages.map((item) => (
                                        <div
                                            key={item._id}
                                            className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col cursor-pointer"
                                            onClick={() => handleCoverageClick(item)}
                                        >
                                            {/* Image Container */}
                                            <div className="relative h-64 w-full bg-slate-100 overflow-hidden border-b border-slate-100">
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                                                />
                                                {/* Category Badge */}
                                                {(item.videoLink || item.newsLink) && (
                                                    <div className="absolute top-4 left-4 z-10">
                                                        <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-xl shadow-md border backdrop-blur-md ${item.videoLink ? 'bg-purple-600/90 text-white border-purple-500/30' : 'bg-blue-600/90 text-white border-blue-500/30'}`}>
                                                            {item.videoLink ? "Video" : "Article"}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 text-white transform scale-90 group-hover:scale-100 transition-transform duration-300">
                                                        {item.videoLink ? (
                                                            <Play className="w-6 h-6 fill-current" />
                                                        ) : item.newsLink ? (
                                                            <ExternalLink className="w-6 h-6" />
                                                        ) : (
                                                            <ZoomIn className="w-6 h-6" />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Body Info */}
                                            <div className="p-6 flex flex-col justify-between flex-1">
                                                <h3
                                                    className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2"
                                                    style={{ fontFamily: '"Georgia", serif' }}
                                                >
                                                    {item.title}
                                                </h3>
                                                <div className="pt-4 border-t border-slate-50 mt-4 flex items-center justify-between text-slate-400 group-hover:text-emerald-600 transition-colors">
                                                    <span className="text-[10px] font-black uppercase tracking-wider">
                                                        {item.videoLink ? "Watch Video" : item.newsLink ? "Read Article" : "Click to enlarge"}
                                                    </span>
                                                    {item.videoLink ? (
                                                        <Play className="w-4 h-4" />
                                                    ) : item.newsLink ? (
                                                        <ExternalLink className="w-4 h-4" />
                                                    ) : (
                                                        <Eye className="w-4 h-4" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Informational Alert Box */}
                        <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-3xl flex items-start gap-4 max-w-3xl mx-auto">
                            <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <h4 className="font-bold text-emerald-950 text-sm">Media & Press Inquiries</h4>
                                <p className="text-emerald-800/80 text-xs leading-relaxed">
                                    For official press releases, event invitations, media kits, or coverage inquiries, please reach out to Burdwan Sadar Pyara Nutrition Welfare Society through our dedicated contact portal.
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Lightbox / Modal */}
            {lightboxImage && (
                <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
                    <button
                        onClick={() => setLightboxImage(null)}
                        className="absolute top-6 right-6 z-[210] p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/10 hover:scale-105 active:scale-95"
                        title="Close Modal"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <div className="relative max-w-5xl max-h-[85vh] w-full h-full flex flex-col items-center justify-center gap-4">
                        <div className="relative max-w-full max-h-[75vh] overflow-hidden rounded-2xl shadow-2xl border border-white/10 bg-slate-900/50 flex items-center justify-center">
                            <img
                                src={lightboxImage.image}
                                alt={lightboxImage.title}
                                className="max-w-full max-h-[75vh] object-contain rounded-xl"
                            />
                        </div>
                        <div className="text-center max-w-2xl px-4">
                            <span className="text-[10px] font-black uppercase text-emerald-400 tracking-[0.2em]">
                                {lightboxImage.type === "outlet" ? "Media Outlet Logo" : "Media News Clipping"}
                            </span>
                            <h3 className="text-white text-lg font-bold mt-1" style={{ fontFamily: '"Georgia", serif' }}>
                                {lightboxImage.title}
                            </h3>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
