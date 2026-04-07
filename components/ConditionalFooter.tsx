"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Footer from '@/components/Footer';

export default function ConditionalFooter() {
    const pathname = usePathname();
    // Admin pages render their own footer inside the admin layout (offset by sidebar)
    const isAdminRoute = pathname?.startsWith('/admin');

    if (isAdminRoute) return null;
    return <Footer />;
}
