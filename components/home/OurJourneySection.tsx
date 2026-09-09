"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Sparkles, Flag, Calendar, Heart, Trophy, Compass, Landmark, ShieldCheck } from "lucide-react";

interface Milestone {
  year: number;
  title: string;
  milestones: string[];
  icon: React.ComponentType<any>;
}

const milestoneData: Milestone[] = [
  {
    year: 2011,
    title: "Root Seeds Sown",
    milestones: ["First nutrition outreach initiative in Purba Bardhaman villages"],
    icon: Compass,
  },
  {
    year: 2012,
    title: "Maternal Health Support",
    milestones: ["Nutrition & wellness counseling camps launched for rural mothers"],
    icon: Heart,
  },
  {
    year: 2013,
    title: "School Hygiene Campaigns",
    milestones: ["Health and sanitation awareness campaigns inside local schools"],
    icon: Sparkles,
  },
  {
    year: 2014,
    title: "Malnutrition Initiatives",
    milestones: ["Malnutrition screening and baby health programs in under-served areas"],
    icon: Landmark,
  },
  {
    year: 2015,
    title: "Community Clinics",
    milestones: ["Established quarterly community health check-up camps"],
    icon: ShieldCheck,
  },
  {
    year: 2016,
    title: "Food Security Expansion",
    milestones: ["Structured food security and distribution drives during lean months"],
    icon: Compass,
  },
  {
    year: 2017,
    title: "Elderly Care Program",
    milestones: ["Initiated dedicated support campaigns for senior citizens"],
    icon: Heart,
  },
  {
    year: 2018,
    title: "Disaster Outreach",
    milestones: ["Organized massive winter blanket distribution & disaster relief"],
    icon: Sparkles,
  },
  {
    year: 2019,
    title: "Formation of Angikar Paribar",
    milestones: ["Formation of Angikar Paribar supporting marginalized children"],
    icon: Trophy,
  },
  {
    year: 2020,
    title: "Expanding PathShalas",
    milestones: ["Established Kolaldanga PathShala", "Established Patrasayer PathShala"],
    icon: Landmark,
  },
  {
    year: 2021,
    title: "Formal Trust Registration",
    milestones: ["Registered under formal Trust", "Dishari initiative launch", "Established Indas PathShala"],
    icon: ShieldCheck,
  },
  {
    year: 2022,
    title: "BSPNWS Official Reg.",
    milestones: ["Sibkunda PathShala established", "TechShala computer lab founded", "Official Society Act Registration (11 July 2022)"],
    icon: Heart,
  },
  {
    year: 2023,
    title: "GitaBitan Cultural Launch",
    milestones: ["GitaBitan cultural and learning academy established"],
    icon: Compass,
  },
  {
    year: 2024,
    title: "Banglar Danga PathShala",
    milestones: ["Established Banglar Danga PathShala for tribal community children"],
    icon: Trophy,
  },
  {
    year: 2025,
    title: "Digital Literacy Hubs",
    milestones: ["Launched mobile nutrition vans & virtual learning hubs"],
    icon: Sparkles,
  },
  {
    year: 2026,
    title: "Mobile Health Clinic Launch",
    milestones: ["Inauguration of fully-equipped mobile medical vans"],
    icon: ShieldCheck,
  },
];

// SVG Road geometry settings normalized to 1000 units
const totalLength = 1000;

const getDistanceForYear = (year: number) => {
  switch (year) {
    case 2011: return 17;
    case 2012: return 74;
    case 2013: return 131;
    case 2014: return 188;
    case 2015: return 277;
    case 2016: return 334;
    case 2017: return 391;
    case 2018: return 448;
    case 2019: return 531;
    case 2020: return 588;
    case 2021: return 645;
    case 2022: return 702;
    case 2023: return 782;
    case 2024: return 839;
    case 2025: return 896;
    case 2026: return 953;
    default: return totalLength;
  }
};

