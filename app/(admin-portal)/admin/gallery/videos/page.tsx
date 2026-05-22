"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const videoTypes = ['Events', 'Donations', 'Guests', 'Success Stories'];

interface GalleryVideoItem {
    _id: string;
    title: string;
    type: string;
    date: string;
    thumbnail: string;
    link: string;
    createdAt: string;
}

export default function VideoGalleryPage() {
    const [items, setItems] = useState<GalleryVideoItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        type: 'Events',
        title: '',
        date: '',
        link: '',
        thumbnail: ''
    });

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const res = await fetch('/api/admin/gallery/videos');
            const data = await res.json();
            if (Array.isArray(data)) {
                setItems(data);
            }
        } catch (error) {
            console.error("Failed to fetch videos:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            if (file.size > 2 * 1024 * 1024) {
                alert(`File "${file.name}" exceeds the 2MB size limit.`);
                e.target.value = ''; // Reset input
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, thumbnail: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.date || !formData.link || !formData.thumbnail) {
            alert('Please fill in all fields and select a thumbnail image.');
            return;
        }

        setIsSubmitting(true);
        try {
            const url = editingId 
                ? `/api/admin/gallery/videos?id=${editingId}`
                : '/api/admin/gallery/videos';
            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setFormData({ type: 'Events', title: '', date: '', link: '', thumbnail: '' });
                setEditingId(null);
                fetchItems();
                alert(editingId ? 'Video updated successfully!' : 'Video added successfully!');
                const fileInput = document.getElementById('thumbnail-input') as HTMLInputElement;
                if (fileInput) fileInput.value = '';
            } else {
                const error = await res.json();
                alert(`Error: ${error.error || 'Failed to save video.'}`);
            }
        } catch (error) {
            console.error("Failed to save video:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (item: GalleryVideoItem) => {
        setEditingId(item._id);
        setFormData({
            type: item.type,
            title: item.title,
            date: item.date,
            link: item.link,
            thumbnail: item.thumbnail
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ type: 'Events', title: '', date: '', link: '', thumbnail: '' });
        const fileInput = document.getElementById('thumbnail-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this video gallery item?")) return;
        try {
            const res = await fetch(`/api/admin/gallery/videos?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchItems();
                alert("Video deleted successfully!");
            } else {
                alert("Failed to delete video.");
            }
        } catch (error) {
            console.error("Failed to delete video:", error);
        }
    };

    const getPlatform = (link: string) => {
        if (!link) return 'Unknown';
        if (link.toLowerCase().includes('youtube.com') || link.toLowerCase().includes('youtu.be')) return 'YouTube';
        if (link.toLowerCase().includes('facebook.com') || link.toLowerCase().includes('fb.watch') || link.toLowerCase().includes('fb.com')) return 'Facebook';
        return 'Video';
    };

    const getGradient = (platform: string) => {
        return platform === 'YouTube' ? 'from-red-500 to-rose-600' :
               platform === 'Facebook' ? 'from-blue-500 to-indigo-600' :
               'from-gray-500 to-slate-600';
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        if (dateStr.includes('-')) {
            const [year, month, day] = dateStr.split('-');
            return `${day}/${month}/${year}`;
        }
        return dateStr;
    };

    return (
        <div>
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Video Gallery</h1>
                <p className="text-sm text-gray-400 font-bold mt-1">Manage all video content and media highlights</p>
            </div>

            {/* Add/Edit New Video Form */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 shadow-sm">
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg flex items-center justify-center text-white">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    {editingId ? 'Edit Video Link' : 'Add New Video Link'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Title */}
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Title *</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Video highlights title"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                            />
                        </div>

                        {/* Category Type */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Type *</label>
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

                        {/* Event Date */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Event Date *</label>
                            <input
                                type="date"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all cursor-pointer"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Video Link */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Video Link (YouTube/Facebook) *</label>
                            <input
                                type="url"
                                required
                                value={formData.link}
                                onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                                placeholder="https://youtube.com/... or https://facebook.com/..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                            />
                        </div>

                        {/* Thumbnail File */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                Thumbnail * (Max 2MB. Stored on Cloudinary)
                            </label>
                            <input
                                id="thumbnail-input"
                                type="file"
                                accept="image/*"
                                required={!editingId}
                                onChange={handleFileChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-red-50 file:text-red-600 cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Thumbnail Preview */}
                    {formData.thumbnail && (
                        <div className="flex gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 w-fit">
                            <div className="relative w-28 h-20 bg-gray-200 rounded-lg overflow-hidden border border-gray-300 shadow-sm flex-shrink-0">
                                <img src={formData.thumbnail} alt="Thumbnail preview" className="w-full h-full object-cover" />
                                <div className="absolute bottom-0 left-0 right-0 bg-red-600/80 text-white text-[8px] font-black uppercase text-center py-0.5">
                                    Preview
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Uploading Thumbnail...
                                </>
                            ) : (
                                editingId ? 'Update Video' : 'Upload Video'
                            )}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Videos Grid */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">All Videos</h2>
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">
                        {items.length} {items.length === 1 ? 'Video' : 'Videos'}
                    </span>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="bg-gray-50 h-64 rounded-xl border border-gray-100 animate-pulse"></div>
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <div className="p-16 text-center text-gray-400">
                        <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm font-bold">No videos uploaded yet.</p>
                        <p className="text-xs font-medium text-gray-400 mt-1">Fill out the form above to post your first video link!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                        {items.map((vid) => {
                            const platform = getPlatform(vid.link);
                            const gradient = getGradient(platform);

                            return (
                                <div key={vid._id} className="group relative bg-gray-50 rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                                    {/* Thumbnail */}
                                    <div className="aspect-video relative bg-gray-200 overflow-hidden">
                                        <Image
                                            src={vid.thumbnail}
                                            alt={vid.title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                        />
                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                                            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </div>
                                        </div>
                                        {/* Platform badge */}
                                        <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider text-white ${
                                            platform === 'YouTube' ? 'bg-red-600/80' : 'bg-blue-600/80'
                                        } backdrop-blur-sm shadow-md`}>
                                            {platform}
                                        </span>
                                    </div>
                                    
                                    <div className="p-4 flex-grow flex flex-col justify-between">
                                        <div>
                                            <p className="text-sm font-black text-gray-900 mb-2 leading-tight line-clamp-2">{vid.title}</p>
                                        </div>
                                        
                                        <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-auto">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                                                    vid.type === 'Events' ? 'bg-emerald-50 text-emerald-600' :
                                                    vid.type === 'Donations' ? 'bg-amber-50 text-amber-600' :
                                                    vid.type === 'Guests' ? 'bg-blue-50 text-blue-600' :
                                                    'bg-pink-50 text-pink-600'
                                                }`}>
                                                    {vid.type}
                                                </span>
                                                <span className="text-[10px] font-bold text-gray-400">{formatDate(vid.date)}</span>
                                            </div>
                                            
                                            <div className="flex items-center gap-1">
                                                <button 
                                                    onClick={() => handleEdit(vid)}
                                                    className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors group/btn" 
                                                    title="Edit"
                                                >
                                                    <svg className="w-4 h-4 text-gray-400 group-hover/btn:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(vid._id)}
                                                    className="p-1.5 hover:bg-red-50 rounded-lg transition-colors group/btn" 
                                                    title="Delete"
                                                >
                                                    <svg className="w-4 h-4 text-gray-400 group-hover/btn:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
