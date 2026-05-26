"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface Material {
    _id: string;
    name: string;
    description: string;
    image?: string;
}

export default function HandmadeMaterialsAdminPage() {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ name: '', description: '', image: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);

    useEffect(() => {
        fetchMaterials();
    }, []);

    const fetchMaterials = async () => {
        try {
            const res = await fetch('/api/admin/handmade-materials');
            const data = await res.json();
            if (Array.isArray(data)) {
                setMaterials(data);
            }
        } catch (error) {
            console.error("Failed to fetch handmade materials:", error);
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
        if (!formData.name || !formData.description) {
            alert('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        try {
            const method = editId ? 'PUT' : 'POST';
            const url = editId ? `/api/admin/handmade-materials/${editId}` : '/api/admin/handmade-materials';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert(editId ? 'Material updated successfully!' : 'Material added successfully!');
                setFormData({ name: '', description: '', image: '' });
                setEditId(null);
                fetchMaterials();
            } else {
                const errData = await res.json();
                alert(`Error: ${errData.error || 'Failed to submit'}`);
            }
        } catch (error) {
            console.error("Failed to submit material:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (material: Material) => {
        setEditId(material._id);
        setFormData({
            name: material.name,
            description: material.description,
            image: material.image || ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this handmade material?")) return;

        try {
            const res = await fetch(`/api/admin/handmade-materials/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                fetchMaterials();
                alert("Material deleted successfully!");
            } else {
                alert("Failed to delete material");
            }
        } catch (error) {
            console.error("Failed to delete material:", error);
        }
    };

    return (
        <div className="space-y-8">
            <div className="mb-8">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Our Handmade Materials</h1>
                <p className="text-sm text-gray-400 font-bold mt-1">Manage society handmade materials and crafts</p>
            </div>

            {/* Form Section */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <h2 className="text-sm font-black text-pink-600 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center text-white">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    {editId ? 'Edit Handmade Material' : 'Add New Handmade Material'}
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Material Name *</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-4 focus:outline-none focus:border-pink-600/30 transition-all font-bold text-gray-700"
                            placeholder="Enter material name"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Photo Upload (Cloudinary Auto-Upload)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-3 focus:outline-none focus:border-pink-600/30 transition-all font-bold text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-pink-50 file:text-pink-600 hover:file:bg-pink-100"
                        />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description *</label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-4 focus:outline-none focus:border-pink-600/30 transition-all font-bold text-gray-700 h-32 resize-none"
                            placeholder="Describe the craft details, materials used, self-help groups, etc..."
                        ></textarea>
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
                            {isSubmitting ? 'Uploading & Saving...' : editId ? 'Update Material' : 'Submit Material'}
                        </button>
                        {editId && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditId(null);
                                    setFormData({ name: '', description: '', image: '' });
                                }}
                                className="bg-gray-100 text-gray-600 border border-gray-200 rounded-2xl py-4 px-8 font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* List Showcase Section */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-sm font-black text-pink-600 uppercase tracking-widest">Active Materials Showcase</h2>
                    {loading && <span className="text-[10px] font-bold text-pink-500 animate-pulse">Syncing...</span>}
                </div>
                {materials.length === 0 && !loading ? (
                    <div className="text-center py-12">
                        <div className="text-3xl mb-2">🛍️</div>
                        <p className="text-sm font-black text-gray-300 uppercase tracking-widest">No Active Materials Records</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {materials.map(material => (
                            <div key={material._id} className="group bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all flex flex-col">
                                <div className="relative h-48 w-full transition-transform duration-500 overflow-hidden bg-slate-200">
                                    {material.image ? (
                                        <Image src={material.image} alt={material.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                                            <span className="text-3xl">🛍️</span>
                                            <span className="text-[10px] font-bold tracking-widest mt-1">No Image</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 space-y-3 flex flex-col flex-1">
                                    <div className="flex justify-between items-start gap-2">
                                        <h3 className="text-base font-black text-gray-900 leading-snug">{material.name}</h3>
                                        <div className="flex gap-1 shrink-0">
                                            <button 
                                                onClick={() => handleEdit(material)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" 
                                                title="Edit Material"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(material._id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" 
                                                title="Delete Material"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 font-bold leading-relaxed flex-grow">{material.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
