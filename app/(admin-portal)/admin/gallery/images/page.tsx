"use client";

import React, { useState } from 'react';

const imageTypes = ['Events', 'Donations', 'Guests', 'Success Stories'];

const dummyImages = [
    { id: 1, title: 'Tree Plantation Event 2026', type: 'Events', count: 12, gradient: 'from-emerald-500 to-green-600', date: '28/03/2026' },
    { id: 2, title: 'Donation Drive February', type: 'Donations', count: 8, gradient: 'from-amber-500 to-orange-600', date: '15/02/2026' },
    { id: 3, title: 'Chief Guest Visit', type: 'Guests', count: 15, gradient: 'from-blue-500 to-indigo-600', date: '10/02/2026' },
    { id: 4, title: 'Success Story - Rani Devi', type: 'Success Stories', count: 6, gradient: 'from-pink-500 to-rose-600', date: '01/02/2026' },
    { id: 5, title: 'Annual Day Celebration', type: 'Events', count: 24, gradient: 'from-violet-500 to-purple-600', date: '15/01/2026' },
    { id: 6, title: 'Food Distribution', type: 'Donations', count: 10, gradient: 'from-cyan-500 to-teal-600', date: '05/01/2026' },
];

export default function ImageGalleryPage() {
    const [formData, setFormData] = useState({ type: 'Events', title: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Image upload functionality will be enabled later.');
    };

    return (
        <div>
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Image Gallery</h1>
                <p className="text-sm text-gray-400 font-bold mt-1">Manage all gallery images</p>
            </div>

            {/* Add New Image Form */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    Add New Image
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all appearance-none cursor-pointer"
                        >
                            {imageTypes.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Enter title"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Upload Images (Multiple)</label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-600"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl text-sm font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-300"
                        >
                            Upload
                        </button>
                    </div>
                </form>
            </div>

            {/* Image Gallery Grid */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">All Images</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                    {dummyImages.map((img) => (
                        <div key={img.id} className="group relative bg-gray-50 rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300">
                            {/* Placeholder Image */}
                            <div className={`aspect-video bg-gradient-to-br ${img.gradient} flex items-center justify-center`}>
                                <div className="text-center text-white">
                                    <svg className="w-10 h-10 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-xs font-bold opacity-70">{img.count} photos</p>
                                </div>
                            </div>
                            <div className="p-4">
                                <p className="text-sm font-bold text-gray-900 mb-1">{img.title}</p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                            img.type === 'Events' ? 'bg-emerald-50 text-emerald-600' :
                                            img.type === 'Donations' ? 'bg-amber-50 text-amber-600' :
                                            img.type === 'Guests' ? 'bg-blue-50 text-blue-600' :
                                            'bg-pink-50 text-pink-600'
                                        }`}>
                                            {img.type}
                                        </span>
                                        <span className="text-[10px] font-bold text-gray-400">{img.date}</span>
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
