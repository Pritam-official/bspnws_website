"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import { ArrowLeft, FileText, Image as ImageIcon, ExternalLink, Heart, CheckCircle2, LayoutGrid, Sparkles } from "lucide-react";

interface Project {
    _id: string;
    name: string;
    description: string;
    images: string[];
    pdf?: string;
}

interface GalleryItem {
    _id: string;
    title: string;
    description: string;
    type: string;
    date: string;
    images: string[];
    createdAt: string;
}

const getProjectLogo = (name: string): string | null => {
    const lowerName = name.toLowerCase().trim();
    if (lowerName.includes("baristha") || lowerName.includes("vandana")) {
        return "/baristha_vandana_logo.png";
    }
    if (lowerName.includes("anandam") || lowerName.includes("aanandam")) {
        return "/anandam_logo.png";
    }
    if (lowerName.includes("annaprashan") || lowerName.includes("annaprashana")) {
        return "/annaprashan_logo.png";
    }
    if (lowerName.includes("kutumba")) {
        return "/kutumba_logo.png";
    }
    if (lowerName.includes("samparker") || lowerName.includes("bondhon") || lowerName.includes("bandhan") || lowerName.includes("somparker")) {
        return "/samparker bondhon.png";
    }
    if (lowerName.includes("shyamalima") || lowerName.includes("syamolima")) {
        return "/shyamalima_logo.png";
    }
    if (lowerName.includes("swasthya") || lowerName.includes("sastha") || lowerName.includes("vikash") || lowerName.includes("vikas")) {
        return "/swasthya_vikash_logo.png";
    }
    if (lowerName.includes("utsaho")) {
        return "/utsaho_logo.png";
    }
    return null;
};

