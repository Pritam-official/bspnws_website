"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  {
    label: "About",
    children: [
      { label: "About Us", href: "/about" },
      { label: "Board of Directors", href: "/about/board-of-directors" },
      { label: "Officers", href: "/officers" },
    ],
  },
  {
    label: "Gallery",
    children: [
      { label: "Image", href: "/gallery/image" },
      { label: "Video", href: "/gallery/video" },
    ],
  },
  {
    label: "Volunteers",
    children: [
      { label: "Our Volunteers", href: "/volunteers/our" },
      { label: "Become a Volunteer", href: "/volunteers/become" },
    ],
  },
  {
    label: "Programme",
    children: [
      { label: "Recently Held Programme", href: "/programme/recent" },
      { label: "Upcoming Programme", href: "/programme/upcoming" },
    ],
  },
  {
    label: "Notice",
    children: [
      { label: "General Notice", href: "/notice" },
      { label: "Annual Reports", href: "/notice/annual-reports" },
    ],
  },
  { label: "Media Coverage", href: "/media-coverage" },
  {
    label: "Student Opportunities",
    children: [
      { label: "Scholarship Apply", href: "/scholarship-apply" },
      { label: "Internship Apply", href: "/internship-apply" },
    ],
  },
  { label: "Reviews", href: "/reviews" },
  { label: "Donate", href: "/donate", highlight: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [isDesktopMode, setIsDesktopMode] = useState(false);
  const [forceMobile, setForceMobile] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // Initialize and apply viewport settings based on viewMode preference
  useEffect(() => {
    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.screen.width < 768;
    setForceMobile(isMobile);

    const savedMode = localStorage.getItem("viewMode");
    const isDesktop = savedMode === "desktop";
    setIsDesktopMode(isDesktop);
    
    const content = isDesktop 
      ? "width=1280" 
      : "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no";
      
    const meta = document.querySelector('meta[name="viewport"]');
    if (meta) {
      meta.setAttribute("content", content);
    }
  }, []);

  const toggleDesktopView = () => {
    const nextMode = !isDesktopMode;
    setIsDesktopMode(nextMode);
    localStorage.setItem("viewMode", nextMode ? "desktop" : "mobile");
    
    const content = nextMode 
      ? "width=1280" 
      : "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no";
      
    const meta = document.querySelector('meta[name="viewport"]');
    if (meta) {
      meta.setAttribute("content", content);
    }
    
    setMobileOpen(false);
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const toggleDropdown = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  const toggleMobileExpanded = (label: string) => {
    setMobileExpanded(mobileExpanded === label ? null : label);
  };

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm"
      >
        <div className="max-w-[1400px] mx-auto px-4 h-16 sm:h-20 flex items-center justify-between gap-2">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 group min-w-0">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 transition-transform group-hover:scale-105">
              <Image src="/logo.jpg" alt="Logo" fill className="object-contain rounded-full border border-gray-100" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm sm:text-base lg:text-lg font-black tracking-tighter text-gray-900 leading-none truncate">
                <span className={forceMobile ? "hidden" : "hidden xl:inline"}>Burdwan Sadar Pyara Nutrition</span>
                <span className={forceMobile ? "inline" : "xl:hidden"}>BSPNWS</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-primary uppercase tracking-widest leading-none mt-0.5">
                Welfare Society
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className={forceMobile ? "hidden" : "hidden xl:flex items-center space-x-0.5 xl:space-x-1.5 flex-nowrap py-2"}>
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label} className="relative group py-2">
                  <button
                    onClick={() => toggleDropdown(link.label)}
                    className={`px-1.5 xl:px-2.5 flex items-center text-[11px] xl:text-xs font-bold transition-colors whitespace-nowrap ${
                      activeDropdown === link.label ? "text-primary" : "text-gray-600 hover:text-primary"
                    }`}
                  >
                    {link.label}
                    <svg
                      className={`ml-1 w-3.5 h-3.5 transition-transform ${
                        activeDropdown === link.label ? "rotate-180 text-primary" : "group-hover:rotate-180"
                      }`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className={`nav-dropdown ${activeDropdown === link.label ? "is-open" : ""}`}>
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="dropdown-link"
                        onClick={() => setActiveDropdown(null)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href!}
                  className={
                    link.highlight
                      ? "px-4 py-2 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white rounded-full text-[11px] xl:text-xs font-black whitespace-nowrap transition-all duration-300 shadow-md shadow-rose-500/25 hover:shadow-lg hover:shadow-rose-500/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                      : `px-1.5 xl:px-2.5 py-2 text-[11px] xl:text-xs font-bold whitespace-nowrap transition-colors ${
                          pathname === link.href
                            ? "text-primary"
                            : "text-gray-600 hover:text-primary"
                        }`
                  }
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex-shrink-0 flex items-center gap-1.5 sm:gap-4">
            {/* Contact Us */}
            <Link
              href="/contact"
              className="inline-flex bg-primary text-white px-2.5 py-1.5 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl font-bold hover:bg-green-600 transition-all shadow-lg shadow-primary/20 text-[9px] sm:text-sm whitespace-nowrap animate-fade-in"
            >
              Contact Us
            </Link>

            {/* Login Button */}
            <Link
              href="/login"
              className="flex items-center bg-white/70 backdrop-blur-md border border-gray-100 shadow-md sm:shadow-xl rounded-lg sm:rounded-2xl px-2.5 py-1.5 sm:px-5 sm:py-2.5 hover:bg-white hover:border-gray-200 hover:shadow-lg transition-all group"
            >
              <div className="w-5 h-5 sm:w-8 sm:h-8 bg-gray-900 rounded-md sm:rounded-lg flex items-center justify-center text-white mr-1 sm:mr-3 group-hover:bg-primary transition-colors">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <span className="text-[9px] sm:text-sm font-black text-gray-900 uppercase tracking-wider sm:tracking-widest">Login</span>
            </Link>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`${forceMobile ? "flex" : "xl:hidden flex"} items-center justify-center w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors`}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? (
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className={`${forceMobile ? "" : "xl:hidden"} fixed inset-0 bg-black/50 z-40 backdrop-blur-sm`}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`${forceMobile ? "" : "xl:hidden"} fixed top-0 right-0 h-full w-[85vw] max-w-[340px] bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
            <div className="relative w-9 h-9">
              <Image src="/logo.jpg" alt="Logo" fill className="object-contain rounded-full" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-gray-900 leading-none">BSPNWS</span>
              <span className="text-[9px] font-bold text-primary uppercase tracking-widest">Welfare Society</span>
            </div>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer Nav Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.label}>
                <button
                  onClick={() => toggleMobileExpanded(link.label)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors"
                >
                  <span>{link.label}</span>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${mobileExpanded === link.label ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    mobileExpanded === link.label ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="pl-5 pr-2 py-1 space-y-1">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-primary hover:bg-primary/5 transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href!}
                onClick={() => setMobileOpen(false)}
                className={
                  link.highlight
                    ? "flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-black text-white bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 shadow-md shadow-rose-500/25 active:scale-95 transition-all my-1 text-center"
                    : `flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                        pathname === link.href
                          ? "text-primary bg-primary/5"
                          : "text-gray-700 hover:bg-gray-50"
                      }`
                }
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        {/* Drawer Footer Actions */}
        <div className="px-4 py-5 border-t border-gray-100 space-y-3">
          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-green-600 transition-all shadow-lg shadow-primary/20 text-sm"
          >
            Contact Us
          </Link>
          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-primary/20 text-primary font-bold text-sm hover:bg-primary/5 transition-all shadow-md active:scale-95"
          >
            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
            Access Portals
          </Link>
          
          {/* Desktop/Mobile View toggle button */}
          <button
            onClick={toggleDesktopView}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-gray-100 text-gray-700 font-bold text-xs hover:bg-gray-50 transition-colors mt-2 cursor-pointer"
          >
            {isDesktopMode ? (
              <>
                <svg className="w-4 h-4 text-gray-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span>Switch to Mobile Site</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 text-gray-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Request Desktop Site</span>
              </>
            )}
          </button>
        </div>
      </div>

    </>
  );
}
