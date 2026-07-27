"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/shared/Navbar';
import Image from 'next/image';

interface GalleryItem {
    _id: string;
    title: string;
    description: string;
    type: string;
    date: string;
    images: string[];
    facebookLink?: string;
    createdAt: string;
}

const getGradientForType = (type: string) => {
    switch (type) {
        case 'Events':
            return 'from-emerald-500 to-green-600';
        case 'Donations':
            return 'from-amber-500 to-orange-600';
        case 'Success Stories':
            return 'from-pink-500 to-rose-600';
        default:
            return 'from-blue-500 to-indigo-600';
    }
};

const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    if (dateStr.includes('-')) {
        const [year, month, day] = dateStr.split('-');
        // Array of Month names
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const mIndex = parseInt(month, 10) - 1;
        return `${parseInt(day, 10)} ${months[mIndex]} ${year}`;
    }
    return dateStr;
};

export default function GalleryDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [item, setItem] = useState<GalleryItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchDetails = async () => {
            try {
                const res = await fetch(`/api/gallery/images?id=${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setItem(data);
                } else {
                    console.error("Gallery item not found");
                }
            } catch (error) {
                console.error("Failed to fetch gallery details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    // Handle Keyboard Controls for Lightbox
    useEffect(() => {
        if (lightboxIndex === null || !item) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowRight') {
                navigateLightbox(1);
            } else if (e.key === 'ArrowLeft') {
                navigateLightbox(-1);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxIndex, item]);

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        document.body.style.overflow = 'hidden'; // Disable background scrolling
    };

    const closeLightbox = () => {
        setLightboxIndex(null);
        document.body.style.overflow = 'unset'; // Re-enable scrolling
    };

    const navigateLightbox = (direction: number) => {
        if (lightboxIndex === null || !item) return;
        const total = item.images.length;
        const nextIndex = (lightboxIndex + direction + total) % total;
        setLightboxIndex(nextIndex);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <div className="flex-grow flex items-center justify-center pt-24 pb-20">
                    <div className="text-center space-y-4">
                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Loading beautiful memories...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <div className="flex-grow flex flex-col items-center justify-center text-gray-900 pt-24 pb-20 p-4">
                    <div className="text-center max-w-md">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-black mb-2">Memory Not Found</h2>
                        <p className="text-gray-500 font-medium mb-6">The gallery album you are looking for might have been moved or deleted by the administrator.</p>
                        <button 
                            onClick={() => router.push('/gallery/image')}
                            className="bg-primary text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-green-600 transition-colors shadow-lg shadow-primary/20"
                        >
                            Back to Gallery
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const gradient = getGradientForType(item.type);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-grow pt-24 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Back Breadcrumb */}
                    <button 
                        onClick={() => router.push('/gallery/image')}
                        className="group inline-flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors mb-8 cursor-pointer"
                    >
                        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Gallery
                    </button>

                    {/* Main Layout Card */}
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm p-6 sm:p-10 mb-12">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            
                            {/* Left Text / Info Panel (5 cols) */}
                            <div className="lg:col-span-5 space-y-6">
                                <div>
                                    {/* Category tag */}
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-md inline-block mb-4 ${
                                        item.type === 'Events' ? 'bg-emerald-500' :
                                        item.type === 'Donations' ? 'bg-amber-500' :
                                        item.type === 'Success Stories' ? 'bg-pink-500' :
                                        'bg-blue-500'
                                    }`}>
                                        {item.type}
                                    </span>

                                    {/* Title */}
                                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                                        {item.title}
                                    </h1>
                                </div>

                                {/* Calendar/Date */}
                                <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest border-y border-gray-50 py-4">
                                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>Date of Activity:</span>
                                    <span className="text-gray-700">{formatDate(item.date)}</span>
                                </div>

                                {/* Description */}
                                <div className="space-y-4">
                                    <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Story & Impact</h3>
                                    <p className="text-gray-600 font-medium text-sm leading-relaxed whitespace-pre-line bg-gray-50/50 p-6 rounded-2xl border border-gray-50">
                                        {item.description}
                                    </p>
                                </div>

                                {item.facebookLink && (
                                    <div className="pt-2">
                                        <a
                                            href={item.facebookLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#1877F2] hover:bg-[#166FE5] text-white font-semibold px-6 py-3.5 rounded-2xl text-sm transition-all duration-300 shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5 group"
                                        >
                                            <svg className="w-4.5 h-4.5 fill-current shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                                                <path d="M9.101 23.681v-9.554H6.07V10.62h3.031V7.896c0-3.104 1.896-4.799 4.671-4.799 1.328 0 2.47.099 2.802.143v3.249l-1.923.001c-1.506 0-1.798.716-1.798 1.767v2.363h3.599l-.469 3.507h-3.13v9.554H9.101z" />
                                            </svg>
                                            See this programme related full images and videoes
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Right Image Show / First Image Hero (7 cols) */}
                            <div className="lg:col-span-7">
                                <div 
                                    onClick={() => openLightbox(0)}
                                    className="relative aspect-[16/10] bg-gray-100 rounded-3xl overflow-hidden border border-gray-100 shadow-sm cursor-pointer group"
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-20 transition-opacity duration-500 z-10`}></div>
                                    <Image
                                        src={item.images[0]}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        sizes="(max-width: 1024px) 100vw, 55vw"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-center justify-center">
                                        <div className="bg-white/95 text-gray-900 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl flex items-center gap-2 scale-90 group-hover:scale-100 transition-all duration-300">
                                            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                            Zoom Cover Photo
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Album Photo Gallery Grid */}
                    {item.images.length > 1 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                                Album Photos ({item.images.length})
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                                {item.images.map((imgUrl, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => openLightbox(idx)}
                                        className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                                    >
                                        <Image
                                            src={imgUrl}
                                            alt={`${item.title} - ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                        />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 flex items-center justify-center">
                                            <div className="bg-white/90 p-2 rounded-full shadow-lg">
                                                <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Premium Full Screen Lightbox Modal */}
            {lightboxIndex !== null && (
                <div className="fixed inset-0 z-[100] flex flex-col justify-between bg-black/95 backdrop-blur-xl select-none transition-all duration-500 animate-fadeIn">
                    
                    {/* Lightbox Header / Controls */}
                    <div className="p-4 sm:p-6 flex items-center justify-between text-white z-50">
                        {/* Image index count */}
                        <div className="text-xs font-black uppercase tracking-widest text-gray-400">
                            Photo {lightboxIndex + 1} of {item.images.length}
                        </div>
                        {/* Album title (visible on larger screens) */}
                        <div className="hidden md:block text-sm font-bold truncate max-w-xl">
                            {item.title}
                        </div>
                        {/* Close button */}
                        <button 
                            onClick={closeLightbox}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors group cursor-pointer"
                            title="Close (Esc)"
                        >
                            <svg className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Lightbox Content Section */}
                    <div className="flex-grow flex items-center justify-between px-4 sm:px-8 relative">
                        {/* Left Arrow Button */}
                        <button 
                            onClick={() => navigateLightbox(-1)}
                            className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all duration-300 shadow-xl cursor-pointer hover:scale-110 active:scale-95 group z-50"
                            title="Previous (Left Arrow)"
                        >
                            <svg className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        {/* Middle Large Active Image */}
                        <div className="relative w-full h-[70vh] max-w-5xl mx-4 transition-all duration-300 flex items-center justify-center animate-scaleIn">
                            <Image
                                src={item.images[lightboxIndex]}
                                alt={`${item.title} - Large View`}
                                fill
                                className="object-contain"
                                sizes="90vw"
                                priority
                            />
                        </div>

                        {/* Right Arrow Button */}
                        <button 
                            onClick={() => navigateLightbox(1)}
                            className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all duration-300 shadow-xl cursor-pointer hover:scale-110 active:scale-95 group z-50"
                            title="Next (Right Arrow)"
                        >
                            <svg className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Lightbox Footer / Caption */}
                    <div className="p-6 bg-gradient-to-t from-black/80 to-transparent text-center text-white/70 text-xs font-medium z-50">
                        {item.type} • {formatDate(item.date)} • Use Left/Right Arrow keys to navigate
                    </div>
                </div>
            )}

        </div>
    );
}
