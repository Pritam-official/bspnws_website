"use client";

import React, { useState, useEffect } from 'react';

interface AnnualReport {
    _id: string;
    title: string;
    type: "Annual Reports" | "Audit Reports" | "IT Returns";
    file: string; // Google Drive Link
    date: string;
    createdAt: string;
}

const reportTypes = ['Annual Reports', 'Audit Reports', 'IT Returns'];

export default function AnnualReportsPage() {
    const [reports, setReports] = useState<AnnualReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ 
        title: '',
        type: 'Annual Reports' as "Annual Reports" | "Audit Reports" | "IT Returns",
        file: '', // Google Drive Link
        date: new Date().toLocaleDateString('en-GB')
    });

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const res = await fetch('/api/admin/annual-reports');
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.file) {
            alert('Please provide a title and a Google Drive link');
            return;
        }
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/admin/annual-reports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setFormData({ 
                    title: '', 
                    type: 'Annual Reports', 
                    file: '', 
                    date: new Date().toLocaleDateString('en-GB') 
                });
                fetchReports();
                alert('Report link added successfully!');
            } else {
                const error = await res.json();
                alert(`Error: ${error.error}`);
            }
        } catch (error) {
            console.error("Failed to add report:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this report?')) return;
        try {
            const res = await fetch(`/api/admin/annual-reports?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchReports();
                alert('Report deleted successfully!');
            } else {
                alert('Failed to delete report');
            }
        } catch (error) {
            console.error("Failed to delete report:", error);
        }
    };

    const getGradient = (type: string) => {
        switch (type) {
            case 'Annual Reports': return 'from-emerald-500 to-green-600';
            case 'Audit Reports': return 'from-blue-500 to-indigo-600';
            case 'IT Returns': return 'from-violet-500 to-purple-600';
            default: return 'from-gray-500 to-gray-600';
        }
    };

    return (
        <div>
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Annual Reports</h1>
                <p className="text-sm text-gray-400 font-bold mt-1">Manage official reports via Google Drive links</p>
            </div>

            {/* Add New Report Form */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center text-white">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    Add New Report Link
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Report Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="e.g. Annual Report 2025-26"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                            >
                                {reportTypes.map((type) => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Google Drive Link</label>
                            <input
                                type="url"
                                value={formData.file}
                                onChange={(e) => setFormData(prev => ({ ...prev, file: e.target.value }))}
                                placeholder="https://drive.google.com/file/d/..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-10 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl text-sm font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 flex items-center gap-3"
                        >
                            {isSubmitting ? 'Adding...' : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.826L11.414 10M11.414 10l1.293-1.293A4 4 0 0011.414 3H5.586A2 2 0 004 5v14a2 2 0 002 2h8a2 2 0 002-2v-3.586a2 2 0 01.586-1.414l2-2a2 2 0 012.828 0 2 2 0 010 2.828l-2 2" />
                                    </svg>
                                    Add Report Link
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Reports List */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center text-[#111827]">
                    <h2 className="text-sm font-black uppercase tracking-widest">Published Reports</h2>
                    {!loading && <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{reports.length} Total</span>}
                </div>
                <div className="divide-y divide-gray-50">
                    {loading ? (
                        <div className="p-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">Loading reports...</div>
                    ) : reports.length === 0 ? (
                        <div className="p-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">No reports added yet.</div>
                    ) : (
                        reports.map((report) => (
                            <div key={report._id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors">
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getGradient(report.type)} flex items-center justify-center text-white shadow-sm`}>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-gray-900 truncate">{report.title}</p>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[10px] font-bold text-gray-400">{report.date}</span>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                                report.type === 'Annual Reports' ? 'bg-emerald-50 text-emerald-600' :
                                                report.type === 'Audit Reports' ? 'bg-blue-50 text-blue-600' :
                                                'bg-violet-50 text-violet-600'
                                            }`}>
                                                {report.type}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <a 
                                        href={report.file} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="p-2.5 hover:bg-blue-50 rounded-lg transition-colors group" 
                                        title="View Document"
                                    >
                                        <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                    <button 
                                        onClick={() => handleDelete(report._id)}
                                        className="p-2.5 hover:bg-red-50 rounded-lg transition-colors group" 
                                        title="Delete"
                                    >
                                        <svg className="w-4 h-4 text-gray-400 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
