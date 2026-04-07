"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Cropper from 'react-easy-crop';

interface Officer {
    _id: string;
    name: string;
    designation: string;
    joiningDate: string;
    image?: string;
}

export default function OfficersPage() {
    const [officers, setOfficers] = useState<Officer[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ name: '', designation: '', date: '', image: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Cropping States
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [showCropper, setShowCropper] = useState(false);

    useEffect(() => {
        fetchOfficers();
    }, []);

    const fetchOfficers = async () => {
        try {
            const res = await fetch('/api/admin/officers');
            const data = await res.json();
            if (Array.isArray(data)) {
                setOfficers(data);
            }
        } catch (error) {
            console.error("Failed to fetch officers:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImageSrc(reader.result as string);
                setShowCropper(true);
            });
            reader.readAsDataURL(file);
        }
    };

    const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<string> => {
        const image = new Image();
        image.src = imageSrc;
        await new Promise((resolve) => (image.onload = resolve));

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) return '';

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );

        return canvas.toDataURL('image/jpeg');
    };

    const handleCropDone = async () => {
        try {
            if (imageSrc && croppedAreaPixels) {
                const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
                setFormData(prev => ({ ...prev, image: croppedImage }));
                setShowCropper(false);
                setImageSrc(null);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.designation || !formData.date) {
            alert("Please fill all required fields");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/admin/officers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    designation: formData.designation,
                    joiningDate: formData.date,
                    image: formData.image
                }),
            });

            if (res.ok) {
                setFormData({ name: '', designation: '', date: '', image: '' });
                fetchOfficers();
                alert("Officer added successfully!");
            } else {
                const error = await res.json();
                alert(`Error: ${error.error}`);
            }
        } catch (error) {
            console.error("Failed to add officer:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this officer?")) return;

        try {
            const res = await fetch(`/api/admin/officers/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                fetchOfficers();
                alert("Officer deleted successfully!");
            } else {
                alert("Failed to delete officer");
            }
        } catch (error) {
            console.error("Failed to delete officer:", error);
        }
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    return (
        <div className="relative">
            {/* Cropper Modal */}
            {showCropper && imageSrc && (
                <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4">
                    <div className="relative w-full max-w-2xl aspect-square bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                        />
                    </div>
                    <div className="mt-6 flex flex-col items-center gap-4 w-full max-w-md">
                        <div className="w-full space-y-2">
                           <div className="flex justify-between text-xs font-black text-white uppercase tracking-widest">
                               <span>Zoom</span>
                               <span>{Math.round(zoom * 100)}%</span>
                           </div>
                           <input
                                type="range"
                                value={zoom}
                                min={1}
                                max={3}
                                step={0.1}
                                aria-labelledby="Zoom"
                                onChange={(e) => setZoom(Number(e.target.value))}
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-500"
                            />
                        </div>
                        <div className="flex gap-4 w-full">
                            <button
                                onClick={() => { setShowCropper(false); setImageSrc(null); }}
                                className="flex-1 px-6 py-3 bg-white/10 text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-white/20 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCropDone}
                                className="flex-1 px-6 py-3 bg-pink-600 text-white rounded-xl text-sm font-black uppercase tracking-widest shadow-lg shadow-pink-600/20 hover:bg-pink-500 transition-all"
                            >
                                Crop Photo
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Officers</h1>
                <p className="text-sm text-gray-400 font-bold mt-1">Manage society officers</p>
            </div>

            {/* Add New Officer Form */}
            <div className="bg-white rounded-2xl border-2 border-gray-100 p-6 mb-8 shadow-sm">
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center text-white">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    Add New Officer
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter name"
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all shadow-sm"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Designation</label>
                        <input
                            type="text"
                            name="designation"
                            required
                            value={formData.designation}
                            onChange={handleChange}
                            placeholder="Enter designation"
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all shadow-sm"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</label>
                        <input
                            type="date"
                            name="date"
                            required
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all shadow-sm"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Picture (Crop after select)</label>
                        <div className="relative h-[46px]">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full opacity-0 z-10 cursor-pointer"
                            />
                            <div className={`w-full h-full border-2 border-dashed ${formData.image ? 'border-pink-500 bg-pink-50' : 'border-gray-200 bg-gray-50'} rounded-xl flex items-center justify-center gap-2 px-4 transition-all overflow-hidden`}>
                                {formData.image ? (
                                    <>
                                        <img src={formData.image} className="w-8 h-8 rounded-full border border-pink-200" alt="Preview"/>
                                        <span className="text-[10px] font-black text-pink-600 uppercase tracking-widest">Photo Cropped</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Choose Photo</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-2 lg:col-span-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-8 py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl text-sm font-black uppercase tracking-widest shadow-xl shadow-pink-500/20 hover:shadow-2xl hover:shadow-pink-500/30 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0"
                        >
                            {isSubmitting ? 'Processing...' : 'Add Officer to Directory'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Officers List */}
            <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Active Directory</h2>
                    {loading && <span className="text-[10px] font-bold text-pink-500 animate-pulse">Synchronizing...</span>}
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/30">
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Identity</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Role</th>
                                <th className="text-left px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest hidden sm:table-cell">Joined</th>
                                <th className="text-right px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Operations</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!loading && officers.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <div className="text-3xl mb-2">🤝</div>
                                        <div className="text-sm font-black text-gray-300 uppercase tracking-widest">No Active Records</div>
                                    </td>
                                </tr>
                            )}
                            {officers.map((o) => (
                                <tr key={o._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                {o.image ? (
                                                    <img src={o.image} alt={o.name} className="w-12 h-12 rounded-full border-2 border-white shadow-md object-cover ring-4 ring-gray-50 group-hover:ring-pink-50 transition-all" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400 text-[10px] font-black shadow-md border-2 border-white ring-4 ring-gray-50 group-hover:ring-pink-50 transition-all">
                                                        {getInitials(o.name)}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-900 group-hover:text-pink-600 transition-colors">{o.name}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="px-4 py-1.5 rounded-full bg-pink-50 text-pink-600 text-[10px] font-black uppercase tracking-widest border border-pink-100">
                                            {o.designation}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-xs text-gray-500 font-bold hidden sm:table-cell">{o.joiningDate}</td>
                                    <td className="px-6 py-5 text-right">
                                        <button 
                                            onClick={() => handleDelete(o._id)}
                                            className="p-2.5 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-xl transition-all hover:scale-110 active:scale-95 group/del border border-gray-100 hover:border-red-100" title="Revoke Access"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
