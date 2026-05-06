"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Project {
    _id: string;
    name: string;
    description: string;
    images: string[];
    pdf?: string;
}

// Each card gets its own distinct, attractive palette
const CARD_THEMES = [
    {
        bg: '#FFF7ED',
        border: '#FDBA74',
        tag: '#EA580C',
        tagBg: '#FED7AA',
        btn: '#EA580C',
        btnHover: '#C2410C',
        dot: '#FB923C',
        label: 'Livelihood',
        number: '#FDBA74',
    },
    {
        bg: '#F0FDF4',
        border: '#6EE7B7',
        tag: '#059669',
        tagBg: '#A7F3D0',
        btn: '#059669',
        btnHover: '#047857',
        dot: '#34D399',
        label: 'Healthcare',
        number: '#6EE7B7',
    },
    {
        bg: '#EFF6FF',
        border: '#93C5FD',
        tag: '#2563EB',
        tagBg: '#BFDBFE',
        btn: '#2563EB',
        btnHover: '#1D4ED8',
        dot: '#60A5FA',
        label: 'Education',
        number: '#93C5FD',
    },
    {
        bg: '#FDF4FF',
        border: '#E879F9',
        tag: '#A21CAF',
        tagBg: '#F5D0FE',
        btn: '#A21CAF',
        btnHover: '#86198F',
        dot: '#D946EF',
        label: 'Women Empowerment',
        number: '#E879F9',
    },
    {
        bg: '#FFFBEB',
        border: '#FCD34D',
        tag: '#B45309',
        tagBg: '#FDE68A',
        btn: '#B45309',
        btnHover: '#92400E',
        dot: '#FBBF24',
        label: 'Youth',
        number: '#FCD34D',
    },
    {
        bg: '#F0FDFA',
        border: '#5EEAD4',
        tag: '#0F766E',
        tagBg: '#99F6E4',
        btn: '#0F766E',
        btnHover: '#0D6461',
        dot: '#2DD4BF',
        label: 'Environment',
        number: '#5EEAD4',
    },
];

