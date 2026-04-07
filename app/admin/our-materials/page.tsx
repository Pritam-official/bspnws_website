"use client";

import React, { useState } from 'react';
import Image from 'next/image';

const dummyMaterials = [
    {
        id: 1,
        image: "/logo.jpg",
        name: "Eco-Friendly Bamboo Pencils",
        description: "Zero-waste pencils made from sustainable bamboo and recycled graphite."
    },
    {
        id: 2,
        image: "/logo.jpg",
        name: "Handmade Jute Bags",
        description: "Sturdy and stylish bags crafted by local artisans from natural jute fibers."
    }
];

export default function OurMaterialsPage() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        images: [] as File[]
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFormData({ ...formData, images: Array.from(e.target.files) });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Innovation added successfully!');
        setFormData({ name: '', description: '', images: [] });
    };

    return (
        <div className="space-y-8">
            <div className="mb-8">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Our Materials & Innovations</h1>
                <p className="text-sm text-gray-400 font-bold mt-1">Manage society innovations and materials</p>
            </div>

            {/* Add New Innovation Section */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <h2 className="text-sm font-black text-pink-600 uppercase tracking-widest mb-6">Add New Innovation</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Innovation Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-4 focus:outline-none focus:border-pink-600/30 transition-all font-bold text-gray-700"
                            placeholder="Enter innovation name"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">File Upload (Multiple Images)</label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-3.5 focus:outline-none focus:border-pink-600/30 transition-all font-bold text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-pink-50 file:text-pink-600 hover:file:bg-pink-100"
                        />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-4 focus:outline-none focus:border-pink-600/30 transition-all font-bold text-gray-700 h-32 resize-none"
                            placeholder="Enter innovation description..."
                        ></textarea>
                    </div>
                    <div className="md:col-span-2">
                        <button type="submit" className="bg-pink-600 text-white rounded-2xl py-5 px-12 font-black uppercase tracking-widest shadow-xl shadow-pink-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all">Submit Innovation</button>
                    </div>
                </form>
            </div>

            {/* Show All Section */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <h2 className="text-sm font-black text-pink-600 uppercase tracking-widest mb-6">Show All Innovations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dummyMaterials.map(material => (
                        <div key={material.id} className="group bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all">
                            <div className="relative h-48 w-full transition-transform duration-500 group-hover:scale-105">
                                <Image src={material.image} alt={material.name} fill className="object-cover" />
                            </div>
                            <div className="p-6 space-y-3">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-black text-gray-900">{material.name}</h3>
                                    <div className="flex gap-2">
                                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        </button>
                                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 font-bold leading-relaxed">{material.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
