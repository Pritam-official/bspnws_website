"use client";

import React, { useState, useEffect } from "react";

interface BoardMember {
    _id: string;
    name: string;
    designation: string;
    joiningDate?: string;
    image?: string;
}

export default function BoardMembers() {
    const [members, setMembers] = useState<BoardMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeMemberId, setActiveMemberId] = useState<string | null>(null);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const res = await fetch("/api/admin/board-members");
                const data = await res.json();
                if (Array.isArray(data)) {
                    // Filter only members that have images
                    const membersWithImages = data.filter((member) => member.image);
                    setMembers(membersWithImages);
                }
            } catch (error) {
                console.error("Failed to fetch board members:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMembers();
    }, []);

    if (loading) return null;
    if (members.length === 0) return null;

    return (
        <section className="py-24 bg-gradient-to-b from-white to-gray-50/50 border-b border-gray-100 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-secondary/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-20">
                    <span className="text-xs font-bold tracking-[0.25em] uppercase text-primary/80 mb-3 block">
                        Our Leadership
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight tracking-tight">
                        Board Members
                    </h2>
                    <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-secondary mt-5 rounded-full mx-auto"></div>
                </div>

                {/* Professional Grid Layout: 6 columns on desktop, 3 on tablet, 2 on mobile */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-12 gap-x-6 md:gap-y-16 md:gap-x-10 lg:gap-x-6 xl:gap-x-8 max-w-7xl mx-auto justify-items-center">
                    {members.map((member) => {
                        const isActive = activeMemberId === member._id;
                        return (
                            <div
                                key={member._id}
                                className="flex flex-col items-center group relative text-center w-full"
                            >
                                {/* Double-Ring Avatar Container */}
                                <div
                                    onClick={() => setActiveMemberId(prev => prev === member._id ? null : member._id)}
                                    className={`relative rounded-full p-[3px] transition-all duration-500 cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-1 ${
                                        isActive 
                                            ? "bg-gradient-to-tr from-primary to-secondary scale-105 shadow-primary/20" 
                                            : "bg-gray-100 hover:bg-gradient-to-tr hover:from-primary hover:to-secondary"
                                    }`}
                                >
                                    {/* White space gap ring */}
                                    <div className="bg-white p-1 rounded-full">
                                        {/* Main Circular Profile Image wrapper */}
                                        <div className="w-28 h-28 sm:w-36 sm:h-36 lg:w-32 lg:h-32 xl:w-36 xl:h-36 rounded-full overflow-hidden relative shadow-inner">
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                loading="lazy"
                                            />
                                            
                                            {/* Premium Dark Glassmorphic Overlay with wrapping text */}
                                            <div 
                                                className={`absolute inset-0 bg-black/80 backdrop-blur-[2px] transition-all duration-300 flex flex-col items-center justify-center text-center p-3 rounded-full ${
                                                    isActive 
                                                        ? "opacity-100 scale-100" 
                                                        : "opacity-0 scale-95 md:group-hover:opacity-100 md:group-hover:scale-100"
                                                }`}
                                            >
                                                <p className="text-white text-[11px] sm:text-xs md:text-sm font-extrabold leading-snug tracking-tight px-1 break-words w-full">
                                                    {member.name}
                                                </p>
                                                <p className="text-primary text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-wider mt-1 px-1 break-words w-full">
                                                    {member.designation}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
