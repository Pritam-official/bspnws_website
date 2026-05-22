"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/home/Footer';
import Image from 'next/image';

interface GalleryVideoItem {
    _id: string;
    title: string;
    type: string;
    date: string;
    thumbnail: string;
    link: string;
    createdAt: string;
}

const categories = ['All', 'Events', 'Donations', 'Guests', 'Success Stories'];

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

export default function PublicVideoGalleryPage() {
    const [items, setItems] = useState<GalleryVideoItem[]>([]);
    const [filteredItems, setFilteredItems] = useState<GalleryVideoItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchVideos();
    }, []);

    useEffect(() => {
        let result = items;

        if (selectedCategory !== 'All') {
            result = result.filter(item => item.type === selectedCategory);
        }

        if (searchQuery.trim() !== '') {
            result = result.filter(item => 
                item.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredItems(result);
    }, [selectedCategory, searchQuery, items]);

    const fetchVideos = async () => {
        try {
            const res = await fetch('/api/gallery/videos');
            const data = await res.json();
            if (Array.isArray(data)) {
                setItems(data);
                setFilteredItems(data);
            }
        } catch (error) {
            console.error("Failed to fetch public videos:", error);
        } finally {
            setLoading(false);
        }
    };

    const getPlatform = (link: string) => {
        if (!link) return 'Unknown';
        if (link.toLowerCase().includes('youtube.com') || link.toLowerCase().includes('youtu.be')) return 'YouTube';
        if (link.toLowerCase().includes('facebook.com') || link.toLowerCase().includes('fb.watch') || link.toLowerCase().includes('fb.com')) return 'Facebook';
        return 'Video';
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-grow pt-24 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight mb-4">
                            Video <span className="text-primary">Gallery</span>
                        </h1>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
                            Watch our milestones, community impacts, and celebrations in action
                        </p>
                    </div>

                    {/* Filter & Search Controls */}
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-12">
                        {/* Category Buttons */}
                        <div className="flex flex-wrap gap-2 justify-center">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 border ${
                                        selectedCategory === cat
                                            ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                                            : 'bg-white border-gray-100 hover:border-gray-300 text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Search Input */}
                        <div className="relative w-full md:w-80">
                            <input
                                type="text"
                                placeholder="Search videos..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 pl-10 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                            />
                            <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="bg-white rounded-[2rem] border border-gray-100 p-6 h-[22rem] animate-pulse flex flex-col space-y-4 shadow-sm">
                                    <div className="aspect-video bg-gray-200 rounded-2xl w-full"></div>
                                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                    <div className="flex justify-between mt-auto">
                                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <div className="bg-white rounded-[3rem] p-20 text-center border border-gray-100 shadow-xl shadow-gray-200/50">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">No Videos Found</h3>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Try selecting a different filter or clearing search</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredItems.map((item) => {
                                const gradient = getGradientForType(item.type);
                                const platform = getPlatform(item.link);
                                
                                return (
                                    <a
                                        key={item._id}
                                        href={item.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col justify-between h-full"
                                    >
                                        <div>
                                            {/* Thumbnail Cover with glowing Play Button */}
                                            <div className="relative aspect-video overflow-hidden bg-gray-100 m-4 rounded-2xl">
                                                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-30 transition-opacity duration-500 z-10`}></div>
                                                <Image
                                                    src={item.thumbnail}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                                
                                                {/* Play Button Overlay with Micro-animation */}
                                                <div className="absolute inset-0 flex items-center justify-center z-20">
                                                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-white/30 transform group-hover:scale-125 group-hover:bg-primary/95 group-hover:border-primary group-hover:shadow-primary/30 transition-all duration-500">
                                                        <svg className="w-6 h-6 text-white ml-1 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M8 5v14l11-7z" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                {/* Category Tag */}
                                                <div className="absolute top-4 left-4 z-20">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-lg ${
                                                        item.type === 'Events' ? 'bg-emerald-500' :
                                                        item.type === 'Donations' ? 'bg-amber-500' :
                                                        item.type === 'Success Stories' ? 'bg-pink-500' :
                                                        'bg-blue-500'
                                                    }`}>
                                                        {item.type}
                                                    </span>
                                                </div>

                                                {/* Platform badge */}
                                                <span className={`absolute bottom-4 right-4 z-20 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider text-white ${
                                                    platform === 'YouTube' ? 'bg-red-600/80' : 'bg-blue-600/80'
                                                } backdrop-blur-sm shadow-md`}>
                                                    {platform}
                                                </span>
                                            </div>

                                            {/* Body */}
                                            <div className="px-6 pb-4">
                                                <h3 className="text-lg font-black text-gray-900 mb-1 leading-tight group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5rem]">
                                                    {item.title}
                                                </h3>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="px-6 pb-6 pt-0 mt-auto">
                                            <div className="border-t border-gray-50/50 pt-4 flex items-center justify-between text-[11px] font-black text-gray-400 uppercase tracking-widest">
                                                <span>{formatDate(item.date)}</span>
                                                <span className="flex items-center gap-1.5 text-primary group-hover:gap-2.5 transition-all">
                                                    Watch Video
                                                    <svg className="w-3.5 h-3.5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                                    </svg>
                                                </span>
                                            </div>
                                        </div>
                                    </a>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
