"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import MissionVisionSection from "@/components/MissionVisionSection";
import AboutSection from "@/components/AboutSection";
import AdminVerificationModal from "@/components/AdminVerificationModal";
import DietitianSection from "@/components/DietitianSection";
import WelcomeTicker from "@/components/WelcomeTicker";
import OurMemories from "@/components/OurMemories";

type SplashStage = "logo" | "text" | "transitioning" | "complete";

const projectImages: Record<string, string> = {
  "BARISTHA VANDANA": "/baristha.jpg",
  "ANNAPRASHANA": "/Annaprashan_Invitation.webp",
  "SWASTHYA VIKAS": "/swasta bikash.jpg",
  "SAMPARKER BANDHAN": "/bhai-dooj-ceremony-with-cartoon-character-free-vector.jpg",
  "AANANDAM": "/picnic.jpg",
  "SHYAMALIMA": "/syamolima.webp",
  "UTSAHO": "/utsaho.jpg",
  "KUTUMBA": "/volunteer-help-people-idea-charity-community-support-homeless-donate-clothes-give-food-care-humanity-vector-illustration-166270315.webp",
};

const ProjectIcon = ({ name, image }: { name: string; image?: string }) => {
  if (image) {
    return (
      <div className="w-full h-full relative group-hover:scale-110 transition-transform duration-700">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>
    );
  }
  const src = projectImages[name];
  if (!src) return null;
  return (
    <div className="w-full h-full relative group-hover:scale-110 transition-transform duration-700">
      <Image
        src={src}
        alt={name}
        fill
        className="object-cover"
        sizes="64px"
      />
    </div>
  );
};

const ProjectCard = ({ name, image, side, delay }: { name: string; image?: string; side: "left" | "right", delay: string }) => (
  <div className={`relative flex items-center gap-5 bg-white p-5 rounded-[2rem] shadow-[0_12px_32px_rgba(0,0,0,0.1)] border-2 border-gray-100 hover:shadow-[0_24px_48px_rgba(0,0,0,0.15)] hover:-translate-y-2 hover:scale-[1.04] hover:border-primary/40 transition-all duration-500 cursor-pointer group ${side === "left" ? "animate-slide-left" : "animate-slide-right"} ${delay} ${side === "right" ? "flex-row-reverse text-right" : "text-left"}`}>
    <div className="flex-1">
      <div className={`text-[10px] font-black tracking-[0.2em] uppercase mb-1.5 transition-colors ${side === "left" ? "text-primary group-hover:text-primary/70" : "text-secondary group-hover:text-secondary/70"}`}>Initiative Portfolio</div>
      <h3 className="text-sm md:text-base font-black tracking-tight text-[#0F172A] leading-tight">{name}</h3>
    </div>
    <div className={`w-16 h-16 relative flex-shrink-0 bg-gray-100 rounded-2xl overflow-hidden shadow-inner group-hover:shadow-2xl transition-all duration-500 ring-4 ${side === "left" ? "ring-primary/10 group-hover:ring-primary/20" : "ring-secondary/10 group-hover:ring-secondary/20"}`}>
      <ProjectIcon name={name} image={image} />
    </div>
  </div>
);

// Module-level variable persists during internal navigation but resets on full page refresh
let hasShownSplashGlobal = false;

const backgrounds = [
  '/bg-2.jpg',
  '/bg-3.jpg',
  '/bg-1.jpg',
  '/home-bg.jpg',


];

