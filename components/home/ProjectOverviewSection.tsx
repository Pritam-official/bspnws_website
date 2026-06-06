"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";

interface OverviewVideo {
    _id: string;
    title: string;
    videoUrl: string;
    publicId: string;
    createdAt: string;
}

interface ProjectOverviewSectionProps {
    isProjectsPage?: boolean;
}

export default function ProjectOverviewSection({ isProjectsPage = false }: ProjectOverviewSectionProps) {
    const [videos, setVideos] = useState<OverviewVideo[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleVolumeChange = (e: React.SyntheticEvent<HTMLVideoElement>) => {
        setIsMuted(e.currentTarget.muted);
    };

    useEffect(() => {
        const url = videos[currentIndex]?.videoUrl;
        if (videoRef.current && url) {
            videoRef.current.load();
            videoRef.current.play().catch(err => {
                console.log("Autoplay on transition failed:", err);
            });
        }
    }, [currentIndex, videos]);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await fetch(`/api/admin/project-overview?t=${Date.now()}`, { cache: 'no-store' });
                const data = await res.json();
                if (Array.isArray(data)) {
                    setVideos(data);
                }
            } catch (error) {
                console.error("Failed to fetch project overview videos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchVideos();
    }, []);

    const handleVideoEnded = () => {
        if (videos.length > 1) {
            setCurrentIndex((prev) => (prev + 1) % videos.length);
        }
    };

    const handleNext = () => {
        if (videos.length > 1) {
            setCurrentIndex((prev) => (prev + 1) % videos.length);
        }
    };

    const handlePrev = () => {
        if (videos.length > 1) {
            setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
        }
    };

    if (loading) {
        return (
            <div className={`w-full py-12 flex flex-col items-center justify-center gap-3 ${isProjectsPage ? 'bg-transparent' : 'bg-gray-50'}`}>
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-400 text-xs font-semibold tracking-wider uppercase">Loading overview...</span>
            </div>
        );
    }

    if (videos.length === 0) return null;

    const currentVideo = videos[currentIndex];

    return (
        <section className={`relative overflow-hidden transition-all duration-500 ${
            isProjectsPage 
                ? "py-10 bg-transparent" 
                : "py-20 bg-gray-50 border-t border-gray-100"
        }`}>
            {/* Decorative Orbs (only on homepage) */}
            {!isProjectsPage && (
                <>
                    <div className="absolute top-1/4 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
                </>
            )}

            <div className={`container mx-auto relative z-10 ${isProjectsPage ? "px-0" : "px-6"}`}>
                
                {/* Section Header */}
                <div className="mb-12 text-center md:text-left">
                    <span className="text-sm font-semibold tracking-wider uppercase text-primary mb-3 block">
                        {isProjectsPage ? "Visual Summary" : "Our Impact in Motion"}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
                        Project Overview
                    </h2>
                    <div className="w-20 h-1 bg-primary mt-4 rounded-full mx-auto md:mx-0"></div>
                </div>

                {/* Single Video Player Frame */}
                <div className="max-w-5xl mx-auto rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-4 sm:border-[8px] border-white bg-black aspect-video relative group">
                    <video
                        ref={videoRef}
                        src={currentVideo.videoUrl}
                        autoPlay
                        loop={videos.length === 1} // Native loop if only 1 video
                        muted={isMuted}
                        playsInline
                        controls
                        onEnded={handleVideoEnded}
                        onVolumeChange={handleVolumeChange}
                        className="w-full h-full object-cover"
                    />

                    {/* Tiny slide index badge (top right, visible on hover) */}
                    {videos.length > 1 && (
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/10 text-[10px] sm:text-xs font-semibold text-gray-300 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {currentIndex + 1} / {videos.length}
                        </div>
                    )}

                    {/* Playlist navigation controls (Next / Prev arrows on hover) */}
                    {videos.length > 1 && (
                        <>
                            <button 
                                onClick={handlePrev}
                                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 sm:p-3 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105"
                                title="Previous Video"
                            >
                                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                            <button 
                                onClick={handleNext}
                                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 sm:p-3 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105"
                                title="Next Video"
                            >
                                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
