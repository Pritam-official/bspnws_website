import React from 'react';
import Image from 'next/image';

const MissionVisionSection = () => {
    return (
        <section className="relative py-24 bg-gray-900 overflow-hidden">
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

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-4 drop-shadow-lg">
                        Our Mission and Vision
                    </h2>
                    <div className="w-24 h-1.5 bg-primary mx-auto rounded-full shadow-lg"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {/* Mission Card */}
                    <div className="bg-white p-10 rounded-3xl text-center group hover:-translate-y-2 transition-transform duration-300 shadow-xl">
                        <div className="relative w-24 h-24 mx-auto mb-6 rounded-full bg-white border-4 border-green-500 flex items-center justify-center p-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <div className="w-full h-full bg-green-500 rounded-full flex items-center justify-center text-white relative">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                                </svg>
                                {/* Replacing with a more target-like icon for Mission */}
                                <div className="absolute inset-0 flex items-center justify-center bg-green-500 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 bg-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-8a2 2 0 012-2h14a2 2 0 012 2v8M3 21h18M5 11l7-7 7 7M12 4v7" />
                                        {/* Actual Target Icon */}
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                                        <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
                                        <circle cx="12" cy="12" r="2" fill="currentColor" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 22V12M22 12H12" /> {/* Arrow part roughly */}
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-wide mb-4 border-b-2 border-gray-100 pb-3 inline-block">Our Mission</h3>
                        <p className="text-gray-600 leading-relaxed font-medium">
                            To serve individuals and families in the poorest communities in the world - CARE
                        </p>
                    </div>

                    {/* Vision Card */}
                    <div className="bg-white p-10 rounded-3xl text-center group hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white border-4 border-amber-500 flex items-center justify-center p-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
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
                    <div className="bg-white p-10 rounded-3xl text-center group hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white border-4 border-cyan-500 flex items-center justify-center p-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
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
