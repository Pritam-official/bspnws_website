"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, Loader2, Users, Sparkles } from 'lucide-react';

interface Volunteer {
    _id: string;
    fullName: string;
    profilePic?: string;
    approvedAt: string;
}

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

function VolunteerCard({ volunteer, index }: { volunteer: Volunteer; index: number }) {
    const { ref, visible } = useReveal();
    
    return (
        <div
            ref={ref}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
                transition: `all 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${index * 100}ms`,
            }}
            className="group relative bg-white rounded-[2rem] p-6 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 border border-gray-100 overflow-hidden"
        >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
                {/* Profile Image */}
                <div className="relative w-24 h-24 mb-6">
                    <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-[2rem] blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative w-full h-full rounded-[1.8rem] overflow-hidden border-4 border-white shadow-lg bg-gray-50 flex items-center justify-center">
                        {volunteer.profilePic ? (
                            <img 
                                src={volunteer.profilePic} 
                                alt={volunteer.fullName} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-2xl font-black">
                                {volunteer.fullName.charAt(0)}
                            </div>
                        )}
                    </div>
                    {/* Active Badge */}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
                </div>

                <h3 className="text-xl font-black text-gray-900 mb-1 tracking-tight uppercase italic group-hover:text-primary transition-colors">
                    {volunteer.fullName}
                </h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
                    Active Volunteer
                </p>

            </div>
        </div>
    );
}

export default function OurVolunteersPage() {
    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
    const [loading, setLoading] = useState(true);
    const { ref: heroRef, visible: heroVisible } = useReveal(0.05);

    useEffect(() => {
        const fetchVolunteers = async () => {
            try {
                const res = await fetch('/api/volunteers');
                const data = await res.json();
                setVolunteers(data);
            } catch (error) {
                console.error('Error fetching volunteers:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchVolunteers();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50/50 pt-32 pb-20 px-4 md:px-8 overflow-hidden">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-secondary/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Back Link */}
                <Link 
                    href="/" 
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors font-black uppercase tracking-widest text-[10px] mb-12 group"
                >
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                {/* Hero Section */}
                <div 
                    ref={heroRef}
                    className="mb-20 text-center max-w-4xl mx-auto"
                    style={{
                        opacity: heroVisible ? 1 : 0,
                        transform: heroVisible ? 'none' : 'translateY(20px)',
                        transition: 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                >
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-white rounded-2xl shadow-sm border border-gray-100 mb-8">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">Our Superstars</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black text-gray-900 tracking-tighter leading-[0.85] uppercase italic mb-8">
                        The Hearts <br />
                        <span className="text-primary">Behind BSPNWS</span>
                    </h1>
                    <p className="text-gray-500 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
                        Meet the dedicated individuals who volunteer their time and energy to create a lasting impact in our community. Without them, our mission wouldn't be possible.
                    </p>
                </div>

                {/* Content Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading our family...</span>
                    </div>
                ) : volunteers.length === 0 ? (
                    <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Users className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 uppercase italic mb-2">Expanding Our Team</h3>
                        <p className="text-gray-400 font-medium">We are currently onboarding new volunteers. Come back soon!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {volunteers.map((v, i) => (
                            <VolunteerCard key={v._id} volunteer={v} index={i} />
                        ))}
                    </div>
                )}

                {/* Call to Action */}
                <div className="mt-32 text-center bg-[#1a1a1a] rounded-[3rem] p-12 md:p-20 relative overflow-hidden group/cta">
                    {/* Animated background elements for CTA */}
                    <div className="absolute inset-0 z-0 opacity-20">
                        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at(100%_0%,#dd7030_0%,transparent_50%))]"></div>
                        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at(0%_100%,#6b21a8_0%,transparent_50%))]"></div>
                    </div>

                    <div className="relative z-10 space-y-8">
                        <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">
                            Ready to <br />
                            <span className="text-primary italic">Join Them?</span>
                        </h2>
                        <p className="text-white/60 text-lg font-medium max-w-xl mx-auto">
                            Your journey towards making a real difference begins here. Become a part of our volunteer family today.
                        </p>
                        <div className="pt-4">
                            <Link 
                                href="/volunteers/become" 
                                className="inline-flex items-center gap-4 bg-primary text-white px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/20"
                            >
                                <Sparkles className="w-5 h-5" />
                                Start Volunteering
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
