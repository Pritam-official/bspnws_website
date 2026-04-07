"use client";

import React from 'react';
import Image from 'next/image';

const memories = [
    { id: 1, title: 'Medical Camp 2026', type: 'Events', img: '/picnic.jpg', gradient: 'from-emerald-500 to-green-600', date: '28/03/2026' },
    { id: 2, title: 'Child Nutrition Program', type: 'Donations', img: '/Annaprashan_Invitation.webp', gradient: 'from-amber-500 to-orange-600', date: '15/02/2026' },
    { id: 3, title: 'Tree Plantation Drive', type: 'Events', img: '/swasta bikash.jpg', gradient: 'from-blue-500 to-indigo-600', date: '10/02/2026' },
    { id: 4, title: 'Success Story - Community Support', type: 'Success Stories', img: '/logo.jpg', gradient: 'from-pink-500 to-rose-600', date: '01/02/2026' },
    { id: 5, title: 'Annual Day Celebration', type: 'Events', img: '/bg-2.jpg', gradient: 'from-violet-500 to-purple-600', date: '15/01/2026' },
    { id: 6, title: 'Food Distribution', type: 'Donations', img: '/bg-3.jpg', gradient: 'from-cyan-500 to-teal-600', date: '05/01/2026' },
    { id: 7, title: 'Volunteer Training Session', type: 'Events', img: '/bg-1.jpg', gradient: 'from-orange-500 to-red-600', date: '20/12/2025' },
    { id: 8, title: 'Senior Citizen Support', type: 'Guests', img: '/baristha.jpg', gradient: 'from-indigo-500 to-blue-600', date: '12/12/2025' },
];

const OurMemories = () => {
    return (
        <section className="py-24 bg-gray-50/50">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
                {/* Section Header */}
                <div className="mb-12 text-center md:text-left">
                    <div className="text-sm font-black text-primary tracking-[0.2em] uppercase mb-3">Our Moments</div>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Our Memories</h2>
                    <p className="text-gray-500 font-bold mt-4 max-w-2xl">A glimpse into the impact we've made and the lives we've touched together.</p>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {memories.map((memory) => (
                        <div 
                            key={memory.id} 
                            className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 cursor-pointer"
                        >
                            {/* Image Container */}
                            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                                <div className={`absolute inset-0 bg-gradient-to-br ${memory.gradient} opacity-20 group-hover:opacity-40 transition-opacity duration-500 z-10`}></div>
                                <Image
                                    src={memory.img}
                                    alt={memory.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                />
                                {/* Type Tag Overlay */}
                                <div className="absolute top-4 left-4 z-20">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-lg ${
                                        memory.type === 'Events' ? 'bg-emerald-500' :
                                        memory.type === 'Donations' ? 'bg-amber-500' :
                                        memory.type === 'Success Stories' ? 'bg-pink-500' :
                                        'bg-blue-500'
                                    }`}>
                                        {memory.type}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <h3 className="text-lg font-black text-gray-900 mb-2 leading-tight group-hover:text-primary transition-colors">
                                    {memory.title}
                                </h3>
                                <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                    <span>{memory.date}</span>
                                    <span className="flex items-center gap-1 text-primary">
                                        View Details
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Call to Action */}
                <div className="mt-16 text-center">
                    <button className="px-8 py-4 bg-white border-2 border-gray-100 text-gray-900 rounded-xl font-black uppercase tracking-widest hover:border-primary hover:text-primary hover:-translate-y-1 transition-all duration-300 shadow-sm">
                        View Full Gallery
                    </button>
                </div>
            </div>
        </section>
    );
};

export default OurMemories;
