"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/home/Footer';

interface AnnualReport {
    _id: string;
    title: string;
    type: "Annual Reports" | "Audit Reports" | "IT Returns";
    file: string;
    date: string;
    createdAt: string;
}

const reportTypes = ['Annual Reports', 'Audit Reports', 'IT Returns'];

export default function AnnualReportsPage() {
    const [reports, setReports] = useState<AnnualReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<string>('Annual Reports');

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const res = await fetch('/api/annual-reports');
            const data = await res.json();
            if (Array.isArray(data)) {
                setReports(data);
            }
        } catch (error) {
            console.error("Failed to fetch reports:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredReports = reports.filter(r => r.type === activeTab);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            
            <main className="flex-grow pt-24 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight mb-4">
                            Annual <span className="text-primary">Reports</span>
                        </h1>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
                            Transparency and financial accountability documents
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="flex flex-wrap justify-center gap-2 mb-12 bg-white p-2 rounded-[2rem] border border-gray-100 w-fit mx-auto shadow-lg shadow-gray-200/50">
                        {reportTypes.map((type) => (
                            <button
                                key={type}
                                onClick={() => setActiveTab(type)}
                                className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                                    activeTab === type 
                                    ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105' 
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white rounded-3xl border border-gray-100 p-8 h-64 animate-pulse"></div>
                            ))}
                        </div>
                    ) : filteredReports.length === 0 ? (
                        <div className="bg-white rounded-[3rem] p-20 text-center border border-gray-100 shadow-xl shadow-gray-200/50 max-w-3xl mx-auto">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">No {activeTab} Found</h3>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">We haven't uploaded any {activeTab.toLowerCase()} yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredReports.map((report) => (
                                <div key={report._id} className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-xl shadow-gray-200/30 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 transition-all group flex flex-col h-full">
                                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>

                                    <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-primary transition-colors leading-tight">
                                        {report.title}
                                    </h3>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Published on {report.date}</p>

                                    <div className="mt-auto">
                                        <a 
                                            href={report.file} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-primary transition-all shadow-lg hover:shadow-primary/20"
                                        >
                                            View Document
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
