"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
    {
        name: 'Dashboard',
        href: '/admin/dashboard',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
    },
    {
        name: 'Volunteers',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        ),
        subItems: [
            { name: 'All Volunteers', href: '/admin/volunteers' },
            { name: 'Volunteer Requests', href: '/admin/volunteers/requests' },
        ],
    },
    {
        name: 'Staff Management',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        ),
        subItems: [
            { name: 'Staff Attendance', href: '/admin/staff/attendance' },
            { name: 'Leave Requests', href: '/admin/staff/leave' },
            { name: 'Payslip Management', href: '/admin/staff/payslip' },
            { name: 'Staff Notices', href: '/admin/staff/notice' },
        ],
    },
    {
        name: 'Officers',
        href: '/admin/officers',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
    {
        name: 'Board of Directors',
        href: '/admin/board-of-directors',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        ),
    },

    {
        name: 'Notice',
        href: '/admin/notice',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
        ),
    },
    {
        name: 'Annual Reports',
        href: '/admin/annual-reports',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
    },
    {
        name: 'Media Gallery',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
        subItems: [
            { name: 'Images', href: '/admin/gallery/images' },
            { name: 'Videos', href: '/admin/gallery/videos' },
        ],
    },
    {
        name: 'Membership',
        href: '/admin/volunteer-membership',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
            </svg>
        ),
    },
    {
        name: 'Attendance',
        href: '/admin/volunteer-attendance',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
        ),
    },
    {
        name: 'Programmes',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
        subItems: [
            { name: 'Recently Held', href: '/admin/programme/recently-held' },
            { name: 'Upcoming', href: '/admin/programme/upcoming' },
        ],
    },
    {
        name: 'Projects',
        href: '/admin/projects',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
        ),
    },
    {
        name: 'Project Overview',
        href: '/admin/project-overview',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
        ),
    },
    {
        name: 'Media Coverage',
        href: '/admin/media-coverage',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 4a2 2 0 00-2-2m2 2v6a2 2 0 01-2 2h-2M9 9h4m-4 4h4" />
            </svg>
        ),
    },
    {
        name: 'Scholarship Management',
        href: '/admin/scholarship',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
            </svg>
        ),
    },
    {
        name: 'Internship Management',
        href: '/admin/internship',
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
    },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
        Volunteers: true,
        StaffManagement: true,
        MediaGallery: true,
        Programmes: true,
    });
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = (name: string) => {
        setOpenMenus(prev => ({ ...prev, [name]: !prev[name] }));
    };

    const isActive = (href?: string) => {
        if (!href) return false;
        return pathname === href;
    };

    const isParentActive = (subItems?: { href: string }[]) => {
        if (!subItems) return false;
        return subItems.some(item => pathname === item.href);
    };

    const handleLogout = () => {
        localStorage.removeItem('admin_data');
        router.push('/login/admin');
    };

    const sidebarContent = (
        <>
            {/* Logo Section - Enhanced */}
            <div className="px-5 pt-6 pb-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/20">
                        <Image src="/logo.jpg" alt="Logo" width={28} height={28} className="rounded-lg" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-gray-900 tracking-tight">BSPNWS</h2>
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Admin Portal</p>
                    </div>
                </div>
            </div>

            {/* Navigation - Enhanced */}
            <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto custom-scrollbar">
                {navItems.map((item) => {
                    const hasSubItems = item.subItems && item.subItems.length > 0;
                    const active = isActive(item.href);
                    const parentActive = isParentActive(item.subItems);
                    const isExpanded = openMenus[item.name.replace(/\s/g, '')];

                    if (hasSubItems) {
                        return (
                            <div key={item.name} className="mb-1">
                                <button
                                    onClick={() => toggleMenu(item.name.replace(/\s/g, ''))}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${parentActive || isExpanded
                                        ? 'bg-rose-50 text-rose-600'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-rose-600'
                                        }`}
                                >
                                    <div className={`transition-colors duration-200 ${parentActive || isExpanded ? 'text-rose-600' : 'text-gray-400 group-hover:text-rose-600'}`}>
                                        {item.icon}
                                    </div>
                                    <span className="text-sm font-semibold flex-1 text-left">{item.name}</span>
                                    <svg
                                        className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                                    <div className="pl-11 pr-2 py-1 space-y-1">
                                        {item.subItems!.map((sub) => {
                                            const subActive = pathname === sub.href;
                                            return (
                                                <Link
                                                    key={sub.href}
                                                    href={sub.href}
                                                    onClick={() => setMobileOpen(false)}
                                                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${subActive
                                                        ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/20'
                                                        : 'text-gray-500 hover:text-rose-600 hover:bg-rose-50'
                                                        }`}
                                                >
                                                    <span>{sub.name}</span>
                                                    {(sub as any).badge && (
                                                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${subActive ? 'bg-white/20' : 'bg-rose-100 text-rose-600'}`}>
                                                            {(sub as any).badge}
                                                        </span>
                                                    )}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    return (
                        <Link
                            key={item.href}
                            href={item.href!}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${active
                                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-rose-600/20'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-rose-600'
                                }`}
                        >
                            <div className={`transition-colors duration-200 ${active ? 'text-white' : 'text-gray-400 group-hover:text-rose-600'}`}>
                                {item.icon}
                            </div>
                            <span className="text-sm font-semibold">{item.name}</span>
                            {active && (
                                <div className="ml-auto w-1 h-5 bg-white/30 rounded-full"></div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User Section - Enhanced */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/30">
                <Link
                    href="/admin/edit-profile"
                    onClick={() => setMobileOpen(false)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 mb-1 ${pathname === '/admin/edit-profile'
                        ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-rose-600'
                        }`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-sm font-semibold">Edit Profile</span>
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
                >
                    <svg className="w-5 h-5 transition-colors duration-200 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="text-sm font-semibold">Logout</span>
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile Menu Button - Enhanced */}
            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`lg:hidden fixed top-4 left-4 z-[60] bg-white rounded-xl p-2.5 shadow-lg transition-all duration-200 ${scrolled ? 'shadow-md' : 'shadow-lg'
                    }`}
            >
                {mobileOpen ? (
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
            </button>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/40 z-[54] backdrop-blur-sm animate-fade-in"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Desktop Sidebar - Enhanced */}
            <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-[280px] bg-white border-r border-gray-100 z-50 flex-col shadow-sm">
                {sidebarContent}
            </aside>

            {/* Mobile Sidebar - Enhanced */}
            <aside
                className={`lg:hidden fixed left-0 top-0 h-screen w-[280px] bg-white border-r border-gray-100 z-[55] flex flex-col transition-transform duration-300 ease-out shadow-xl ${mobileOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {sidebarContent}
            </aside>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e0e0e0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #fb7185;
                }
                @keyframes fade-in {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out;
                }
            `}</style>
        </>
    );
}