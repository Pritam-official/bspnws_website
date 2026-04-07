"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import AdminSidebar from '@/components/AdminSidebar';
import Footer from '@/components/Footer';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [adminData, setAdminData] = useState<any>(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const data = localStorage.getItem('admin_data');
        if (!data) {
            router.push('/login/admin');
            return;
        }
        setAdminData(JSON.parse(data));
        setLoaded(true);
    }, [router]);

    // Listen for localStorage changes and custom profile update events
    useEffect(() => {
        const handleUpdate = () => {
            const data = localStorage.getItem('admin_data');
            if (data) setAdminData(JSON.parse(data));
        };
        window.addEventListener('storage', handleUpdate);
        window.addEventListener('adminDataUpdated', handleUpdate);
        return () => {
            window.removeEventListener('storage', handleUpdate);
            window.removeEventListener('adminDataUpdated', handleUpdate);
        };
    }, []);

    if (!loaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Admin Panel...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col">
            <AdminSidebar />

            {/* Top Header Bar */}
            <header className="fixed top-0 left-0 lg:left-[260px] right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-gray-100 z-40 flex items-center justify-between px-6 lg:px-8">
                <div>
                    <h1 className="text-sm font-black text-gray-900 uppercase tracking-widest">Admin Panel</h1>
                </div>
                <div className="flex items-center gap-4">
                    {/* Notification Bell */}
                    <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <span className="absolute top-1 right-1 w-2 h-2 bg-pink-600 rounded-full"></span>
                    </button>

                    {/* Admin Avatar — Clickable, links to Edit Profile */}
                    <Link href="/admin/edit-profile" className="flex items-center gap-3 pl-4 border-l border-gray-100 hover:opacity-80 transition-opacity cursor-pointer group">
                        {adminData?.profileImage ? (
                            <div className="w-9 h-9 rounded-xl overflow-hidden shadow-lg group-hover:ring-2 group-hover:ring-pink-500/40 transition-all">
                                <Image src={adminData.profileImage} alt="Profile" width={36} height={36} className="object-cover w-full h-full" />
                            </div>
                        ) : (
                            <div className="w-9 h-9 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-lg group-hover:ring-2 group-hover:ring-pink-500/40 transition-all">
                                {adminData?.firstName?.charAt(0) || 'A'}{adminData?.lastName?.charAt(0) || 'D'}
                            </div>
                        )}
                        <div className="hidden sm:block">
                            <p className="text-xs font-black text-gray-900">{adminData?.name || 'Admin'}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Administrator</p>
                        </div>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="lg:ml-[260px] pt-16 flex-grow">
                <div className="p-6 lg:p-8">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <div className="lg:ml-[260px]">
                <Footer />
            </div>
        </div>
    );
}
