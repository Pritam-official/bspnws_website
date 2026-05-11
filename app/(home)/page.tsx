"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import MissionVisionSection from "@/components/home/MissionVisionSection";
import AboutSection from "@/components/home/AboutSection";
import AdminVerificationModal from "@/components/admin-portal/AdminVerificationModal";
import DietitianSection from "@/components/home/DietitianSection";
import WelcomeTicker from "@/components/home/WelcomeTicker";
import OurMemories from "@/components/home/OurMemories";
import Navbar from "@/components/shared/Navbar";
import adminConfig from "@/lib/admin-config.json";


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
  <div className={`relative flex items-center gap-5 bg-white p-5 rounded-[2rem] shadow-[0_12px_32px_rgba(0,0,0,0.1)] border-2 border-gray-100 hover:shadow-[0_24px_48px_rgba(0,0,0,0.15)] hover:-translate-y-2 hover:scale-[1.04] hover:border-primary/40 transition-all duration-500 cursor-pointer group ${side === "left" ? "animate-slide-left" : "animate-slide-right"} ${delay} text-left`}>
    <div className={`w-16 h-16 relative flex-shrink-0 bg-gray-100 rounded-2xl overflow-hidden shadow-inner group-hover:shadow-2xl transition-all duration-500 ring-4 ring-primary/10 group-hover:ring-primary/20`}>
      <ProjectIcon name={name} image={image} />
    </div>
    <div className="flex-1">
      <div className="text-[10px] font-black tracking-[0.2em] uppercase mb-1.5 transition-colors text-primary group-hover:text-primary/70">Initiative Portfolio</div>
      <h3 className="text-sm md:text-base font-black tracking-tight text-[#0F172A] leading-tight">{name}</h3>
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
  const [bgIndex, setBgIndex] = useState(0);

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

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

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
      <Navbar />

      {/* Hero Section */}
      <main className="pt-10 md:pt-20 min-h-[70vh] lg:min-h-[90vh] flex flex-col items-center justify-center relative overflow-hidden bg-black">
        {/* Background Slideshow Layers */}
        {backgrounds.map((src, index) => (
          <div
            key={src}
            className={`absolute inset-0 transition-all duration-[3000ms] ease-in-out ${index === bgIndex ? 'opacity-100' : 'opacity-0'}`}
          >
            <div
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[6000ms] ease-linear ${index === bgIndex ? 'scale-110' : 'scale-100'}`}
              style={{ backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.2)), url('${src}')` }}
            ></div>
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
        ))}

        {/* Background Decorative Elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="container mx-auto px-4 relative z-10 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-24">

          {/* Left Grid — visible on all screens, responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6 lg:gap-8 w-full max-w-5xl lg:max-w-[320px] order-2 lg:order-1">
            {leftProjects.map((p: any, index) => (
              <ProjectCard key={p.name} name={p.name} image={p.image} side="left" delay={`delay-${(index + 1) * 100}`} />
            ))}
          </div>

          {/* Central Orb */}
          <div className="relative group perspective-1000 order-1 lg:order-2">
            {/* Multi-layered Animated Glow */}
            <div className="absolute -inset-8 bg-primary/20 rounded-full blur-3xl animate-pulse group-hover:bg-primary/30 transition-all duration-700"></div>
            <div className="absolute -inset-12 bg-secondary/10 rounded-full blur-[60px] animate-reverse-spin group-hover:bg-secondary/20 transition-all duration-1000"></div>

            <div className="relative w-[20rem] h-[20rem] sm:w-[22rem] sm:h-[22rem] lg:w-[26rem] lg:h-[26rem] bg-white/95 backdrop-blur-2xl rounded-full border-[6px] sm:border-[12px] lg:border-[16px] border-white/50 shadow-[0_32px_80px_rgba(0,0,0,0.12)] flex flex-col items-center justify-center text-center p-4 sm:p-12 transition-transform duration-700 hover:scale-[1.02] hover:rotate-1 overflow-hidden ring-1 ring-black/5">

              {/* Rotating Background Pattern */}
              <div className="absolute inset-0 opacity-[0.03] animate-spin-slow">
                <Image src="/logo.jpg" alt="Watermark" fill className="object-cover scale-150 rotate-45 grayscale" />
              </div>

              {/* Functional Content Overlay */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="mb-2 sm:mb-6 overflow-hidden rounded-xl sm:rounded-2xl shadow-xl border-2 sm:border-4 border-white rotate-3 group-hover:rotate-0 transition-transform duration-500">
                  <Image src="/logo.jpg" alt="Small Logo" width={56} height={56} className="sm:w-16 sm:h-16 object-contain" />
                </div>

                <div className="bg-gradient-to-r from-secondary to-pink-500 text-white py-1 sm:py-1.5 px-4 sm:px-6 rounded-full mb-3 sm:mb-6 text-[9px] sm:text-[10px] font-black tracking-[0.3em] shadow-lg shadow-secondary/20">
                  OUR CORE PROJECTS
                </div>

                <h1 className="text-xl sm:text-2xl md:text-5xl font-black text-gray-900 leading-[1.1] tracking-tight">
                  Empowering <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary to-green-700">Life,</span><br />
                  <span className="italic font-serif text-lg sm:text-xl md:text-3xl text-gray-800 mt-0.5 sm:mt-2 block">Building Future</span>
                </h1>

                <div className="mt-4 sm:mt-8 flex gap-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary animate-bounce delay-100"></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-secondary animate-bounce delay-200"></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary animate-bounce delay-300"></div>
                </div>
              </div>

              {/* Glassy Inner Ring */}
              <div className="absolute inset-4 rounded-full border border-black/5 pointer-events-none"></div>
            </div>
          </div>

          {/* Right Grid — visible on all screens, responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6 lg:gap-8 w-full max-w-5xl lg:max-w-[320px] order-3">
            {rightProjects.map((p: any, index) => (
              <ProjectCard key={p.name} name={p.name} image={p.image} side="right" delay={`delay-${(index + 1) * 100}`} />
            ))}
          </div>
        </div>

        {/* Hero Footer Buttons */}
        <div className="mt-8 md:mt-16 flex flex-col sm:flex-row gap-4 relative z-10">
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


      {/* Dietitian Section */}
      <DietitianSection />

      <OurMemories />





    </div>
  );
}
