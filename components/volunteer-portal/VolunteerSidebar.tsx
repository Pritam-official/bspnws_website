"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
    {
        name: 'Home', href: '/volunteers/dashboard', icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
        )
    },
    {
        name: 'Attendance', href: '/volunteers/attendance', icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
        )
    },
    {
        name: 'Notice', href: '/volunteers/notice', icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
        )
    },
    {
        name: 'Membership', href: '/volunteers/membership', icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
        )
    },
    {
        name: 'Contact', href: '/volunteers/contact-admin', icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        )
    },
];

interface VolunteerSidebarProps {
    isMobileMenuOpen?: boolean;
    setIsMobileMenuOpen?: (isOpen: boolean) => void;
}

export default function VolunteerSidebar({ isMobileMenuOpen = false, setIsMobileMenuOpen }: VolunteerSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('volunteer_data');
        router.push('/login/volunteer');
    };

    return (
        <>
            {/* Mobile Drawer Overlay */}
            <div 
                className={`lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
                    isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsMobileMenuOpen?.(false)}
            />

            {/* Mobile Drawer */}
            <aside className={`lg:hidden fixed left-0 top-0 h-screen w-72 bg-white z-[70] transition-transform duration-500 ease-out shadow-2xl flex flex-col ${
                isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 relative overflow-hidden rounded-lg shadow-md">
                            <img src="/logo.jpg" alt="Logo" className="object-cover w-full h-full" />
                        </div>
                        <span className="text-sm font-black text-gray-900 tracking-tighter uppercase">Volunteer Portal</span>
                    </div>
                    <button 
                        onClick={() => setIsMobileMenuOpen?.(false)}
                        className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 hover:text-pink-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen?.(false)}
                                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${isActive
                                    ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/20'
                                    : 'text-gray-500 hover:bg-pink-50 hover:text-pink-600'
                                    }`}
                            >
                                <div className={`${isActive ? 'text-white' : 'group-hover:text-pink-600'} transition-colors`}>
                                    {item.icon}
                                </div>
                                <span className="font-bold text-sm tracking-tight">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 mt-auto border-t border-gray-50 space-y-4">
                    <div className="bg-gradient-to-br from-pink-50 to-white rounded-3xl p-5 border border-pink-100 shadow-sm">
                        <p className="text-[10px] font-black text-pink-600 uppercase tracking-widest mb-2">Verified Account</p>
                        <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
                            <span className="text-xs font-bold text-gray-700">Active Volunteer</span>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-2xl bg-gray-50 text-gray-400 hover:bg-rose-50 hover:text-rose-600 transition-all group active:scale-95 shadow-sm"
                    >
                        <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        <span className="font-black text-xs uppercase tracking-widest">Logout Session</span>
                    </button>
                </div>
            </aside>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-100 z-50 flex-col pt-24">
                <nav className="flex-1 px-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                                    ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/20'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-pink-600'
                                    }`}
                            >
                                <div className={`${isActive ? 'text-white' : 'group-hover:text-pink-600'} transition-colors`}>
                                    {item.icon}
                                </div>
                                <span className="font-bold text-sm tracking-tight">{item.name}</span>
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>
                                )}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-6 mt-auto border-t border-gray-50 space-y-4">
                    <div className="bg-pink-50 rounded-2xl p-4 border border-pink-100">
                        <p className="text-[10px] font-black text-pink-600 uppercase tracking-widest mb-1">Status</p>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs font-bold text-gray-700">Verified Volunteer</span>
                        </div>
                    </div>

                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-rose-50 hover:text-rose-600 transition-all group"
                    >
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-rose-100 transition-colors">
                            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        </div>
                        <span className="font-bold text-sm tracking-tight">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Bottom Tab Bar - Redesigned */}
            <div className="lg:hidden fixed bottom-6 left-4 right-4 z-[50]">
                <nav className="bg-white/80 backdrop-blur-2xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-[2.5rem] px-2 py-2">
                    <div className="flex items-center justify-around">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`relative flex flex-col items-center gap-1.5 px-3 py-3 rounded-[2rem] transition-all duration-300 flex-1 max-w-[80px] ${
                                        isActive ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30 -translate-y-1' : 'text-gray-400 hover:text-pink-600'
                                    }`}
                                >
                                    <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
                                        {item.icon}
                                    </div>
                                    {isActive && (
                                        <span className="text-[9px] font-black uppercase tracking-tighter leading-none animate-in fade-in slide-in-from-bottom-1">
                                            {item.name}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </nav>
            </div>
        </>
    );
}
