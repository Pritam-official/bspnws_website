"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface MediaItem {
    _id: string;
    type: 'outlet' | 'coverage';
    title: string;
    image: string;
    newsLink?: string;
    videoLink?: string;
}

export default function MediaCoverageAdminPage() {
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ type: 'outlet' as 'outlet' | 'coverage', title: '', image: '', newsLink: '', videoLink: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);

    useEffect(() => {
        fetchMediaItems();
    }, []);

    const fetchMediaItems = async () => {
        try {
            const res = await fetch('/api/admin/media-coverage');
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

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setFormData(prev => ({ ...prev, image: reader.result as string }));
            });
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.type || !formData.title || !formData.image) {
            alert('Please fill in all required fields (type, title, and image)');
            return;
        }

        setIsSubmitting(true);
        try {
            const method = editId ? 'PUT' : 'POST';
            const url = editId ? `/api/admin/media-coverage/${editId}` : '/api/admin/media-coverage';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert(editId ? 'Media item updated successfully!' : 'Media item added successfully!');
                setFormData({ type: 'outlet', title: '', image: '', newsLink: '', videoLink: '' });
                setEditId(null);
                fetchMediaItems();
            } else {
                const errData = await res.json();
                alert(`Error: ${errData.error || 'Failed to submit'}`);
            }
        } catch (error) {
            console.error("Failed to submit media item:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (item: MediaItem) => {
        setEditId(item._id);
        setFormData({
            type: item.type,
            title: item.title,
            image: item.image,
            newsLink: item.newsLink || '',
            videoLink: item.videoLink || ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this media item?")) return;

        try {
            const res = await fetch(`/api/admin/media-coverage/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                fetchMediaItems();
                alert("Media item deleted successfully!");
            } else {
                alert("Failed to delete media item");
            }
        } catch (error) {
            console.error("Failed to delete media item:", error);
        }
    };

    // Group items for display
    const outlets = mediaItems.filter(item => item.type === 'outlet');
    const coverages = mediaItems.filter(item => item.type === 'coverage');

    return (
        <div className="space-y-8">
            <div className="mb-8">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Our Media Coverage</h1>
                <p className="text-sm text-gray-400 font-bold mt-1">Manage news outlet logos and published media coverage images</p>
            </div>

            {/* Form Section */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <h2 className="text-sm font-black text-pink-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center text-white">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    {editId ? 'Edit Media Item' : 'Add New Media Item'}
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Item Category *</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value as 'outlet' | 'coverage' })}
                            className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-4 focus:outline-none focus:border-pink-600/30 transition-all font-bold text-gray-700 appearance-none"
                        >
                            <option value="outlet">Media Outlet (Logo)</option>
                            <option value="coverage">Media Coverage (News Image)</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Title / Name *</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-4 focus:outline-none focus:border-pink-600/30 transition-all font-bold text-gray-700"
                            placeholder={formData.type === 'outlet' ? "e.g., ABP Ananda, Bartaman News" : "e.g., Project Kutumba coverage in Bartaman"}
                        />
                    </div>

                    {formData.type === 'coverage' && (
                        <>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">News Article Link (Optional)</label>
                                <input
                                    type="url"
                                    value={formData.newsLink || ''}
                                    onChange={(e) => setFormData({ ...formData, newsLink: e.target.value })}
                                    className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-4 focus:outline-none focus:border-pink-600/30 transition-all font-bold text-gray-700"
                                    placeholder="e.g., https://example.com/news-article"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Video Link - Facebook/YouTube (Optional)</label>
                                <input
                                    type="url"
                                    value={formData.videoLink || ''}
                                    onChange={(e) => setFormData({ ...formData, videoLink: e.target.value })}
                                    className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-4 focus:outline-none focus:border-pink-600/30 transition-all font-bold text-gray-700"
                                    placeholder="e.g., https://facebook.com/watch/?v=..."
                                />
                            </div>
                        </>
                    )}

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Photo Upload (Cloudinary Auto-Upload)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-3 focus:outline-none focus:border-pink-600/30 transition-all font-bold text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-pink-50 file:text-pink-600 hover:file:bg-pink-100"
                        />
                    </div>

                    {formData.image && (
                        <div className="md:col-span-2 flex flex-col gap-2">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Image Preview</span>
                            <div className="relative w-40 h-40 rounded-2xl overflow-hidden border-2 border-pink-500 shadow-lg">
                                <img src={formData.image} className="w-full h-full object-cover" alt="Preview"/>
                            </div>
                        </div>
                    )}

                    <div className="md:col-span-2 flex gap-4">
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="bg-pink-600 text-white rounded-2xl py-4 px-12 font-black uppercase tracking-widest shadow-xl shadow-pink-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? 'Uploading & Saving...' : editId ? 'Update Item' : 'Submit Item'}
                        </button>
                        {editId && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditId(null);
                                    setFormData({ type: 'outlet', title: '', image: '', newsLink: '', videoLink: '' });
                                }}
                                className="bg-gray-100 text-gray-600 border border-gray-200 rounded-2xl py-4 px-8 font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* List Showcase Section: Media Outlets */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-sm font-black text-pink-600 uppercase tracking-widest">Media Outlets (News Channel Logos)</h2>
                    {loading && <span className="text-[10px] font-bold text-pink-500 animate-pulse">Syncing...</span>}
                </div>
                {outlets.length === 0 && !loading ? (
                    <div className="text-center py-12">
                        <div className="text-3xl mb-2">📡</div>
                        <p className="text-sm font-black text-gray-300 uppercase tracking-widest">No Outlet Logos Uploaded</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {outlets.map(item => (
                            <div key={item._id} className="group bg-gray-50 rounded-2xl p-4 border border-gray-100 hover:shadow-lg transition-all flex flex-col items-center justify-between gap-3 text-center">
                                <div className="relative h-20 w-full rounded-xl overflow-hidden bg-slate-50 border border-gray-100 flex items-center justify-center p-2">
                                    <img src={item.image} alt={item.title} className="max-w-full max-h-full object-contain" />
                                </div>
                                <div className="space-y-2 w-full">
                                    <h3 className="text-xs font-black text-gray-900 leading-snug truncate" title={item.title}>{item.title}</h3>
                                    <div className="flex justify-center gap-1.5 pt-1 border-t border-gray-100">
                                        <button 
                                            onClick={() => handleEdit(item)}
                                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" 
                                            title="Edit Outlet"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(item._id)}
                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" 
                                            title="Delete Outlet"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* List Showcase Section: Media Coverage */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-sm font-black text-pink-600 uppercase tracking-widest">Media Coverage (Published News Images)</h2>
                </div>
                {coverages.length === 0 && !loading ? (
                    <div className="text-center py-12">
                        <div className="text-3xl mb-2">📰</div>
                        <p className="text-sm font-black text-gray-300 uppercase tracking-widest">No News Clipping Images Uploaded</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {coverages.map(item => (
                            <div key={item._id} className="group bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all flex flex-col">
                                <div className="relative h-48 w-full transition-transform duration-500 overflow-hidden bg-slate-200">
                                    <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-102 transition-transform duration-500" />
                                </div>
                                <div className="p-6 space-y-3 flex flex-col flex-1">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="space-y-1.5 flex-1 min-w-0">
                                            <h3 className="text-sm font-black text-gray-900 leading-snug line-clamp-2" title={item.title}>{item.title}</h3>
                                            <div className="flex flex-wrap gap-1.5 pt-1">
                                                {item.newsLink && (
                                                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md border border-blue-100 truncate max-w-full" title={item.newsLink}>
                                                        News Link
                                                    </span>
                                                )}
                                                {item.videoLink && (
                                                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-purple-50 text-purple-600 rounded-md border border-purple-100 truncate max-w-full" title={item.videoLink}>
                                                        Video Link
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-1 shrink-0 pt-0.5">
                                            <button 
                                                onClick={() => handleEdit(item)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" 
                                                title="Edit Coverage"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(item._id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" 
                                                title="Delete Coverage"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
