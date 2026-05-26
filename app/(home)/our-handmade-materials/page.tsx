"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import { Sparkles, MessageSquare, ArrowLeft, Info, Eye } from "lucide-react";

interface Material {
    _id: string;
    name: string;
    description: string;
    image?: string;
}

export default function HandmadeMaterialsShowcasePage() {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const res = await fetch("/api/admin/handmade-materials");
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
        fetchMaterials();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <Navbar />

            {/* Header Hero Section */}
            <div className="relative pt-24 sm:pt-32 pb-16 bg-gradient-to-br from-slate-900 via-[#0d1511] to-slate-900 text-white overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>

                <div className="container mx-auto px-6 relative z-10 max-w-5xl text-center">
                    <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full mb-6 border border-emerald-500/20">
                        <Sparkles className="w-4 h-4 animate-spin-slow" />
                        <span className="text-xs font-black uppercase tracking-widest">Handicrafts & Empowerment</span>
                    </div>
                    <h1
                        className="text-4xl md:text-5xl font-black tracking-tight mb-4"
                        style={{ fontFamily: '"Georgia", "Times New Roman", serif' }}
                    >
                        Our Handmade Materials
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base font-medium">
                        Explore our beautiful, eco-friendly products handcrafted with care by our team. We create and showcase a wide variety of unique, sustainable products designed to bring creativity, quality, and purpose together.
                    </p>
                </div>
            </div>

            {/* Main Content Showcase */}
            <div className="container mx-auto px-4 sm:px-6 py-16 max-w-5xl">
                {loading ? (
                    <div className="flex justify-center items-center py-40">
                        <div className="flex gap-1.5">
                            {[0, 1, 2].map(i => (
                                <div
                                    key={i}
                                    className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"
                                    style={{ animationDelay: `${i * 150}ms` }}
                                />
                            ))}
                        </div>
                    </div>
                ) : materials.length === 0 ? (
                    <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-xl max-w-2xl mx-auto space-y-6">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto">🎨</div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-black text-slate-800 uppercase tracking-wider">Showcase Collection Updating</h2>
                            <p className="text-slate-400 text-sm max-w-md mx-auto">Our artisans are creating new batches of eco-friendly materials. We will list them on our public store shortly.</p>
                        </div>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 bg-emerald-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider hover:bg-emerald-500 transition-all shadow-md"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to Home
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {/* Dynamic Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {materials.map((mat) => (
                                <div
                                    key={mat._id}
                                    className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col"
                                >
                                    {/* Image Container */}
                                    <div className="relative h-56 w-full bg-slate-50 overflow-hidden border-b border-slate-100">
                                        {mat.image ? (
                                            <img
                                                src={mat.image}
                                                alt={mat.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                                                <span className="text-5xl">🛍️</span>
                                                <span className="text-[10px] font-bold tracking-widest uppercase mt-3">BSPNWS Artisans</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Body Description */}
                                    <div className="p-6 flex flex-col flex-1 space-y-3">
                                        <h3
                                            className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors"
                                            style={{ fontFamily: '"Georgia", serif' }}
                                        >
                                            {mat.name}
                                        </h3>

                                        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed flex-grow">
                                            {mat.description}
                                        </p>

                                        <div className="pt-4 border-t border-slate-50 mt-auto flex gap-3">
                                            <a
                                                href={mat.image || "/logo.jpg"}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider text-center flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10 active:scale-[0.98] transition-all"
                                            >
                                                <Eye className="w-3.5 h-3.5" /> Preview
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Extra Support Alert */}
                        <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-3xl flex items-start gap-4 max-w-3xl mx-auto">
                            <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <h4 className="font-bold text-emerald-950 text-sm">Please Note</h4>
                                <p className="text-emerald-800/80 text-xs leading-relaxed">
                                    These products are showcased as part of our creative and eco-friendly innovations. We do not sell these items directly. If you would like to learn how these products are made or want guidance for creating similar products, please contact us through our contact portal.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
