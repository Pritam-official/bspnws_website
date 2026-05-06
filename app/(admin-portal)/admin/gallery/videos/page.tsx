"use client";

import React, { useState } from 'react';

const videoTypes = ['Events', 'Donations', 'Guests', 'Success Stories'];

const dummyVideos = [
    { id: 1, title: 'Annual Day Highlights 2026', type: 'Events', link: 'https://youtube.com/watch?v=example1', platform: 'YouTube', gradient: 'from-red-500 to-rose-600', date: '25/03/2026' },
    { id: 2, title: 'Donation Camp Live', type: 'Donations', link: 'https://facebook.com/watch/example2', platform: 'Facebook', gradient: 'from-blue-500 to-indigo-600', date: '20/03/2026' },
    { id: 3, title: 'Guest Speaker Series', type: 'Guests', link: 'https://youtube.com/watch?v=example3', platform: 'YouTube', gradient: 'from-red-500 to-rose-600', date: '15/03/2026' },
    { id: 4, title: 'Success Story - Empowerment', type: 'Success Stories', link: 'https://youtube.com/watch?v=example4', platform: 'YouTube', gradient: 'from-red-500 to-rose-600', date: '10/03/2026' },
    { id: 5, title: 'Tree Plantation Drive', type: 'Events', link: 'https://facebook.com/watch/example5', platform: 'Facebook', gradient: 'from-blue-500 to-indigo-600', date: '05/03/2026' },
];

export default function VideoGalleryPage() {
    const [formData, setFormData] = useState({ type: 'Events', title: '', link: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Video add functionality will be enabled later.');
    };

    return (
        <div>
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Video Gallery</h1>
                <p className="text-sm text-gray-400 font-bold mt-1">Manage all video content</p>
            </div>

            {/* Add New Video Form */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg flex items-center justify-center text-white">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    Add New Video
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all appearance-none cursor-pointer"
                        >
                            {videoTypes.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Video title"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Thumbnail</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-red-50 file:text-red-600"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Video Link (YouTube/Facebook)</label>
                        <input
                            type="url"
                            value={formData.link}
                            onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                            placeholder="https://youtube.com/..."
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl text-sm font-black uppercase tracking-widest shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 hover:-translate-y-0.5 transition-all duration-300"
                        >
                            Upload
                        </button>
                    </div>
                </form>
            </div>

            {/* Videos Grid */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">All Videos</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                    {dummyVideos.map((vid) => (
                        <div key={vid.id} className="group relative bg-gray-50 rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300">
                            {/* Thumbnail Placeholder */}
                            <div className={`aspect-video bg-gradient-to-br ${vid.gradient} flex items-center justify-center relative`}>
                                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                                {/* Platform badge */}
                                <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider text-white ${
                                    vid.platform === 'YouTube' ? 'bg-red-600/80' : 'bg-blue-600/80'
                                } backdrop-blur-sm`}>
                                    {vid.platform}
                                </span>
                            </div>
                            <div className="p-4">
                                <p className="text-sm font-bold text-gray-900 mb-1">{vid.title}</p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                            vid.type === 'Events' ? 'bg-emerald-50 text-emerald-600' :
                                            vid.type === 'Donations' ? 'bg-amber-50 text-amber-600' :
                                            vid.type === 'Guests' ? 'bg-blue-50 text-blue-600' :
                                            'bg-pink-50 text-pink-600'
                                        }`}>
                                            {vid.type}
                                        </span>
                                        <span className="text-[10px] font-bold text-gray-400">{vid.date}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors group/btn" title="Edit">
                                            <svg className="w-3.5 h-3.5 text-gray-400 group-hover/btn:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button className="p-1.5 hover:bg-red-50 rounded-lg transition-colors group/btn" title="Delete">
                                            <svg className="w-3.5 h-3.5 text-gray-400 group-hover/btn:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
