"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/shared/Navbar';
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

export default function GalleryPage() {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchGallery();
    }, []);

    useEffect(() => {
        let result = items;

        if (selectedCategory !== 'All') {
            result = result.filter(item => item.type === selectedCategory);
        }

        if (searchQuery.trim() !== '') {
            result = result.filter(item => 
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredItems(result);
    }, [selectedCategory, searchQuery, items]);

    const fetchGallery = async () => {
        try {
            const res = await fetch('/api/gallery/images');
            const data = await res.json();
            if (Array.isArray(data)) {
                setItems(data);
                setFilteredItems(data);
            }
        } catch (error) {
            console.error("Failed to fetch gallery:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-grow pt-24 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight mb-4">
                            Our <span className="text-primary">Gallery</span>
                        </h1>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
                            A visual log of our milestones, initiatives, and community drives
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
                                placeholder="Search gallery..."
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
                                <div key={i} className="bg-white rounded-[2rem] border border-gray-100 p-6 h-[26rem] animate-pulse flex flex-col space-y-4 shadow-sm">
                                    <div className="aspect-[4/3] bg-gray-200 rounded-2xl w-full"></div>
                                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">No Gallery Items Found</h3>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Try selecting a different filter or clearing search</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredItems.map((item) => {
                                const gradient = getGradientForType(item.type);
                                const coverImg = item.images && item.images.length > 0 ? item.images[0] : '/bg-2.jpg';
                                
                                return (
                                    <Link
                                        key={item._id}
                                        href={`/gallery/image/${item._id}`}
                                        className="group bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col justify-between h-full"
                                    >
                                        <div>
                                            {/* Image container */}
                                            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 m-4 rounded-2xl">
                                                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-30 transition-opacity duration-500 z-10`}></div>
                                                <Image
                                                    src={coverImg}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                                {/* Tags */}
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
                                                <div className="absolute bottom-4 right-4 z-20 bg-black/60 text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-lg backdrop-blur-sm shadow-md">
                                                    {item.images?.length || 0} {item.images?.length === 1 ? 'photo' : 'photos'}
                                                </div>
                                            </div>

                                            {/* Body */}
                                            <div className="px-6 pb-4">
                                                <h3 className="text-xl font-black text-gray-900 mb-2 leading-tight group-hover:text-primary transition-colors line-clamp-2 min-h-[3rem]">
                                                    {item.title}
                                                </h3>
                                                <p className="text-sm text-gray-500 font-medium line-clamp-3 leading-relaxed">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="px-6 pb-6 pt-0 mt-auto">
                                            <div className="border-t border-gray-50/50 pt-4 flex items-center justify-between text-[11px] font-black text-gray-400 uppercase tracking-widest">
                                                <span>{formatDate(item.date)}</span>
                                                <span className="flex items-center gap-1.5 text-primary group-hover:gap-2.5 transition-all">
                                                    View Details
                                                    <svg className="w-3.5 h-3.5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                </div>
            </main>

        </div>
    );
}
