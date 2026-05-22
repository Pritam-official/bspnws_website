"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface GalleryItem {
    _id: string;
    title: string;
    description: string;
    type: string;
    date: string;
    images: string[];
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
        return `${day}/${month}/${year}`;
    }
    return dateStr;
};

const OurMemories = () => {
    const [memories, setMemories] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMemories = async () => {
            try {
                const res = await fetch('/api/gallery/images');
                const data = await res.json();
                if (Array.isArray(data)) {
                    // Show only the 4 latest memories on the homepage
                    setMemories(data.slice(0, 4));
                }
            } catch (err) {
                console.error("Failed to fetch homepage memories:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMemories();
    }, []);

    return (
        <section className="py-16 sm:py-24 bg-gray-50/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="mb-12 text-center md:text-left">
                    <div className="text-sm font-black text-primary tracking-[0.2em] uppercase mb-3">Our Moments</div>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Our Memories</h2>
                    <p className="text-gray-500 font-bold mt-4 max-w-2xl">A glimpse into the impact we've made and the lives we've touched together.</p>
                </div>

                {/* Gallery Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 p-5 space-y-4 shadow-sm h-80 animate-pulse">
                                <div className="aspect-[4/3] bg-gray-200 rounded-xl"></div>
                                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                                <div className="flex justify-between">
                                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : memories.length === 0 ? (
                    <div className="bg-white rounded-[2rem] border border-gray-100 p-12 text-center shadow-sm">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-black text-gray-900 mb-1">No Memories Shared Yet</h3>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Check back later for beautiful moments of impact</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {memories.map((memory) => {
                            const gradient = getGradientForType(memory.type);
                            const coverImage = memory.images && memory.images.length > 0 ? memory.images[0] : '/bg-2.jpg';
                            
                            return (
                                <Link
                                    key={memory._id}
                                    href={`/gallery/image/${memory._id}`}
                                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col justify-between"
                                >
                                    <div>
                                        {/* Image Container */}
                                        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                                            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-30 transition-opacity duration-500 z-10`}></div>
                                            <Image
                                                src={coverImage}
                                                alt={memory.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                            />
                                            {/* Type Tag Overlay */}
                                            <div className="absolute top-4 left-4 z-20">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-lg ${
                                                    memory.type === 'Events' ? 'bg-emerald-500' :
                                                    memory.type === 'Donations' ? 'bg-amber-500' :
                                                    memory.type === 'Success Stories' ? 'bg-pink-500' :
                                                    'bg-blue-500'
                                                }`}>
                                                    {memory.type}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-5">
                                            <h3 className="text-base font-black text-gray-900 mb-2 leading-tight group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">
                                                {memory.title}
                                            </h3>
                                            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4">
                                                {memory.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="p-5 pt-0 mt-auto border-t border-gray-50/50">
                                        <div className="flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest pt-4">
                                            <span>{formatDate(memory.date)}</span>
                                            <span className="flex items-center gap-1 text-primary group-hover:gap-2 transition-all">
                                                View Details
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* Call to Action */}
                <div className="mt-16 text-center">
                    <Link href="/gallery/image">
                        <span className="inline-block px-8 py-4 bg-white border-2 border-gray-100 text-gray-900 rounded-xl font-black uppercase tracking-widest hover:border-primary hover:text-primary hover:-translate-y-1 transition-all duration-300 shadow-sm cursor-pointer">
                            View Full Gallery
                        </span>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default OurMemories;