const pinCoords: Record<number, { x: number; y: number; pointsUp: boolean; colorClass: string }> = {
  2011: { x: 150, y: 100, pointsUp: false, colorClass: "text-emerald-700" },
  2012: { x: 380, y: 100, pointsUp: false, colorClass: "text-teal-700" },
  2013: { x: 610, y: 100, pointsUp: false, colorClass: "text-green-700" },
  2014: { x: 840, y: 100, pointsUp: false, colorClass: "text-lime-700" },
  
  2015: { x: 840, y: 250, pointsUp: true, colorClass: "text-emerald-600" },
  2016: { x: 610, y: 250, pointsUp: true, colorClass: "text-teal-600" },
  2017: { x: 380, y: 250, pointsUp: true, colorClass: "text-green-600" },
  2018: { x: 150, y: 250, pointsUp: true, colorClass: "text-lime-600" },
  
  2019: { x: 150, y: 400, pointsUp: false, colorClass: "text-emerald-800" },
  2020: { x: 380, y: 400, pointsUp: false, colorClass: "text-green-500" },
  2021: { x: 610, y: 400, pointsUp: false, colorClass: "text-lime-500" },
  2022: { x: 840, y: 400, pointsUp: false, colorClass: "text-emerald-500" },
  
  2023: { x: 840, y: 550, pointsUp: true, colorClass: "text-teal-800" },
  2024: { x: 610, y: 550, pointsUp: true, colorClass: "text-green-800" },
  2025: { x: 380, y: 550, pointsUp: true, colorClass: "text-lime-800" },
  2026: { x: 150, y: 550, pointsUp: true, colorClass: "text-emerald-900" },
};

const getPositionAtDistance = (d: number): { x: number; y: number } => {
  // Scale d from [0, 1000] to [0, 4066.857] SVG user space length
  let actualD = (d / 1000) * 4066.857;
  const arcLength = 235.619;
  
  // Row 1
  if (actualD <= 820) {
    return { x: 80 + actualD, y: 100 };
  }
  actualD -= 820;
  
  // Arc 1
  if (actualD <= arcLength) {
    const angle = -Math.PI / 2 + (actualD / arcLength) * Math.PI;
    return { x: 900 + 75 * Math.cos(angle), y: 175 + 75 * Math.sin(angle) };
  }
  actualD -= arcLength;
  
  // Row 2
  if (actualD <= 800) {
    return { x: 900 - actualD, y: 250 };
  }
  actualD -= 800;
  
  // Arc 2
  if (actualD <= arcLength) {
    const angle = -Math.PI / 2 - (actualD / arcLength) * Math.PI;
    return { x: 100 + 75 * Math.cos(angle), y: 325 + 75 * Math.sin(angle) };
  }
  actualD -= arcLength;
  
  // Row 3
  if (actualD <= 800) {
    return { x: 100 + actualD, y: 400 };
  }
  actualD -= 800;
  
  // Arc 3
  if (actualD <= arcLength) {
    const angle = -Math.PI / 2 + (actualD / arcLength) * Math.PI;
    return { x: 900 + 75 * Math.cos(angle), y: 475 + 75 * Math.sin(angle) };
  }
  actualD -= arcLength;
  
  // Row 4
  return { x: 900 - actualD, y: 550 };
};

