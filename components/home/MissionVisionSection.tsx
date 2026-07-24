import React, { useState } from 'react';
import Image from 'next/image';

const MissionVisionSection = () => {
    const [activeCard, setActiveCard] = useState<number | null>(null);
    return (
        <section className="relative py-16 sm:py-24 bg-gray-900 overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/mission-bg.jpg"
                    alt="Background"
                    fill
                    className="object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gray-900/40"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 drop-shadow-lg">
                        Our Mission and Vision
                    </h2>
                    <div className="w-24 h-1.5 bg-primary mx-auto rounded-full shadow-lg"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {/* Mission Card */}
                    <div 
                        onClick={() => setActiveCard(activeCard === 1 ? null : 1)}
                        className={`bg-white p-6 sm:p-10 rounded-3xl text-center group transition-all duration-300 shadow-xl cursor-pointer ${
                            activeCard === 1 ? '-translate-y-2' : 'hover:-translate-y-2'
                        }`}
                    >
                        <div className={`w-24 h-24 mx-auto mb-6 rounded-full bg-white border-4 border-green-500 flex items-center justify-center p-4 shadow-lg transition-transform duration-300 ${
                            activeCard === 1 ? 'scale-110' : 'group-hover:scale-110'
                        }`}>
                            <div className="w-full h-full bg-green-500 rounded-full flex items-center justify-center text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <circle cx="12" cy="12" r="6" />
                                    <circle cx="12" cy="12" r="2" fill="currentColor" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 22V12M22 12H12" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-wide mb-4 border-b-2 border-gray-100 pb-3 inline-block">Our Mission</h3>
                        <p className="text-gray-600 leading-relaxed font-medium">
                            To serve individuals and families in the poorest communities in the world - CARE
                        </p>
                    </div>

                    {/* Vision Card */}
                    <div 
                        onClick={() => setActiveCard(activeCard === 2 ? null : 2)}
                        className={`bg-white p-6 sm:p-10 rounded-3xl text-center group transition-all duration-300 shadow-xl cursor-pointer ${
                            activeCard === 2 ? '-translate-y-2' : 'hover:-translate-y-2'
                        }`}
                    >
                        <div className={`w-24 h-24 mx-auto mb-6 rounded-full bg-white border-4 border-amber-500 flex items-center justify-center p-4 shadow-lg transition-transform duration-300 ${
                            activeCard === 2 ? 'scale-110' : 'group-hover:scale-110'
                        }`}>
                            <div className="w-full h-full bg-amber-500 rounded-full flex items-center justify-center text-white relative">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-wide mb-4 border-b-2 border-gray-100 pb-3 inline-block">Our Vision</h3>
                        <p className="text-gray-600 leading-relaxed font-medium">
                            We seek a world of hope, inclusion, and social justice, where poverty has been overcome.
                        </p>
                    </div>

                    {/* Equality Card */}
                    <div 
                        onClick={() => setActiveCard(activeCard === 3 ? null : 3)}
                        className={`bg-white p-10 rounded-3xl text-center group transition-all duration-300 shadow-xl cursor-pointer ${
                            activeCard === 3 ? '-translate-y-2' : 'hover:-translate-y-2'
                        }`}
                    >
                        <div className={`w-24 h-24 mx-auto mb-6 rounded-full bg-white border-4 border-cyan-500 flex items-center justify-center p-4 shadow-lg transition-transform duration-300 ${
                            activeCard === 3 ? 'scale-110' : 'group-hover:scale-110'
                        }`}>
                            <div className="w-full h-full bg-cyan-500 rounded-full flex items-center justify-center text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-wide mb-4 border-b-2 border-gray-100 pb-3 inline-block">Equality</h3>
                        <p className="text-gray-600 leading-relaxed font-medium">
                            We believe in the equal value of every human being & the importance of respecting & honoring each individual.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MissionVisionSection;
