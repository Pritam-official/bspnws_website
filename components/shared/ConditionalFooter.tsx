"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Footer from '@/components/home/Footer';

export default function ConditionalFooter() {
    const pathname = usePathname();
    // Admin pages render their own footer inside the admin layout (offset by sidebar)
    const isAdminRoute = pathname?.startsWith('/admin');

    if (isAdminRoute) return null;

    // Volunteer portal dashboard pages render a fixed sidebar on desktop, so the footer needs to be offset
    const isVolunteerDashboard = pathname?.startsWith('/volunteers') &&
        !pathname?.startsWith('/volunteers/become') &&
        !pathname?.startsWith('/volunteers/our');

    if (isVolunteerDashboard) {
        return (
            <div className="lg:ml-64 relative z-0">
                <Footer />
            </div>
        );
    }

    return (
        <div className="relative z-0">
            <Footer />
        </div>
    );
}
