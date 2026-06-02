"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Calendar, FileText, Search, Eye, AlertCircle, Sparkles, Download, Image as ImageIcon, Link } from 'lucide-react';
import VolunteerSidebar from '@/components/volunteer-portal/VolunteerSidebar';
import VolunteerHeader from '@/components/volunteer-portal/VolunteerHeader';

export default function StaffNoticePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<any>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Notices list & search
    const [notices, setNotices] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const storedData = localStorage.getItem('volunteer_data');
        if (storedData) {
            const parsed = JSON.parse(storedData);
            if (parsed.role !== 'staff') {
                router.push('/volunteers/dashboard');
                return;
            }
            setUserData(parsed);
            fetchStaffNotices();
        } else {
            router.push('/login/volunteer');
            return;
        }
        setLoading(false);
    }, []);

    const fetchStaffNotices = async () => {
        try {
            const res = await fetch('/api/staff/notice');
            const data = await res.json();
            if (Array.isArray(data)) {
                setNotices(data);
            }
        } catch (error) {
            console.error('Failed to fetch staff notices:', error);
        }
    };

    const getGradient = (type: string) => {
        if (type === 'PDF') return 'from-pink-500 to-rose-600';
        if (type === 'Image') return 'from-purple-500 to-indigo-600';
        return 'from-gray-400 to-gray-500';
    };

    const filtered = notices.filter(n =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (n.message && n.message.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading || !userData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative bg-gray-50 flex overflow-hidden">
            {/* Sidebar */}
            <VolunteerSidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

            {/* Main Content Area */}
            <div className="flex-1 lg:ml-64 relative pb-20 overflow-y-auto">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-pink-600/5 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                {/* Header */}
                <VolunteerHeader userData={userData} setIsMobileMenuOpen={setIsMobileMenuOpen} title="Staff Notices" />

                <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 space-y-10 animate-fade-in pb-24 lg:pb-8">
                    {/* Welcome Title */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-none mb-2 uppercase">
                                Staff <span className="text-pink-600">Notices</span>
                            </h1>
                            <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px]">
                                Bulletins, Announcements and Notices
                            </p>
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search notices..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2.5 bg-white border border-gray-150 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all w-full sm:w-72 shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Notice Board Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filtered.map((notice) => (
                            <div 
                                key={notice._id} 
                                className="bg-white/80 backdrop-blur-xl border border-white/60 p-6 sm:p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/30 hover:border-pink-200 hover:shadow-2xl hover:shadow-pink-600/5 transition-all duration-350 flex flex-col justify-between group"
                            >
                                <div className="space-y-4">
                                    {/* Date & Badge */}
                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 border border-gray-100 px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-pink-500" />
                                            {notice.date}
                                        </span>
                                        {notice.targetAudience === 'staff' ? (
                                            <span className="px-3 py-1 rounded-full bg-pink-50 text-pink-600 text-[8px] font-black uppercase tracking-widest border border-pink-100 animate-pulse">
                                                Staff Exclusive
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[8px] font-black uppercase tracking-widest border border-blue-100">
                                                General Info
                                            </span>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-black text-gray-900 tracking-tight leading-tight group-hover:text-pink-600 transition-colors">
                                        {notice.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-sm text-gray-600 font-medium leading-relaxed mt-2 whitespace-pre-line">
                                        {notice.message || "Please read the details below or consult any attached files."}
                                    </p>
                                </div>

                                {/* Attachment and Actions */}
                                {notice.file && notice.fileType !== 'None' ? (
                                    <div className="mt-6 pt-5 border-t border-gray-50 flex items-center justify-between flex-wrap gap-3">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getGradient(notice.fileType)} flex items-center justify-center text-white`}>
                                                {notice.fileType === 'PDF' ? <FileText className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                                            </div>
                                            <div>
                                                <span className={`text-[9px] font-black uppercase tracking-wider block leading-none ${
                                                    notice.fileType === 'PDF' ? 'text-red-500' : 'text-blue-500'
                                                }`}>
                                                    {notice.fileType} Document
                                                </span>
                                                <span className="text-[10px] font-bold text-gray-400">Attachment Ready</span>
                                            </div>
                                        </div>
                                        <a
                                            href={notice.file}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="py-2.5 px-4 bg-gray-50 hover:bg-pink-50 text-gray-500 hover:text-pink-600 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all border border-gray-100 flex items-center gap-1.5"
                                        >
                                            <Eye className="w-3.5 h-3.5" />
                                            Open Attachment
                                        </a>
                                    </div>
                                ) : (
                                    <div className="mt-6 pt-4 border-t border-gray-50/50">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-300 block">No Attachment Attached</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {filtered.length === 0 && (
                        <div className="text-center py-24 bg-white/60 border border-dashed border-gray-200 rounded-[2.5rem] backdrop-blur-sm">
                            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4 animate-bounce" />
                            <h3 className="text-lg font-black text-gray-900 mb-1">No Active Notices</h3>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">There are no notices published for you at the moment.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