export default function OurJourneySection() {
  const [activeYear, setActiveYear] = useState<number>(2026);
  const [currentDistance, setCurrentDistance] = useState<number>(953); // starts at 2026 distance (953/1000)

  useEffect(() => {
    let animationFrameId: number;
    let startTime: number | null = null;
    const startDistance = currentDistance;
    const targetDistance = getDistanceForYear(activeYear);
    const distanceDelta = targetDistance - startDistance;
    const duration = 850; // 850ms transition time

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      const nextDistance = startDistance + distanceDelta * easeProgress;
      setCurrentDistance(nextDistance);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [activeYear]);

  const { x, y } = getPositionAtDistance(currentDistance);
  const activeMobileIndex = milestoneData.findIndex(item => item.year === activeYear);

  return (
    <section className="py-20 sm:py-28 bg-[#fafafb] relative overflow-hidden select-none border-t border-gray-100">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#d1d5db_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.25]" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <span className="text-sm font-black tracking-[0.25em] text-primary uppercase bg-primary/10 px-4 py-1.5 rounded-full inline-block mb-3">
            Milestones & Impact
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-none mb-4">
            OUR <span className="text-primary">JOURNEY</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-emerald-500 mx-auto mt-6 rounded-full" />
        </div>

        {/* Desktop Serpentine Timeline (md and up) */}
        <div className="hidden md:block relative w-full max-w-[1100px] mx-auto aspect-[1100/680]">
          {/* SVG Road Layout */}
          <div className="absolute inset-0 w-full h-full">
            <svg
              viewBox="0 0 1000 680"
              className="w-full h-full"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="roadGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#dd7030" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>

              {/* Road Border (Yellow) */}
              <path
                d="M 80 100 L 900 100 A 75 75 0 0 1 900 250 L 100 250 A 75 75 0 0 0 100 400 L 900 400 A 75 75 0 0 1 900 550 L -40 550"
                stroke="#F5A623"
                strokeWidth="56"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Road Asphalt (Black/Dark Gray) */}
              <path
                d="M 80 100 L 900 100 A 75 75 0 0 1 900 250 L 100 250 A 75 75 0 0 0 100 400 L 900 400 A 75 75 0 0 1 900 550 L -40 550"
                stroke="#1C1C1E"
                strokeWidth="48"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Road White Dashes (Centerline) */}
              <path
                d="M 80 100 L 900 100 A 75 75 0 0 1 900 250 L 100 250 A 75 75 0 0 0 100 400 L 900 400 A 75 75 0 0 1 900 550 L -40 550"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeDasharray="10 14"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.7"
              />

              {/* Dynamic Glowing Trail on Hover */}
              <path
                d="M 80 100 L 900 100 A 75 75 0 0 1 900 250 L 100 250 A 75 75 0 0 0 100 400 L 900 400 A 75 75 0 0 1 900 550 L -40 550"
                stroke="url(#roadGlow)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength="1000"
                strokeDasharray="1000"
                strokeDashoffset={1000 - currentDistance}
                className="pointer-events-none"
              />
            </svg>
          </div>

          {/* START Gate Banner (Top Left) */}
          <div className="absolute left-[1%] top-[14.7%] -translate-y-1/2 flex items-center shadow-lg rounded-md overflow-hidden border-2 border-[#F5A623]">
            <div className="bg-black text-white py-2.5 px-3 flex flex-col items-center justify-center font-black tracking-widest text-[10px] w-9">
              <span>S</span>
              <span>T</span>
              <span>A</span>
              <span>R</span>
              <span>T</span>
            </div>
            <div className="w-5 h-11 bg-white flex flex-col justify-between p-0.5 border-l border-neutral-700 shrink-0">
              <div className="grid grid-cols-2 gap-0.5 h-full w-full">
                <div className="bg-black"></div><div className="bg-white"></div>
                <div className="bg-white"></div><div className="bg-black"></div>
                <div className="bg-black"></div><div className="bg-white"></div>
                <div className="bg-white"></div><div className="bg-black"></div>
                <div className="bg-black"></div><div className="bg-white"></div>
                <div className="bg-white"></div><div className="bg-black"></div>
              </div>
            </div>
          </div>

          {/* Society Logo moving along the road trail (Desktop) */}
          <div
            className="absolute z-40 pointer-events-none"
            style={{
              left: `${x / 10}%`,
              top: `${y / 6.8}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="relative w-11 h-11 rounded-full overflow-hidden border border-[#F5A623] shadow-md bg-white">
              <Image
                src="/logo.jpg"
                alt="BSPNWS Logo"
                fill
                className="object-cover"
                sizes="44px"
              />
            </div>
          </div>

          {/* Render Timeline Pins */}
          {milestoneData.map((item) => {
            const coord = pinCoords[item.year];
            if (!coord) return null;

            const isActive = activeYear === item.year;

            // Pin position formatting
            const pinStyle: React.CSSProperties = {
              left: `${coord.x / 10}%`,
              top: coord.pointsUp 
                ? `${coord.y / 6.8}%`
                : `${(coord.y - 58) / 6.8}%`,
              transform: "translateX(-50%)",
            };

            return (
              <div
                key={item.year}
                className="absolute z-30"
                style={pinStyle}
                onMouseEnter={() => setActiveYear(item.year)}
              >
                {/* Pin Teardrop Graphic */}
                <div className={`relative w-12 h-[58px] flex items-center justify-center cursor-pointer transition-all duration-350 ${coord.colorClass} ${isActive ? "scale-135" : ""}`}>
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 48 60"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`drop-shadow-md transition-transform duration-300 ${coord.pointsUp ? "rotate-180" : ""}`}
                  >
                    <path
                      d="M24 0C10.7452 0 0 10.7452 0 24C0 37.5 24 60 24 60C24 60 48 37.5 48 24C48 10.7452 37.2548 0 24 0Z"
                      fill="currentColor"
                    />
                  </svg>
                  {/* Pulsing ring inside pin bulb on hover */}
                  {isActive && (
                    <span className="absolute w-4 h-4 bg-white/25 rounded-full animate-ping pointer-events-none top-[16px] left-[14px]" />
                  )}
                  {/* Year Text inside pin */}
                  <span
                    className={`absolute text-[10.5px] font-black text-white tracking-tight pointer-events-none transition-transform duration-300 ${
                      isActive ? "scale-110" : ""
                    } ${
                      coord.pointsUp ? "bottom-[14px]" : "top-[14px]"
                    }`}
                  >
                    {item.year}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Vertical Timeline (below md) */}
        <div className="md:hidden relative w-full max-w-[120px] mx-auto h-[980px] flex flex-col items-center">
          {/* Vertical road strip in the center (extends at bottom to show infinite journey) */}
          <div className="absolute top-0 bottom-[-60px] w-8 bg-neutral-900 border-x-2 border-amber-500 rounded-full overflow-hidden">
            {/* White Dashed Centerline */}
            <div className="h-full w-0 border-r border-dashed border-white/60 mx-auto opacity-70" />
          </div>

          {/* Mobile START Checker */}
          <div className="absolute top-0 -translate-y-1/2 z-20 bg-black text-white text-[8px] font-black py-1.5 px-2 tracking-widest flex items-center justify-center rounded border border-[#F5A623] shadow-md select-none">
            START
          </div>

          {/* Society Logo moving along the road trail (Mobile) */}
          <div
            className="absolute z-40 transition-all duration-700 ease-out pointer-events-none"
            style={{
              left: "50%",
              top: `${((activeMobileIndex >= 0 ? activeMobileIndex : 15) / 15) * 90.2 + 4.9}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#F5A623] shadow-sm bg-white">
              <Image
                src="/logo.jpg"
                alt="BSPNWS Logo"
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
          </div>

          {/* Timeline Pins placed vertically down the road */}
          <div className="w-full flex flex-col justify-between py-12 absolute inset-0 z-10">
            {milestoneData.map((item) => {
              const coord = pinCoords[item.year];
              const isActive = activeYear === item.year;
              return (
                <div key={item.year} className="flex justify-center items-center h-10 my-1">
                  <div
                    onClick={() => setActiveYear(item.year)}
                    className={`relative w-8 h-[38px] ${coord?.colorClass || "text-emerald-700"} transition-all duration-300 ${isActive ? "scale-125" : ""}`}
                  >
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 48 60"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="drop-shadow-md"
                    >
                      <path
                        d="M24 0C10.7452 0 0 10.7452 0 24C0 37.5 24 60 24 60C24 60 48 37.5 48 24C48 10.7452 37.2548 0 24 0Z"
                        fill="currentColor"
                      />
                    </svg>
                    <span className="absolute top-[8px] left-1/2 -translate-x-1/2 text-[7.5px] font-black text-white tracking-tighter">
                      {item.year}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
