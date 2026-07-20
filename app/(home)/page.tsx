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
import MediaCoverageSection from "@/components/home/MediaCoverageSection";
import LocationSection from "@/components/home/LocationSection";
import Navbar from "@/components/shared/Navbar";
import adminConfig from "@/lib/admin-config.json";
import ProgrammeSection from "@/components/home/ProgrammeSection";
import ProjectOverviewSection from "@/components/home/ProjectOverviewSection";
import WhatsAppButton from "@/components/home/WhatsAppButton";


type SplashStage = "logo" | "text" | "transitioning" | "complete";

const projectImages: Record<string, string> = {
  "BARISTHA VANDANA": "/baristha.jpg",
  "ANNAPRASHANA": "/annaprashan_cartoon.png",
  "SWASTHYA VIKAS": "/swasta bikash.jpg",
  "SAMPARKER BANDHAN": "/bhai-dooj-ceremony-with-cartoon-character-free-vector.jpg",
  "SOMPARKER BANDHAN": "/bhai-dooj-ceremony-with-cartoon-character-free-vector.jpg",
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

const ProjectCard = ({ name, image, side, delay, href }: { name: string; image?: string; side: "left" | "right"; delay: string; href?: string | null }) => {
  const cardContent = (
    <div className={`relative flex items-center gap-2 sm:gap-5 bg-white p-2 sm:p-5 rounded-xl sm:rounded-[2rem] shadow-[0_4px_12px_rgba(0,0,0,0.05)] sm:shadow-[0_12px_32px_rgba(0,0,0,0.1)] border-2 border-gray-100 hover:shadow-[0_24px_48px_rgba(0,0,0,0.15)] hover:-translate-y-1 sm:hover:-translate-y-2 hover:scale-[1.02] sm:hover:scale-[1.04] hover:border-primary/40 transition-all duration-500 cursor-pointer group ${side === "left" ? "animate-slide-left" : "animate-slide-right"} ${delay} text-left w-full`}>
      <div className={`w-8 h-8 sm:w-16 sm:h-16 relative flex-shrink-0 bg-gray-100 rounded-lg sm:rounded-2xl overflow-hidden shadow-inner group-hover:shadow-2xl transition-all duration-500 ring-2 sm:ring-4 ring-primary/10 group-hover:ring-primary/20`}>
        <ProjectIcon name={name} image={image} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[7px] sm:text-[10px] font-black tracking-[0.2em] uppercase mb-0.5 sm:mb-1.5 transition-colors text-primary group-hover:text-primary/70 truncate">Initiative Portfolio</div>
        <h3 className="text-[9px] sm:text-sm md:text-base font-black tracking-tight text-[#0F172A] leading-tight truncate">{name}</h3>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block w-full">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

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
  const [dbProjects, setDbProjects] = useState<any[]>([]);

  useEffect(() => {
    // Fetch dynamic projects
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/admin/projects');
        const data = await res.json();
        if (Array.isArray(data)) {
          setDbProjects(data);
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

    document.body.classList.add("splash-active");

    const timers = [
      setTimeout(() => setStage("text"), 1500),
      setTimeout(() => setStage("transitioning"), 4500),
      setTimeout(() => {
        setStage("complete");
        hasShownSplashGlobal = true;
        document.body.classList.remove("splash-active");
      }, 5500),
    ];

    return () => {
      timers.forEach(clearTimeout);
      document.body.classList.remove("splash-active");
    };
  }, []);

  const leftNames = ["ANNAPRASHANA", "KUTUMBA", "UTSAHO", "SHYAMALIMA"];
  const rightNames = ["SOMPARKER BANDHAN", "AANANDAM", "SWASTHYA VIKAS", "BARISTHA VANDANA"];

  const getMappedProject = (name: string) => {
    const normalizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const matched = dbProjects.find(p => {
      const dbNorm = p.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (normalizedName.includes("bandhan") && dbNorm.includes("bandhan")) return true;
      return dbNorm === normalizedName;
    });

    if (matched) {
      return {
        name: matched.name,
        image: matched.images?.[0] || null,
        href: `/projects/${matched._id}`
      };
    }

    return {
      name,
      image: null,
      href: null
    };
  };

  const leftProjects = leftNames.map(getMappedProject);
  const rightProjects = rightNames.map(getMappedProject);

  if (stage !== "complete") {
    return (
      <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#000000] text-white p-4 ${stage === 'transitioning' ? 'animate-fade-out' : ''}`}>

        {/* Stable Logo - Always rendered, stays in a stable position */}
        <div className="relative w-48 h-48 md:w-72 md:h-72 animate-scale-in">
          <Image
            src="/logo.jpg"
            alt="BSPNWS Logo"
            fill
            className="object-contain rounded-full border-4 border-primary/30 shadow-[0_0_50px_rgba(221,112,48,0.35)] md:shadow-[0_0_60px_rgba(221,112,48,0.3)] animate-glow"
            priority
          />
        </div>

        {/* Text Container - Occupies space from start, smoothly fades and slides up */}
        <div
          className={`text-center px-4 max-w-lg md:max-w-4xl mt-8 md:mt-12 transition-all duration-1000 ease-out ${stage === "text" || stage === "transitioning"
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform translate-y-6 md:translate-y-8"
            }`}
        >
          <h2 className="text-lg md:text-2xl font-bold tracking-widest md:tracking-wide text-primary uppercase md:normal-case">
            Welcome to
          </h2>
          <div className="mt-4 md:mt-6">
            <h1 className="text-2xl md:text-4xl font-black text-white uppercase tracking-[0.15em] md:tracking-[0.2em] leading-tight">
              Burdwan Sadar Pyara
            </h1>
            <p className="text-primary font-black uppercase tracking-[0.25em] md:tracking-[0.35em] text-[10px] md:text-lg mt-2.5 md:mt-4">
              Nutrition Welfare Society
            </p>
          </div>

          {/* Centered orange dots '...' */}
          <div className="mt-8 md:mt-12 text-xl md:text-3xl font-black text-primary tracking-[0.25em] md:tracking-[0.3em] flex justify-center items-center">
            <span className="animate-pulse">.</span>
            <span className="animate-pulse delay-200">.</span>
            <span className="animate-pulse delay-400">.</span>
          </div>
        </div>

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

        <div className="container mx-auto px-4 relative z-10 flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-6 xl:gap-10 2xl:gap-20">

          {/* Left Grid — visible on all screens, responsive grid */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2.5 sm:gap-6 lg:gap-8 w-full max-w-5xl lg:max-w-[260px] xl:max-w-[290px] 2xl:max-w-[320px] order-2 lg:order-1">
            {leftProjects.map((p: any, index) => (
              <ProjectCard key={p.name} name={p.name} image={p.image} side="left" delay={`delay-${(index + 1) * 100}`} href={p.href} />
            ))}
          </div>

          {/* Central Orb */}
          <div className="relative group perspective-1000 order-1 lg:order-2">
            {/* Multi-layered Animated Glow */}
            <div className="absolute -inset-8 bg-primary/20 rounded-full blur-3xl animate-pulse group-hover:bg-primary/30 transition-all duration-700"></div>
            <div className="absolute -inset-12 bg-secondary/10 rounded-full blur-[60px] animate-reverse-spin group-hover:bg-secondary/20 transition-all duration-1000"></div>

            <div className="relative w-[11rem] h-[11rem] sm:w-[20rem] sm:h-[20rem] lg:w-[20rem] lg:h-[20rem] xl:w-[23rem] xl:h-[23rem] 2xl:w-[26rem] 2xl:h-[26rem] bg-white/95 backdrop-blur-2xl rounded-full border-4 sm:border-[10px] xl:border-[14px] 2xl:border-[16px] border-white/50 shadow-[0_32px_80px_rgba(0,0,0,0.12)] flex flex-col items-center justify-center text-center p-2 sm:p-6 lg:p-8 xl:p-10 2xl:p-12 transition-transform duration-700 hover:scale-[1.02] hover:rotate-1 overflow-hidden ring-1 ring-black/5">

              {/* Rotating Background Pattern */}
              <div className="absolute inset-0 opacity-[0.03] animate-spin-slow">
                <Image src="/logo.jpg" alt="Watermark" fill className="object-cover scale-150 rotate-45 grayscale" />
              </div>

              {/* Functional Content Overlay */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="mb-1 sm:mb-4 overflow-hidden rounded-lg sm:rounded-2xl shadow-xl border sm:border-4 border-white rotate-3 group-hover:rotate-0 transition-transform duration-500">
                  <Image src="/logo.jpg" alt="Small Logo" width={64} height={64} className="w-8 h-8 sm:w-12 sm:h-12 xl:w-16 xl:h-16 object-contain" />
                </div>

                <div className="bg-gradient-to-r from-secondary to-pink-500 text-white py-0.5 sm:py-1.5 px-2 sm:px-6 rounded-full mb-1 sm:mb-4 text-[6px] sm:text-[10px] font-black tracking-[0.2em] sm:tracking-[0.3em] shadow-lg shadow-secondary/20">
                  OUR CORE PROJECTS
                </div>

                <h1 className="text-xs sm:text-2xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-black text-gray-900 leading-[1.1] tracking-tight">
                  Empowering <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary to-green-700">Life,</span><br />
                  <span className="italic font-serif text-[9px] sm:text-lg lg:text-lg xl:text-xl 2xl:text-2xl text-gray-800 mt-0.5 sm:mt-2 block">Building Future</span>
                </h1>

                <div className="mt-1 sm:mt-6 flex gap-1 sm:gap-2">
                  <div className="w-1 h-1 sm:w-2 sm:h-2 rounded-full bg-primary animate-bounce delay-100"></div>
                  <div className="w-1 h-1 sm:w-2 sm:h-2 rounded-full bg-secondary animate-bounce delay-200"></div>
                  <div className="w-1 h-1 sm:w-2 sm:h-2 rounded-full bg-primary animate-bounce delay-300"></div>
                </div>
              </div>

              {/* Glassy Inner Ring */}
              <div className="absolute inset-4 rounded-full border border-black/5 pointer-events-none"></div>
            </div>
          </div>

          {/* Right Grid — visible on all screens, responsive grid */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2.5 sm:gap-6 lg:gap-8 w-full max-w-5xl lg:max-w-[260px] xl:max-w-[290px] 2xl:max-w-[320px] order-3">
            {rightProjects.map((p: any, index) => (
              <ProjectCard key={p.name} name={p.name} image={p.image} side="right" delay={`delay-${(index + 1) * 100}`} href={p.href} />
            ))}
          </div>
        </div>

        {/* Hero Footer Buttons */}
        <div className="mt-6 md:mt-16 grid grid-cols-2 sm:flex sm:flex-row gap-2 sm:gap-4 justify-center items-center relative z-10 w-full max-w-[340px] sm:max-w-none px-4">
          <Link href="/projects" className="bg-primary text-white px-3 sm:px-8 py-2.5 sm:py-4 rounded-lg sm:rounded-xl font-bold flex items-center justify-center gap-1 sm:gap-2 hover:bg-green-600 transition-all shadow-xl shadow-primary/20 hover:-translate-y-1 text-[11px] sm:text-sm whitespace-nowrap">
            Explore our projects <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </Link>
          <Link href="/contact" className="bg-white text-gray-900 border-2 border-gray-100 px-3 sm:px-8 py-2.5 sm:py-4 rounded-lg sm:rounded-xl font-bold flex items-center justify-center gap-1 sm:gap-2 hover:border-primary transition-all hover:-translate-y-1 text-[11px] sm:text-sm whitespace-nowrap">
            Contact Us <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </Link>
        </div>
      </main>

      <WelcomeTicker />

      {/* About Us Section */}
      <AboutSection />
      {/* Top Right Login Dropdown */}

      {/* Mission and Vision Section */}
      <MissionVisionSection />

      {/* Project Overview Section */}
      <ProjectOverviewSection />

      {/* Dynamic Programmes Section */}
      <ProgrammeSection />

      {/* Dietitian Section */}
      <DietitianSection />

      <OurMemories />

      <MediaCoverageSection />

      <LocationSection />

      <WhatsAppButton />


    </div>
  );
}
