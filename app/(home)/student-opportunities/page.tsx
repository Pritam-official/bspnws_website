"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import { GraduationCap, Briefcase, ArrowRight, Sparkles } from "lucide-react";

export default function StudentOpportunitiesPage() {
    const router = useRouter();

    const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        if (val === "scholarship") {
            router.push("/scholarship-apply");
        } else if (val === "internship") {
            router.push("/internship-apply");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Navbar />

            {/* Main Content Container */}
            <div className="pt-24 pb-20 flex-grow container mx-auto px-4 max-w-6xl">
                
                {/* Top Section */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest rounded-full animate-fade-in-up">
                        <Sparkles className="w-3.5 h-3.5" />
                        Empowering the Future
                    </div>
                    
                    <h1 className="text-3xl sm:text-5xl font-black text-gray-950 tracking-tight leading-none animate-fade-in-up delay-100">
                        Student Opportunities
                    </h1>
                    
                    <p className="text-gray-500 font-semibold text-sm sm:text-base leading-relaxed max-w-2xl mx-auto animate-fade-in-up delay-200">
                        Discover the programs we run to support students and young professionals. Apply today to receive financial support or gain valuable practical experience with our social welfare society.
                    </p>

                    {/* Program Selector Dropdown */}
                    <div className="pt-4 max-w-md mx-auto animate-fade-in-up delay-300">
                        <label className="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">
                            Quick Program Selector
                        </label>
                        <div className="relative">
                            <select
                                onChange={handleDropdownChange}
                                defaultValue=""
                                className="w-full pl-5 pr-10 py-4 bg-white border-2 border-slate-200 rounded-2xl text-sm font-bold text-gray-800 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all appearance-none cursor-pointer shadow-sm"
                            >
                                <option value="" disabled>Choose a portal to apply...</option>
                                <option value="scholarship">Education Scholarship Program</option>
                                <option value="internship">Professional Internship Program</option>
                            </select>
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid layout for Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    
                    {/* Card 1: Scholarship Apply */}
                    <div className="group bg-white rounded-3xl p-8 border border-slate-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                        <div>
                            {/* Icon */}
                            <div className="w-14 h-14 bg-orange-50 text-primary border border-orange-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <GraduationCap className="w-7 h-7" />
                            </div>
                            
                            <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-3 tracking-tight group-hover:text-primary transition-colors">
                                Educational Scholarship
                            </h2>
                            
                            <p className="text-gray-500 font-semibold text-sm leading-relaxed mb-6">
                                Designed to support underprivileged students in pursuing secondary and higher education. Our program provides critical financial grants to cover educational costs.
                            </p>
                        </div>
                        
                        <button
                            onClick={() => router.push("/scholarship-apply")}
                            className="w-full py-4 px-6 bg-slate-900 hover:bg-primary text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer group-hover:shadow-lg"
                        >
                            Apply for Scholarship
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>

                    {/* Card 2: Internship Apply */}
                    <div className="group bg-white rounded-3xl p-8 border border-slate-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                        <div>
                            {/* Icon */}
                            <div className="w-14 h-14 bg-purple-50 text-secondary border border-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Briefcase className="w-7 h-7" />
                            </div>
                            
                            <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-3 tracking-tight group-hover:text-secondary transition-colors">
                                Professional Internship
                            </h2>
                            
                            <p className="text-gray-500 font-semibold text-sm leading-relaxed mb-6">
                                Join our core team to gain valuable practical experience while contributing directly to meaningful social impact initiatives, nutrition distribution, and community welfare.
                            </p>
                        </div>
                        
                        <button
                            onClick={() => router.push("/internship-apply")}
                            className="w-full py-4 px-6 bg-slate-900 hover:bg-secondary text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer group-hover:shadow-lg"
                        >
                            Apply for Internship
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
