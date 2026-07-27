"use client";

import React, { useState, useEffect } from 'react';
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

export default function ImageGalleryPage() {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [projectNames, setProjectNames] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        type: '',
        title: '',
        date: '',
        description: '',
        images: [] as string[],
        facebookLink: '',
    });

    useEffect(() => {
        fetchItems();
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/admin/projects');
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) {
                    const names = data.map((p: any) => p.name);
                    setProjectNames(names);
                    if (names.length > 0) {
                        setFormData(prev => ({ ...prev, type: prev.type || names[0] }));
                    }
                }
            }
        } catch (error) {
            console.error("Failed to fetch projects:", error);
        }
    };

    const fetchItems = async () => {
        try {
            const res = await fetch('/api/admin/gallery/images');
            const data = await res.json();
            if (Array.isArray(data)) {
                setItems(data);
            }
        } catch (error) {
            console.error("Failed to fetch gallery items:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);

            // Enforce frontend size verification: 2MB limit per file
            const allowedFiles = files.filter(file => {
                if (file.size > 2 * 1024 * 1024) {
                    alert(`Skipping "${file.name}" because it exceeds the 2MB size limit.`);
                    return false;
                }
                return true;
            });

            const base64Promises = allowedFiles.map(file => {
                return new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.readAsDataURL(file);
                });
            });
            const base64Images = await Promise.all(base64Promises);
            setFormData(prev => ({ ...prev, images: [...prev.images, ...base64Images] }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.date || !formData.description || formData.images.length === 0) {
            alert('Please fill in all fields and select at least one image.');
            return;
        }

        setIsSubmitting(true);
        try {
            const url = editingId 
                ? `/api/admin/gallery/images?id=${editingId}`
                : '/api/admin/gallery/images';
            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setFormData({ type: projectNames[0] || '', title: '', date: '', description: '', images: [], facebookLink: '' });
                setEditingId(null);
                fetchItems();
                alert(editingId ? 'Gallery item updated successfully!' : 'Gallery item added successfully!');
            } else {
                const error = await res.json();
                alert(`Error: ${error.error || 'Failed to save item.'}`);
            }
        } catch (error) {
            console.error("Failed to save gallery item:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (item: GalleryItem) => {
        setEditingId(item._id);
        setFormData({
            type: item.type,
            title: item.title,
            date: item.date,
            description: item.description,
            images: item.images || [],
            facebookLink: item.facebookLink || '',
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ type: projectNames[0] || '', title: '', date: '', description: '', images: [], facebookLink: '' });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this gallery item?")) return;
        try {
            const res = await fetch(`/api/admin/gallery/images?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchItems();
                alert("Gallery item deleted successfully!");
            } else {
                alert("Failed to delete gallery item.");
            }
        } catch (error) {
            console.error("Failed to delete gallery item:", error);
        }
    };

    const removeImageAtIndex = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, idx) => idx !== index)
        }));
    };

    return (
        <div>
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Image Gallery</h1>
                <p className="text-sm text-gray-400 font-bold mt-1">Manage all gallery images and memories displayed on the homepage and public portal</p>
            </div>

            {/* Add/Edit New Image Form */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 shadow-sm">
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    {editingId ? 'Edit Gallery Item' : 'Add New Gallery Item'}
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
                                placeholder="Enter gallery card title (e.g. Medical Camp 2026)"
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
                                {projectNames.map((name) => (
                                    <option key={name} value={name}>{name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Date Chooser */}
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

                        {/* Facebook Link (Optional) */}
                        <div className="space-y-1.5 md:col-span-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Facebook Link (Optional)</label>
                            <input
                                type="url"
                                value={formData.facebookLink}
                                onChange={(e) => setFormData(prev => ({ ...prev, facebookLink: e.target.value }))}
                                placeholder="e.g. https://facebook.com/media/set/?set=..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                            />
                        </div>
                    </div>

                    {/* Description Textarea */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description *</label>
                        <textarea
                            required
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Describe this beautiful memory (goals, impact, outcomes)..."
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all resize-none"
                        />
                    </div>

                    {/* File Upload Selector */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Upload Images * (Max 2MB per file. First image will act as Cover)
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-600 cursor-pointer"
                        />
                    </div>

                    {/* Thumbnail Previews */}
                    {formData.images.length > 0 && (
                        <div className="flex flex-wrap gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                            {formData.images.map((img, index) => (
                                <div key={index} className="relative w-20 h-20 bg-gray-200 rounded-lg overflow-hidden border border-gray-300 shadow-sm flex-shrink-0 group">
                                    <img src={img} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                    {index === 0 && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-primary/80 text-white text-[8px] font-black uppercase text-center py-0.5">
                                            Cover
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => removeImageAtIndex(index)}
                                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 transition-colors"
                                        title="Remove Image"
                                    >
                                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Submit / Action Buttons */}
                    <div className="flex items-center gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Uploading to Cloudinary...
                                </>
                            ) : (
                                editingId ? 'Update Gallery Item' : 'Upload Gallery Item'
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

            {/* Image Gallery Grid */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">All Image Gallery Cards</h2>
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">
                        {items.length} {items.length === 1 ? 'Item' : 'Items'}
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm font-bold">No gallery items uploaded yet.</p>
                        <p className="text-xs font-medium text-gray-400 mt-1">Fill out the form above to add your first memory!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                        {items.map((img) => (
                            <div key={img._id} className="group relative bg-gray-50 rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                                {/* Thumbnail Image */}
                                <div className="aspect-video relative overflow-hidden bg-gray-200">
                                    {img.images && img.images.length > 0 ? (
                                        <Image
                                            src={img.images[0]}
                                            alt={img.title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">No Images</span>
                                        </div>
                                    )}
                                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded backdrop-blur-sm">
                                        {img.images?.length || 0} {img.images?.length === 1 ? 'photo' : 'photos'}
                                    </div>
                                </div>

                                <div className="p-4 flex-grow flex flex-col justify-between">
                                    <div>
                                        <p className="text-sm font-black text-gray-900 mb-1 leading-tight line-clamp-1">{img.title}</p>
                                        <p className="text-xs text-gray-500 font-medium line-clamp-2 mb-3 leading-relaxed">
                                            {img.description}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-auto">
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-blue-50 text-blue-600 border border-blue-100">
                                                {img.type}
                                            </span>
                                            <span className="text-[10px] font-bold text-gray-400">{img.date}</span>
                                        </div>
                                        
                                        <div className="flex items-center gap-1">
                                            <button 
                                                onClick={() => handleEdit(img)}
                                                className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors group/btn" 
                                                title="Edit"
                                            >
                                                <svg className="w-4 h-4 text-gray-400 group-hover/btn:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(img._id)}
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
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
