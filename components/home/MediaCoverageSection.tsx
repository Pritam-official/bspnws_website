"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Eye, ExternalLink, Play, ZoomIn, X, Newspaper } from "lucide-react";

interface MediaItem {
    _id: string;
    type: "outlet" | "coverage";
    title: string;
    image: string;
    newsLink?: string;
    videoLink?: string;
}

// Fallback high-quality items in case DB has no media items yet
const fallbackItems: MediaItem[] = [
    {
        _id: "fb-1",
        type: "coverage",
        title: "Protein-Rich Food Distribution to Needy Mothers & Children",
        image: "/scholarship_distribution.jpg",
        newsLink: "/media-coverage",
    },
    {
        _id: "fb-2",
        type: "coverage",
        title: "5th Foundation Anniversary Celebration & Community Health Award",
        image: "/scholarship_distribution_v2.jpg",
        newsLink: "/media-coverage",
    },
    {
        _id: "fb-3",
        type: "coverage",
        title: "Green Volunteers Award Ceremony & School Student Recognition",
        image: "/scholarship_distribution_v3.jpg",
        newsLink: "/media-coverage",
    },
    {
        _id: "fb-4",
        type: "coverage",
        title: "Free Healthcare & Nutrition Camp Organized in Burdwan District",
        image: "/bg-2.jpg",
        newsLink: "/media-coverage",
    },
    {
        _id: "fb-5",
        type: "coverage",
        title: "Baristha Vandana Initiative Featured in Regional Daily Press",
        image: "/baristha.jpg",
        newsLink: "/media-coverage",
    },
];