export default function ProjectDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [project, setProject] = useState<Project | null>(null);
    const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState<string | null>(null);

    const logoUrl = project ? getProjectLogo(project.name) : null;

    useEffect(() => {
        if (!params?.id) return;

        const fetchProjectDetail = async () => {
            try {
                const res = await fetch(`/api/admin/projects/${params.id}`);
                if (!res.ok) {
                    throw new Error("Project not found");
                }
                const data = await res.json();
                setProject(data);
                if (data.images && data.images.length > 0) {
                    setActiveImage(data.images[0]);
                }
                await fetchProjectGallery(data.name);
            } catch (error) {
                console.error("Failed to fetch project details:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchProjectGallery = async (projectName: string) => {
            try {
                const res = await fetch(`/api/gallery/images?type=${encodeURIComponent(projectName)}`);
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) {
                        setGalleryImages(data);
                    }
                }
            } catch (e) {
                console.error("Failed to fetch project gallery:", e);
            }
        };

        fetchProjectDetail();
    }, [params]);

    const openPdf = () => {
        if (!project?.pdf) return;
        if (project.pdf.includes('drive.google.com')) {
            const match = project.pdf.match(/\/d\/([a-zA-Z0-9_-]+)/);
            if (match) {
                window.open(`https://drive.google.com/file/d/${match[1]}/preview`, '_blank');
                return;
            }
        }
        try {
            const b64 = project.pdf.split(',')[1];
            if (!b64) throw new Error();
            const bytes = new Uint8Array(atob(b64).split('').map(c => c.charCodeAt(0)));
            window.open(URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' })), '_blank');
        } catch {
            window.open(project.pdf, '_blank');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col">
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="flex gap-1.5">
                        {[0, 1, 2].map(i => (
                            <div
                                key={i}
                                className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"
                                style={{ animationDelay: `${i * 150}ms` }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-slate-50/50 flex flex-col">
                <Navbar />
                <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-2xl mb-4 font-bold">⚠️</div>
                    <h1 className="text-xl font-bold text-slate-800 mb-2">Project Not Found</h1>
                    <p className="text-slate-400 text-sm mb-6 max-w-sm">The project you are looking for may have been removed or updated by an administrator.</p>
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2 bg-emerald-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider hover:bg-emerald-500 transition-all shadow-md"
                    >
                        <ArrowLeft className="w-4 h-4" /> Go Back
                    </button>
                </div>
            </div>
        );
    }

    const hasImages = project.images && project.images.length > 0;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
            <Navbar />

            {/* ===================== HERO ===================== */}
            <section className="relative overflow-hidden bg-slate-950">
                {/* Background art */}
                <div className="absolute inset-0">
                    <img
                        src="/project-hero-bg.png"
                        alt=""
                        className="w-full h-full object-cover scale-110 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/55 to-slate-950" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/70 via-transparent to-fuchsia-950/10" />
                </div>

                <div className="relative z-10 pt-28 sm:pt-32 pb-32 sm:pb-40">
                    <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
                        {/* Breadcrumb */}
                        <div className="flex items-center justify-between mb-12 sm:mb-16 animate-[fadeIn_0.6s_ease-out]">
                            <button
                                onClick={() => router.back()}
                                className="inline-flex items-center gap-2 text-white/65 hover:text-white font-bold transition-all text-xs uppercase tracking-wider group"
                            >
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Back
                            </button>
                            <Link
                                href="/projects"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-white/65 hover:text-white uppercase tracking-wider transition-colors"
                            >
                                <LayoutGrid className="w-3.5 h-3.5" /> All Projects
                            </Link>
                        </div>

                        {/* Title & Logo block */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 animate-[fadeUp_0.7s_ease-out]">
                            <div className="max-w-3xl">
                                <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md text-emerald-300 text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full border border-white/15 mb-6">
                                    <Sparkles className="w-3 h-3" />
                                    Initiative Portfolio
                                </span>

                                <h1
                                    className="text-4xl sm:text-6xl font-black text-white leading-[1.05] tracking-tight mb-7 [text-shadow:0_2px_24px_rgba(0,0,0,0.35)]"
                                    style={{ fontFamily: '"Fraunces", "Georgia", serif' }}
                                >
                                    {project.name}
                                </h1>

                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 text-white text-xs font-bold px-3.5 py-2 rounded-full">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Active Initiative
                                    </span>
                                    <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 text-white text-xs font-bold px-3.5 py-2 rounded-full">
                                        <Heart className="w-3.5 h-3.5 text-rose-400" /> BSPNWS Welfare Council
                                    </span>
                                </div>
                            </div>

                            {/* Project Logo */}
                            {logoUrl && (
                                <div className="shrink-0 flex justify-center md:justify-end animate-[fadeIn_0.9s_ease-out_0.2s_both]">
                                    <div className="relative w-48 h-48 sm:w-60 sm:h-60 rounded-full bg-white shadow-[0_20px_50px_rgba(0,0,0,0.35)] flex items-center justify-center overflow-hidden hover:scale-105 transition-all duration-300 border-2 border-white/20">
                                        <img
                                            src={logoUrl}
                                            alt={`${project.name} Logo`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Wave divider echoing the artwork's motif */}
                <svg
                    className="absolute bottom-0 left-0 w-full h-12 sm:h-16 text-slate-50"
                    viewBox="0 0 1440 80"
                    preserveAspectRatio="none"
                    fill="currentColor"
                >
                    <path d="M0,48 C240,8 480,72 720,40 C960,8 1200,64 1440,32 L1440,80 L0,80 Z" />
                </svg>
            </section>

            {/* Main Content Layout */}
            <main className="container mx-auto px-4 sm:px-6 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* LEFT COLUMN: Media Gallery & Description */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Floating gallery card — overlaps the hero */}
                        <div className="bg-white rounded-[2rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(15,23,42,0.25)] border border-slate-100/80 p-5 sm:p-8 space-y-6 -mt-20 sm:-mt-28 relative z-20 animate-[fadeUp_0.7s_ease-out_0.1s_both]">

                            {/* Feature Image Banner */}
                            <div className="relative min-h-[260px] sm:min-h-[420px] rounded-2xl bg-slate-950 overflow-hidden flex items-center justify-center group shadow-inner border border-slate-100">
                                {activeImage ? (
                                    <>
                                        {/* Blurred backdrop image to fill frame dynamically */}
                                        <img
                                            src={activeImage}
                                            alt=""
                                            className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-25 select-none pointer-events-none"
                                        />
                                        {/* Sharp featured image */}
                                        <img
                                            src={activeImage}
                                            alt={project.name}
                                            className="relative z-10 max-h-[520px] w-auto h-auto max-w-full object-contain transition-transform duration-500 hover:scale-[1.01]"
                                        />
                                    </>
                                ) : (
                                    <div className="w-full h-full min-h-[260px] sm:min-h-[420px] flex flex-col items-center justify-center text-slate-500 bg-slate-950 relative z-10">
                                        <ImageIcon className="w-12 h-12 text-slate-700 mb-3 animate-pulse" />
                                        <span className="text-xs font-bold tracking-[0.2em] uppercase text-slate-400">BSPNWS Project Portfolio</span>
                                    </div>
                                )}
                            </div>

                            {/* Image Thumbnail Slider */}
                            {hasImages && project.images.length > 1 && (
                                <div className="flex flex-wrap gap-2.5 pt-2 border-t border-slate-50">
                                    {project.images.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setActiveImage(img)}
                                            className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${activeImage === img
                                                ? "border-emerald-600 ring-2 ring-emerald-500/20 scale-95 shadow-sm"
                                                : "border-slate-200/60 hover:border-slate-400"
                                                }`}
                                        >
                                            <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Project Content Block */}
                            <div className="space-y-4 pt-4">
                                <h3 className="text-slate-900 font-extrabold text-xs uppercase tracking-widest leading-none">About the Project</h3>
                                <div className="h-px bg-slate-100 w-full" />
                                <div className="text-slate-600 leading-relaxed text-sm sm:text-base whitespace-pre-wrap font-normal">
                                    {project.description}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Sidebar details */}
                    <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">

                        {/* Summary Info Card */}
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6 sm:p-8 space-y-6 animate-[fadeUp_0.7s_ease-out_0.2s_both]">
                            <h3 className="text-slate-900 font-extrabold text-xs uppercase tracking-widest border-b border-slate-100 pb-4">Project Overview</h3>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Status</div>
                                        <div className="text-sm font-extrabold text-slate-800">Active Initiative</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                                        <Heart className="w-4.5 h-4.5 text-rose-500" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Sponsor</div>
                                        <div className="text-sm font-extrabold text-slate-800">BSPNWS Welfare Council</div>
                                    </div>
                                </div>
                            </div>

                            {/* View PDF Doc */}
                            {project.pdf && (
                                <div className="pt-2">
                                    <button
                                        onClick={openPdf}
                                        className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-5 rounded-2xl text-xs uppercase tracking-widest transition-all duration-300 shadow-md shadow-emerald-600/20 hover:shadow-lg hover:-translate-y-0.5"
                                    >
                                        <FileText className="w-4 h-4" /> View PDF Report
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Interactive Volunteer/Support Banner */}
                        <div className="relative bg-slate-950 rounded-[2rem] p-8 text-white shadow-xl space-y-6 overflow-hidden animate-[fadeUp_0.7s_ease-out_0.3s_both]">
                            <div className="absolute inset-0">
                                <img src="/images/project-hero-bg.png" alt="" className="w-full h-full object-cover opacity-30 scale-125" />
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-950/85 to-emerald-950/70" />
                            </div>

                            <div className="relative z-10 space-y-6">
                                <span className="text-[9px] font-black tracking-widest text-emerald-300 uppercase bg-emerald-500/10 border border-emerald-400/20 px-2.5 py-1 rounded-full inline-block">
                                    Make an Impact
                                </span>

                                <div className="space-y-2">
                                    <h4 className="text-xl font-extrabold tracking-tight">Support Our Core Missions</h4>
                                    <p className="text-xs text-slate-300 leading-relaxed">
                                        Our initiatives run on volunteer participation and social contributions. Help us secure logistics or allocate distribution utilities.
                                    </p>
                                </div>

                                <Link
                                    href="/contact"
                                    className="w-full flex items-center justify-center gap-2 bg-white text-slate-900 font-bold py-3.5 px-5 rounded-2xl text-xs uppercase tracking-widest hover:bg-slate-100 transition-all duration-300 shadow-lg shadow-black/20"
                                >
                                    Get in Touch <ExternalLink className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Explore Other Initiatives (Project Gallery) */}
                <div className="mt-16 pt-12 border-t border-slate-200/80">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <h2 className="text-2xl font-black text-slate-900" style={{ fontFamily: '"Fraunces", "Georgia", serif' }}>
                            Explore Other Initiatives
                        </h2>
                        <Link
                            href="/gallery/image"
                            className="text-xs font-bold text-slate-500 hover:text-slate-950 transition-colors uppercase tracking-wider border-b border-slate-300 hover:border-slate-950 pb-0.5"
                        >
                            View all portfolio
                        </Link>
                    </div>

                    {galleryImages.length === 0 ? (
                        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
                            <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ImageIcon className="w-6 h-6 opacity-60" />
                            </div>
                            <h3 className="text-sm font-extrabold text-slate-800 mb-1">No Gallery Images Uploaded</h3>
                            <p className="text-xs font-medium text-slate-400">We will be updating this initiative with moments of impact soon!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {galleryImages.map((item, idx) => {
                                const accent = [
                                    { dot: "bg-violet-500", text: "text-violet-700", badge: "bg-violet-50 border-violet-100" },
                                    { dot: "bg-cyan-500", text: "text-cyan-700", badge: "bg-cyan-50 border-cyan-100" },
                                    { dot: "bg-rose-500", text: "text-rose-700", badge: "bg-rose-50 border-rose-100" },
                                ][idx % 3];

                                const coverImg = item.images?.[0] || '/bg-2.jpg';

                                return (
                                    <Link
                                        href={`/gallery/image/${item._id}`}
                                        key={item._id}
                                        style={{ animationDelay: `${idx * 80}ms` }}
                                        className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_16px_40px_rgba(15,23,42,0.1)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full group/card animate-[fadeUp_0.6s_ease-out_both]"
                                    >
                                        {/* Image zone */}
                                        <div className="relative h-44 bg-slate-50 overflow-hidden">
                                            <img
                                                src={coverImg}
                                                alt={item.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                                            {item.images?.length > 1 && (
                                                <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded backdrop-blur-sm">
                                                    {item.images.length} photos
                                                </div>
                                            )}
                                        </div>

                                        {/* Content zone */}
                                        <div className="p-6 flex flex-col flex-1">
                                            <span className={`inline-flex items-center gap-1.5 text-[8px] font-black uppercase tracking-wider border px-2 py-0.5 rounded-full mb-3 w-fit ${accent.badge} ${accent.text}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${accent.dot}`} />
                                                {item.type}
                                            </span>

                                            <h4
                                                className="font-extrabold text-slate-900 text-lg mb-2 line-clamp-1"
                                                style={{ fontFamily: '"Fraunces", serif' }}
                                            >
                                                {item.title}
                                            </h4>

                                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-6 flex-1">
                                                {item.description}
                                            </p>

                                            <span className="inline-flex items-center justify-between text-xs font-bold text-slate-900 group-hover/card:text-emerald-700 transition-colors mt-auto border-t border-slate-50 pt-4">
                                                <span>View Memories</span>
                                                <span className="group-hover/card:translate-x-1 transition-transform">&rarr;</span>
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>

            <style jsx>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @media (prefers-reduced-motion: reduce) {
                    * { animation: none !important; }
                }
            `}</style>
        </div>
    );
}