export default function Home() {
  const [stage, setStage] = useState<SplashStage>("logo");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [bgIndex, setBgIndex] = useState(0);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const navRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch dynamic projects
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/admin/projects');
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          // Splitting projects for left and right
          const mid = Math.ceil(data.length / 2);
          setDynamicProjects({
            left: data.slice(0, mid).map(p => ({ name: p.name, image: p.images?.[0] })),
            right: data.slice(mid).map(p => ({ name: p.name, image: p.images?.[0] }))
          });
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };
    fetchProjects();

    // Background rotation interval
    const bgInterval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 6000);

    // Skip splash if already shown in this module lifecycle
    if (hasShownSplashGlobal) {
      setStage("complete");
      return () => clearInterval(bgInterval);
    }

    const timers = [
      setTimeout(() => setStage("text"), 1500),
      setTimeout(() => setStage("transitioning"), 4500),
      setTimeout(() => {
        setStage("complete");
        hasShownSplashGlobal = true;
      }, 5500),
    ];

    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      timers.forEach(clearTimeout);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const [dynamicProjects, setDynamicProjects] = useState<{ left: any[], right: any[] } | null>(null);

  const leftProjects = dynamicProjects?.left || [
    { name: "BARISTHA VANDANA" },
    { name: "ANNAPRASHANA" },
    { name: "SWASTHYA VIKAS" },
    { name: "SAMPARKER BANDHAN" },
  ];

  const rightProjects = dynamicProjects?.right || [
    { name: "AANANDAM" },
    { name: "SHYAMALIMA" },
    { name: "UTSAHO" },
    { name: "KUTUMBA" },
  ];

  if (stage !== "complete") {
    return (
      <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] text-white ${stage === 'transitioning' ? 'animate-fade-out' : ''}`}>
        {/* Stage 1: Logo entrance */}
        {(stage === "logo" || stage === "text") && (
          <div className="relative w-56 h-56 mb-12 animate-scale-in">
            <Image
              src="/logo.jpg"
              alt="BSPNWS Logo"
              fill
              className="object-contain rounded-full border-4 border-primary/30 shadow-[0_0_60px_rgba(50,205,50,0.3)] animate-glow"
              priority
            />
          </div>
        )}

        {/* Stage 2: Text reveal */}
        {stage === "text" && (
          <div className="text-center px-6 max-w-4xl">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight animate-reveal bg-gradient-to-r from-white via-primary to-white bg-clip-text text-transparent">
              Welcome to
            </h2>
            <div className="mt-6 animate-slide-up-fade" style={{ animationDelay: '0.6s' }}>
              <h1 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-[0.2em] leading-tight">
                Burdwan Sadar Pyara
              </h1>
              <p className="text-primary font-black uppercase tracking-[0.4em] text-lg mt-3">
                Nutrition Welfare Society
              </p>
            </div>
            <div className="mt-12 flex justify-center animate-fade-in" style={{ animationDelay: '1.2s' }}>
              <div className="w-1.5 h-1.5 bg-primary rounded-full mx-1 animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-1.5 h-1.5 bg-primary rounded-full mx-1 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1.5 h-1.5 bg-primary rounded-full mx-1 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white animate-fade-in overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm" ref={navRef}>
        <div className="max-w-[1400px] mx-auto px-4 h-20 flex items-center justify-between gap-4">
          {/* Logo Section */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 group">
            <div className="relative w-12 h-12 transition-transform group-hover:scale-105">
              <Image src="/logo.jpg" alt="Logo" fill className="object-contain rounded-full border border-gray-100" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tighter text-gray-900 leading-none">Burdawn Sadar Pyara Nutrition</span>
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none mt-0.5">Welfare Society</span>
            </div>
          </Link>

          {/* Navigation Items */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-3 flex-nowrap py-2">
            <Link href="/" className="px-3 py-2 text-[13px] xl:text-sm text-primary font-bold whitespace-nowrap">Home</Link>
            <Link href="/projects" className="px-3 py-2 text-[13px] xl:text-sm text-gray-600 font-bold hover:text-primary transition-colors whitespace-nowrap">Projects</Link>

            {/* About Dropdown */}
            <div className="relative group py-2">
              <button
                onClick={() => toggleDropdown('about')}
                className={`px-3 flex items-center text-[13px] xl:text-sm font-bold transition-colors whitespace-nowrap ${activeDropdown === 'about' ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}
              >
                About <svg className={`ml-1 w-3.5 h-3.5 transition-transform ${activeDropdown === 'about' ? 'rotate-180 text-primary' : 'group-hover:rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              <div className={`nav-dropdown ${activeDropdown === 'about' ? 'is-open' : ''}`}>
                <Link href="/about" className="dropdown-link" onClick={() => setActiveDropdown(null)}>About Us</Link>
                <Link href="/officers" className="dropdown-link" onClick={() => setActiveDropdown(null)}>Officers</Link>
              </div>
            </div>

            {/* Gallery Dropdown */}
            <div className="relative group py-2">
              <button
                onClick={() => toggleDropdown('gallery')}
                className={`px-3 flex items-center text-[13px] xl:text-sm font-bold transition-colors whitespace-nowrap ${activeDropdown === 'gallery' ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}
              >
                Gallery <svg className={`ml-1 w-3.5 h-3.5 transition-transform ${activeDropdown === 'gallery' ? 'rotate-180 text-primary' : 'group-hover:rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              <div className={`nav-dropdown ${activeDropdown === 'gallery' ? 'is-open' : ''}`}>
                <Link href="/gallery/image" className="dropdown-link" onClick={() => setActiveDropdown(null)}>Image</Link>
                <Link href="/gallery/video" className="dropdown-link" onClick={() => setActiveDropdown(null)}>Video</Link>
              </div>
            </div>

            {/* Volunteers Dropdown */}
            <div className="relative group py-2">
              <button
                onClick={() => toggleDropdown('volunteers')}
                className={`px-3 flex items-center text-[13px] xl:text-sm font-bold transition-colors whitespace-nowrap ${activeDropdown === 'volunteers' ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}
              >
                Volunteers <svg className={`ml-1 w-3.5 h-3.5 transition-transform ${activeDropdown === 'volunteers' ? 'rotate-180 text-primary' : 'group-hover:rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              <div className={`nav-dropdown ${activeDropdown === 'volunteers' ? 'is-open' : ''}`}>
                <Link href="/volunteers/our" className="dropdown-link" onClick={() => setActiveDropdown(null)}>Our Volunteers</Link>
                <Link href="/volunteers/become" className="dropdown-link" onClick={() => setActiveDropdown(null)}>Become a Volunteer</Link>
              </div>
            </div>

            {/* Programme Dropdown */}
            <div className="relative group py-2">
              <button
                onClick={() => toggleDropdown('programme')}
                className={`px-3 flex items-center text-[13px] xl:text-sm font-bold transition-colors whitespace-nowrap ${activeDropdown === 'programme' ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}
              >
                Programme <svg className={`ml-1 w-3.5 h-3.5 transition-transform ${activeDropdown === 'programme' ? 'rotate-180 text-primary' : 'group-hover:rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              <div className={`nav-dropdown ${activeDropdown === 'programme' ? 'is-open' : ''}`}>
                <Link href="/programme/recent" className="dropdown-link" onClick={() => setActiveDropdown(null)}>Recently Held Programme</Link>
                <Link href="/programme/upcoming" className="dropdown-link" onClick={() => setActiveDropdown(null)}>Upcoming Programme</Link>
              </div>
            </div>

            {/* Notice Dropdown */}
            <div className="relative group py-2">
              <button
                onClick={() => toggleDropdown('notice')}
                className={`px-3 flex items-center text-[13px] xl:text-sm font-bold transition-colors whitespace-nowrap ${activeDropdown === 'notice' ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}
              >
                Notice <svg className={`ml-1 w-3.5 h-3.5 transition-transform ${activeDropdown === 'notice' ? 'rotate-180 text-primary' : 'group-hover:rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              <div className={`nav-dropdown ${activeDropdown === 'notice' ? 'is-open' : ''}`}>
                <Link href="/notice" className="dropdown-link" onClick={() => setActiveDropdown(null)}>General Notice</Link>
                <Link href="/notice/annual-reports" className="dropdown-link" onClick={() => setActiveDropdown(null)}>Annual Reports</Link>
              </div>
            </div>
            <Link href="/our-materials" className="px-3 py-2 text-[13px] xl:text-sm text-gray-600 font-bold hover:text-primary transition-colors whitespace-nowrap">Our Materials</Link>
            <Link href="/help" className="px-3 py-2 text-[13px] xl:text-sm text-primary font-black hover:scale-105 transition-transform whitespace-nowrap">Help Us</Link>
          </div>

          <div className="flex-shrink-0 flex items-center gap-4">
            <Link href="/contact" className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold hover:bg-green-600 transition-all shadow-lg shadow-primary/20 text-sm whitespace-nowrap">
              Contact Us
            </Link>

            <div className="relative login-group group">
              <button className="flex items-center bg-white/70 backdrop-blur-md border border-gray-100 shadow-xl rounded-2xl px-5 py-2.5 hover:bg-white transition-all">
                <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white mr-3">
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                </div>
                <span className="text-sm font-black text-gray-900 uppercase tracking-widest mr-2">Login</span>
                <svg className="w-4 h-4 text-gray-400 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
              </button>

              <div className="login-dropdown">
                <Link href="/login/volunteer" className="login-link">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary mr-3">
                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black text-primary leading-none mb-1">VOLUNTEER</span>
                    <span className="text-[10px] text-gray-400 font-bold leading-none">Portal Access</span>
                  </div>
                </Link>
                <div className="h-px bg-gray-50 my-1 mx-2"></div>
                <div
                  onClick={() => {
                    setIsAdminAuthOpen(true);
                    setActiveDropdown(null);
                  }}
                  className="login-link cursor-pointer"
                >
                  <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center text-secondary mr-3">
                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black text-secondary leading-none mb-1">ADMINISTRATOR</span>
                    <span className="text-[10px] text-gray-400 font-bold leading-none">Security Login</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-20 min-h-[90vh] flex flex-col items-center justify-center relative overflow-hidden bg-black">
        {/* Background Slideshow Layers */}
        {backgrounds.map((src, index) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${index === bgIndex ? 'opacity-100' : 'opacity-0'}`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed transform scale-105"
              style={{ backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1)), url('${src}')` }}
            ></div>
            {/* Minimal overlay to maintain visibility without obscuring images */}
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
        ))}

        {/* Background Decorative Elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-24">

          {/* Left Grid */}
          <div className="grid grid-cols-1 gap-8 w-full max-w-[320px]">
            {leftProjects.map((p: any, index) => (
              <ProjectCard key={p.name} name={p.name} image={p.image} side="left" delay={`delay-${(index + 1) * 100}`} />
            ))}
          </div>

          {/* Central Orb */}
          <div className="relative group perspective-1000">
            {/* Multi-layered Animated Glow */}
            <div className="absolute -inset-8 bg-primary/20 rounded-full blur-3xl animate-pulse group-hover:bg-primary/30 transition-all duration-700"></div>
            <div className="absolute -inset-12 bg-secondary/10 rounded-full blur-[60px] animate-reverse-spin group-hover:bg-secondary/20 transition-all duration-1000"></div>

            <div className="relative w-80 h-80 md:w-[26rem] md:h-[26rem] bg-white/90 backdrop-blur-2xl rounded-full border-[16px] border-white/50 shadow-[0_32px_80px_rgba(0,0,0,0.12)] flex flex-col items-center justify-center text-center p-12 transition-transform duration-700 hover:scale-[1.02] hover:rotate-1 overflow-hidden ring-1 ring-black/5">

              {/* Rotating Background Pattern */}
              <div className="absolute inset-0 opacity-[0.03] animate-spin-slow">
                <Image src="/logo.jpg" alt="Watermark" fill className="object-cover scale-150 rotate-45 grayscale" />
              </div>

              {/* Functional Content Overlay */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="mb-6 overflow-hidden rounded-2xl shadow-xl border-4 border-white rotate-3 group-hover:rotate-0 transition-transform duration-500">
                  <Image src="/logo.jpg" alt="Small Logo" width={64} height={64} className="object-contain" />
                </div>

                <div className="bg-gradient-to-r from-secondary to-pink-500 text-white py-1.5 px-6 rounded-full mb-6 text-[10px] font-black tracking-[0.3em] shadow-lg shadow-secondary/20">
                  OUR CORE PROJECTS
                </div>

                <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-[1.1] tracking-tight">
                  Empowering <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary to-green-700">Life,</span><br />
                  <span className="italic font-serif text-2xl md:text-3xl text-gray-500 mt-2 block">Building Future</span>
                </h1>

                <div className="mt-8 flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-100"></div>
                  <div className="w-2 h-2 rounded-full bg-secondary animate-bounce delay-200"></div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-300"></div>
                </div>
              </div>

              {/* Glassy Inner Ring */}
              <div className="absolute inset-4 rounded-full border border-black/5 pointer-events-none"></div>
            </div>
          </div>

          {/* Right Grid */}
          <div className="grid grid-cols-1 gap-8 w-full max-w-[320px]">
            {rightProjects.map((p: any, index) => (
              <ProjectCard key={p.name} name={p.name} image={p.image} side="right" delay={`delay-${(index + 1) * 100}`} />
            ))}
          </div>
        </div>

        {/* Hero Footer Buttons */}
        <div className="mt-16 flex flex-col sm:flex-row gap-4 relative z-10">
          <Link href="/projects" className="bg-primary text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-600 transition-all shadow-xl shadow-primary/20 hover:-translate-y-1">
            Explore our projects <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </Link>
          <Link href="/contact" className="bg-white text-gray-900 border-2 border-gray-100 px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:border-primary transition-all hover:-translate-y-1">
            Contact Us <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </Link>
        </div>
      </main>

      <WelcomeTicker />

      {/* About Us Section */}
      <AboutSection />
      {/* Top Right Login Dropdown */}

      {/* Mission and Vision Section */}
      <MissionVisionSection />
      <section className="py-24 bg-white" id="about-section">
        <div className="w-full px-6 md:px-12 lg:px-24 flex flex-col md:flex-row gap-16 items-center justify-between">
          <div className="flex-1 max-w-4xl">
            <div className="text-sm font-black text-primary tracking-widest mb-4">OUR GOAL</div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-8 leading-tight">
              Empowering communities with <br className="hidden lg:block" />
              <span className="text-primary italic">Social Welfare solutions.</span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-6 max-w-3xl">
              Burdwan Sadar Pyara Nutrition Welfare Society is dedicated to improving the quality of life through comprehensive nutrition programs and social welfare initiatives. We believe in sustainable growth and community-driven impact.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <Link href="/about" className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-green-600 hover:-translate-y-1 transition-all shadow-xl shadow-primary/20">About Us</Link>
              <Link href="/officers" className="bg-white text-gray-900 border-2 border-gray-100 px-8 py-3 rounded-xl font-bold hover:border-primary hover:-translate-y-1 transition-all">Officers</Link>
            </div>
          </div>
          <div className="w-80 h-80 lg:w-96 lg:h-96 relative shrink-0 transition-transform duration-700 hover:rotate-3">
            <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-2xl animate-pulse"></div>
            <Image src="/logo.jpg" alt="BSPNWS Logo Large" fill className="object-contain rounded-3xl shadow-2xl relative z-10" />
          </div>
        </div>
      </section>

      {/* Dietitian Section */}
      <DietitianSection />

      <OurMemories />





      <AdminVerificationModal
        isOpen={isAdminAuthOpen}
        onClose={() => setIsAdminAuthOpen(false)}
        adminCode="BSP_ADMIN_579"
      />
    </div>
  );
}