export default function MediaCoverageSection() {
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [selectedLightbox, setSelectedLightbox] = useState<MediaItem | null>(null);
    const [visibleCount, setVisibleCount] = useState(3);

    // Fetch media coverage from API
    useEffect(() => {
        const fetchMedia = async () => {
            try {
                const res = await fetch("/api/admin/media-coverage");
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    // Filter coverage items, or fall back to all if coverage specifically empty
                    const coverageOnly = data.filter((item: MediaItem) => item.type === "coverage");
                    setMediaItems(coverageOnly.length > 0 ? coverageOnly : data);
                } else {
                    setMediaItems(fallbackItems);
                }
            } catch (err) {
                console.error("Failed to fetch media coverage:", err);
                setMediaItems(fallbackItems);
            } finally {
                setLoading(false);
            }
        };

        fetchMedia();
    }, []);

    // Responsive visible items calculation
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setVisibleCount(1);
            } else if (window.innerWidth < 1024) {
                setVisibleCount(2);
            } else {
                setVisibleCount(3);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const itemsToRender = mediaItems.length > 0 ? mediaItems : fallbackItems;

    // Automatic slide continuation
    useEffect(() => {
        if (isPaused || itemsToRender.length <= visibleCount) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % itemsToRender.length);
        }, 3500);

        return () => clearInterval(interval);
    }, [isPaused, itemsToRender.length, visibleCount]);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + itemsToRender.length) % itemsToRender.length);
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % itemsToRender.length);
    };

    const handleCardClick = (item: MediaItem) => {
        if (item.videoLink) {
            window.open(item.videoLink, "_blank");
        } else if (item.newsLink && !item.newsLink.startsWith("/")) {
            window.open(item.newsLink, "_blank");
        } else {
            setSelectedLightbox(item);
        }
    };

    return (
        <section className="py-16 sm:py-24 bg-white border-t border-slate-100 overflow-hidden relative">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-6">
                    <div>
                        <h2
                            className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight"
                            style={{ fontFamily: '"Georgia", "Times New Roman", serif' }}
                        >
                            Media Coverage
                        </h2>
                        <p className="text-xs sm:text-sm font-bold text-slate-400 tracking-widest uppercase mt-2">
                            CLIPPINGS & HIGHLIGHTS OF PUBLISHED NEWS
                        </p>
                    </div>

                    {/* Controls & View All Link */}
                    <div className="flex items-center gap-3 self-start md:self-auto">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handlePrev}
                                className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-all shadow-sm active:scale-95"
                                title="Previous News"
                                aria-label="Previous News"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleNext}
                                className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-all shadow-sm active:scale-95"
                                title="Next News"
                                aria-label="Next News"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                        <Link
                            href="/media-coverage"
                            className="ml-2 inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                            <Newspaper className="w-4 h-4" /> View All
                        </Link>
                    </div>
                </div>

                {/* News Slider Container */}
                <div
                    className="relative overflow-hidden pt-2 pb-6"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="bg-slate-50 rounded-3xl p-4 border border-slate-100 shadow-sm h-80 animate-pulse space-y-4"
                                >
                                    <div className="aspect-[4/3] bg-slate-200 rounded-2xl"></div>
                                    <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div
                            className="flex transition-transform duration-700 ease-in-out gap-6"
                            style={{
                                transform: `translateX(-${(currentIndex * (100 / visibleCount))}%)`,
                            }}
                        >
                            {/* Duplicate items for seamless continuous looping loop effect if needed */}
                            {itemsToRender.concat(itemsToRender).map((item, idx) => (
                                <div
                                    key={`${item._id}-${idx}`}
                                    className="flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                                >
                                    <div
                                        onClick={() => handleCardClick(item)}
                                        className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer flex flex-col h-full p-4"
                                    >
                                        {/* Image Clipping Wrapper */}
                                        <div className="relative aspect-[4/3] w-full bg-slate-100 rounded-2xl overflow-hidden mb-4 border border-slate-100">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                            {/* Media Type Badge */}
                                            {(item.videoLink || item.newsLink) && (
                                                <div className="absolute top-3 left-3 z-10">
                                                    <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-xl shadow-md border backdrop-blur-md ${item.videoLink ? "bg-purple-600/90 text-white border-purple-500/30" : "bg-blue-600/90 text-white border-blue-500/30"}`}>
                                                        {item.videoLink ? "Video" : "Article"}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Hover View Overlay */}
                                            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <div className="w-11 h-11 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 text-white transform scale-90 group-hover:scale-100 transition-transform duration-300">
                                                    {item.videoLink ? (
                                                        <Play className="w-5 h-5 fill-current" />
                                                    ) : item.newsLink && !item.newsLink.startsWith("/") ? (
                                                        <ExternalLink className="w-5 h-5" />
                                                    ) : (
                                                        <ZoomIn className="w-5 h-5" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Title Header */}
                                        <div className="flex-1 flex flex-col justify-between px-1">
                                            <h3
                                                className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-tight"
                                                style={{ fontFamily: '"Georgia", "Times New Roman", serif' }}
                                            >
                                                {item.title}
                                            </h3>

                                            <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-slate-400 text-xs group-hover:text-emerald-600 transition-colors font-bold uppercase tracking-wider">
                                                <span className="text-[10px]">
                                                    {item.videoLink ? "Watch Video" : item.newsLink && !item.newsLink.startsWith("/") ? "Read Full News" : "View Clipping"}
                                                </span>
                                                <Eye className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Dots Navigation Indicator */}
                {itemsToRender.length > visibleCount && (
                    <div className="flex justify-center items-center gap-2 mt-4">
                        {itemsToRender.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentIndex(i)}
                                className={`h-2 rounded-full transition-all duration-300 ${currentIndex % itemsToRender.length === i
                                        ? "w-8 bg-emerald-600"
                                        : "w-2 bg-slate-200 hover:bg-slate-300"
                                    }`}
                                title={`Go to slide ${i + 1}`}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox Modal for Enlarged Newspaper Clipping */}
            {selectedLightbox && (
                <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
                    <button
                        onClick={() => setSelectedLightbox(null)}
                        className="absolute top-6 right-6 z-[210] p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/10 hover:scale-105 active:scale-95"
                        title="Close Modal"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <div className="relative max-w-5xl max-h-[85vh] w-full h-full flex flex-col items-center justify-center gap-4">
                        <div className="relative max-w-full max-h-[75vh] overflow-hidden rounded-2xl shadow-2xl border border-white/10 bg-slate-900/50 flex items-center justify-center p-2">
                            <img
                                src={selectedLightbox.image}
                                alt={selectedLightbox.title}
                                className="max-w-full max-h-[75vh] object-contain rounded-xl"
                            />
                        </div>
                        <div className="text-center max-w-2xl px-4">
                            <span className="text-[10px] font-black uppercase text-emerald-400 tracking-[0.2em]">
                                Media News Clipping
                            </span>
                            <h3 className="text-white text-lg sm:text-xl font-bold mt-1" style={{ fontFamily: '"Georgia", serif' }}>
                                {selectedLightbox.title}
                            </h3>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