function useReveal(threshold = 0.1) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setVisible(true); },
            { threshold }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [threshold]);
    return { ref, visible };
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
    const { ref, visible } = useReveal();
    const theme = CARD_THEMES[index % CARD_THEMES.length];
    const [btnHovered, setBtnHovered] = useState(false);

    const openPdf = () => {
        if (!project.pdf) return;
        if (project.pdf.includes('drive.google.com')) {
            const match = project.pdf.match(/\/d\/([a-zA-Z0-9_-]+)/);
            if (match) { window.open(`https://drive.google.com/file/d/${match[1]}/preview`, '_blank'); return; }
        }
        try {
            const b64 = project.pdf.split(',')[1];
            if (!b64) throw new Error();
            const bytes = new Uint8Array(atob(b64).split('').map(c => c.charCodeAt(0)));
            window.open(URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' })), '_blank');
        } catch { window.open(project.pdf, '_blank'); }
    };

    return (
        <div
            ref={ref}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.97)',
                transition: `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${index * 110}ms, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${index * 110}ms`,
                background: theme.bg,
                border: `2px solid ${theme.border}`,
            }}
            className="group rounded-3xl overflow-hidden flex flex-col hover:-translate-y-2 hover:shadow-2xl transition-all duration-500"
        >
            {/* ── IMAGE ZONE ── */}
            <div className="relative h-52 overflow-hidden m-4 rounded-2xl">
                {project.images?.[0] ? (
                    <Image
                        src={project.images[0]}
                        alt={project.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-108"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ background: theme.tagBg }}>
                        <svg className="w-10 h-10 opacity-30" style={{ color: theme.btn }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-2xl" />

                {/* Tag pill */}
                <div className="absolute top-3 left-3">
                    <span
                        className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full shadow-md"
                        style={{ background: theme.tagBg, color: theme.tag }}
                    >
                        <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: theme.dot }} />
                        {theme.label}
                    </span>
                </div>

                {/* Index badge */}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shadow-md bg-white/80 backdrop-blur-sm" style={{ color: theme.btn }}>
                    {String(index + 1).padStart(2, '0')}
                </div>

                {/* Thumbnail strip at bottom of image */}
                {project.images.length > 1 && (
                    <div className="absolute bottom-3 left-3 flex gap-1.5">
                        {project.images.slice(1, 4).map((img, i) => (
                            <div key={i} className="relative w-9 h-9 rounded-xl overflow-hidden border-2 border-white shadow-lg">
                                <Image src={img} alt="" fill className="object-cover" />
                            </div>
                        ))}
                        {project.images.length > 4 && (
                            <div className="w-9 h-9 rounded-xl border-2 border-white bg-black/50 backdrop-blur-sm flex items-center justify-center text-[9px] font-black text-white shadow-lg">
                                +{project.images.length - 4}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ── CONTENT ZONE ── */}
            <div className="px-6 pb-6 flex flex-col flex-1">

                {/* Divider with dot */}Livelihood
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-px flex-1" style={{ background: theme.border }} />
                    <div className="w-2 h-2 rounded-full" style={{ background: theme.dot }} />
                    <div className="h-px flex-1" style={{ background: theme.border }} />
                </div>

                <h3
                    className="text-[1.15rem] font-black text-slate-900 leading-snug mb-3 tracking-tight"
                    style={{ fontFamily: "'Fraunces', 'Georgia', serif" }}
                >
                    {project.name}
                </h3>

                <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 mb-6 flex-1">
                    {project.description}
                </p>

                {/* CTA Button */}
                {project.pdf ? (
                    <button
                        onMouseEnter={() => setBtnHovered(true)}
                        onMouseLeave={() => setBtnHovered(false)}
                        onClick={openPdf}
                        style={{
                            background: btnHovered ? theme.btn : 'white',
                            color: btnHovered ? 'white' : theme.btn,
                            border: `2px solid ${theme.btn}`,
                        }}
                        className="w-full flex items-center justify-between px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-300 shadow-sm hover:shadow-lg"
                    >
                        <span>View PDF Report</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                    </button>
                ) : (
                    <Link
                        href={`/projects/${project._id}`}
                        style={{
                            border: `2px solid ${theme.btn}`,
                            color: theme.btn,
                        }}
                        className="w-full flex items-center justify-between px-5 py-3 rounded-2xl text-sm font-bold bg-white hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg group/btn"
                        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = theme.btn; (e.currentTarget as HTMLAnchorElement).style.color = 'white'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'white'; (e.currentTarget as HTMLAnchorElement).style.color = theme.btn; }}
                    >
                        <span>Explore Project</span>
                        <svg className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                )}
            </div>
        </div>
    );
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const { ref: heroRef, visible: heroVisible } = useReveal(0.05);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch('/api/admin/projects');
                const data = await res.json();
                if (Array.isArray(data)) setProjects(data);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        fetchProjects();
    }, []);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,700;1,900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
                body { font-family: 'Plus Jakarta Sans', sans-serif; }
                .scale-108 { transform: scale(1.08); }
            `}</style>

            <div className="min-h-screen" style={{ background: '#F1F5F9' }}>

                {/* ── HERO ── */}
                <div className="bg-white border-b border-slate-100" style={{ boxShadow: '0 2px 20px rgba(0,0,0,0.04)' }}>
                    <div className="max-w-7xl mx-auto px-6 pt-28 pb-20">
                        <div
                            ref={heroRef}
                            style={{
                                opacity: heroVisible ? 1 : 0,
                                transform: heroVisible ? 'none' : 'translateY(30px)',
                                transition: 'opacity 0.9s ease, transform 0.9s ease',
                            }}
                        >
                            <span className="inline-flex items-center gap-2 bg-slate-900 text-white text-[10px] font-black tracking-widest uppercase px-4 py-2 rounded-full mb-8">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                                Our Impact Portfolio
                            </span>

                            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-14 items-end">
                                <h1
                                    className="text-[clamp(2.6rem,6vw,5.5rem)] font-black text-slate-900 leading-[0.92] tracking-tight"
                                    style={{ fontFamily: "'Fraunces', serif" }}
                                >
                                    Projects That<br />
                                    <em className="not-italic" style={{
                                        background: 'linear-gradient(135deg, #059669 0%, #0EA5E9 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                    }}>Change Lives.</em>
                                </h1>

                                <div>
                                    <p className="text-slate-500 text-base leading-relaxed mb-8">
                                        Explore our diverse range of social welfare initiatives dedicated to building a healthier, more equitable community for all.
                                    </p>
                                    {!loading && projects.length > 0 && (
                                        <div className="flex items-stretch gap-0 rounded-2xl overflow-hidden border border-slate-100 w-fit shadow-sm">
                                            {[
                                                { val: projects.length, label: 'Projects' },
                                                { val: '100%', label: 'Active' },
                                                { val: '∞', label: 'Impact' },
                                            ].map((stat, i) => (
                                                <div key={i} className={`px-6 py-4 text-center ${i < 2 ? 'border-r border-slate-100' : ''} bg-white`}>
                                                    <div className="text-2xl font-black text-slate-900">{stat.val}</div>
                                                    <div className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">{stat.label}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── GRID ── */}
                <div className="max-w-7xl mx-auto px-6 py-16">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-48 gap-5">
                            <div className="relative w-10 h-10">
                                <div className="absolute inset-0 rounded-full border-2 border-slate-200" />
                                <div className="absolute inset-0 rounded-full border-2 border-t-emerald-500 animate-spin" />
                            </div>
                            <span className="text-slate-400 text-xs font-bold tracking-widest uppercase">Loading projects…</span>
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-40 text-center max-w-sm mx-auto gap-4">
                            <div className="w-16 h-16 bg-white rounded-2xl border border-slate-100 flex items-center justify-center shadow-sm">
                                <svg className="w-7 h-7 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-700" style={{ fontFamily: "'Fraunces', serif" }}>Portfolio Expanding</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">We are currently documenting our latest impact stories. Please check back soon.</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center gap-6 mb-10">
                                <span className="text-xs font-black tracking-[0.3em] text-slate-400 uppercase whitespace-nowrap">
                                    {projects.length} {projects.length === 1 ? 'Project' : 'Projects'}
                                </span>
                                <div className="h-px flex-1 bg-slate-200" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                                {projects.map((project, index) => (
                                    <ProjectCard key={project._id} project={project} index={index} />
                                ))}
                            </div>
                        </>
                    )}

                    {/* Footer row */}
                    <div className="mt-24 pt-8 border-t border-slate-200 flex items-center justify-between">
                        <Link
                            href="/"
                            className="group inline-flex items-center gap-3 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
                        >
                            <div className="w-9 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow group-hover:border-slate-400 transition-all">
                                <svg className="w-4 h-4 rotate-180 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </div>
                            Back to Home
                        </Link>
                        <p className="text-[11px] text-slate-300 font-bold tracking-widest uppercase hidden sm:block">
                            © {new Date().getFullYear()} · All Rights Reserved
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}