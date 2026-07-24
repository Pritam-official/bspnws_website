"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export type PromoVariant = "birthday" | "nutrition" | "volunteer";

interface PromoAdBannerProps {
  variant?: PromoVariant;
  className?: string;
  targetUrl?: string;
}

export default function PromoAdBanner({ variant = "birthday", className = "", targetUrl = "/donate" }: PromoAdBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  if (variant === "birthday") {
    return (
      <div className={`container mx-auto px-4 my-8 md:my-14 ${className}`}>
        <div className="relative border-2 md:border-[3.5px] border-[#FF5722] rounded-2xl md:rounded-[2rem] p-4 sm:p-6 md:p-8 lg:p-10 shadow-[0_16px_50px_rgba(255,87,34,0.2)] overflow-hidden group transition-all duration-500 hover:shadow-[0_24px_60px_rgba(255,87,34,0.3)]">
          {/* Background Image with High-Contrast Dark Gradient Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/birthday_ad_elderly.jpg"
              alt="Elderly Meal Drive Beneficiaries"
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 brightness-95"
              priority
            />
            {/* Dark Gradient Overlay for 100% sharp text legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-950/90 via-black/70 to-black/85 md:from-orange-950/85 md:via-black/65 md:to-black/85"></div>
          </div>

          {/* Dismiss (X) Button */}
          <button
            onClick={() => setDismissed(true)}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 w-7 h-7 sm:w-9 sm:h-9 bg-black/50 hover:bg-red-500 text-white rounded-full flex items-center justify-center backdrop-blur-md border border-white/30 transition-colors z-20 shadow-md"
            title="Dismiss Ad"
            aria-label="Dismiss Advertisement"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Foreground Content */}
          <div className="relative z-10 flex flex-col lg:flex-row items-stretch justify-between gap-6 lg:gap-8">
            {/* Left Content Area */}
            <div className="w-full lg:w-[48%] flex flex-col items-start text-left">
              <div className="text-white font-black text-2xl sm:text-4xl md:text-5xl lg:text-5xl italic uppercase tracking-wider mb-2 md:mb-3 drop-shadow-[0_3px_6px_rgba(0,0,0,0.9)]">
                COMING....
              </div>

              {/* Orange Highlight Box */}
              <div className="bg-[#FF5722] text-white font-black text-base sm:text-2xl md:text-3xl lg:text-3xl px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-md md:rounded-lg shadow-xl tracking-tight uppercase inline-block mb-3 sm:mb-4 border border-orange-400/50">
                BIRTHDAY OR ANNIVERSARY ??
              </div>

              <p className="text-amber-100 font-serif italic text-base sm:text-xl md:text-2xl lg:text-2xl mt-1 tracking-wide leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                Turn Your Special Day into Someone&apos;s Smile!
              </p>
            </div>

            {/* Right Content Area: Checklist + CTA & Graphic */}
            <div className="w-full lg:w-[52%] flex flex-col justify-between items-start lg:items-end gap-5">
              {/* Checklist with Translucent High-Contrast Backdrop */}
              <div className="w-full bg-black/45 backdrop-blur-md p-3.5 sm:p-5 rounded-2xl border border-white/15 shadow-xl">
                <ul className="space-y-2.5 sm:space-y-3 text-left w-full">
                  {[
                    "Get photographic proof with your Name & Picture.",
                    "Brief report detailing what was done, who benefited, and how.",
                    "Shout-out on our official page celebrating your act of kindness.",
                    "Digital or printed certificate as a token of appreciation.",
                    "Heartfelt message from beneficiaries."
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm md:text-base font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] leading-snug">
                      <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-emerald-400 bg-emerald-500 text-white flex items-center justify-center mt-0.5 shadow-md">
                        <svg className="w-3.5 h-3.5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom CTA Row with Cake Illustration */}
              <div className="flex flex-wrap sm:flex-nowrap items-center justify-between lg:justify-end gap-4 w-full pt-3 sm:pt-4 border-t border-white/20">
                <Link
                  href={targetUrl}
                  className="bg-gradient-to-r from-[#FF5722] to-[#E64A19] text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-black text-sm sm:text-base tracking-wide flex items-center gap-2 hover:opacity-95 hover:scale-105 transition-all shadow-xl shadow-[#FF5722]/40 group"
                >
                  <span>DONATE NOW</span>
                  <span className="text-lg group-hover:scale-125 transition-transform">💖</span>
                </Link>

                {/* Cake Graphic Illustration */}
                <div className="flex items-center gap-2 bg-orange-950/70 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 shadow-lg">
                  <div className="text-3xl sm:text-4xl animate-bounce">🎂</div>
                  <div className="text-left">
                    <span className="block text-[10px] uppercase tracking-widest font-black text-amber-300">Celebrate</span>
                    <span className="block text-xs font-bold text-white">With Purpose</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "nutrition") {
    return (
      <div className={`container mx-auto px-4 my-8 md:my-14 ${className}`}>
        <div className="relative border-2 md:border-[3.5px] border-emerald-500 rounded-2xl md:rounded-[2rem] p-4 sm:p-6 md:p-8 lg:p-10 shadow-[0_16px_50px_rgba(5,150,105,0.25)] overflow-hidden group transition-all duration-500 hover:shadow-[0_24px_60px_rgba(5,150,105,0.35)]">
          {/* Background Image with Dark Overlay Gradients */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/nutrition_ad_children.jpg"
              alt="Nutrition Drive Children"
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 brightness-95"
              priority
            />
            {/* Dual Overlay Gradients for maximum text readability and photo atmosphere */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-950/85 to-black/75 md:from-emerald-950/90 md:via-emerald-950/75 md:to-black/60"></div>
          </div>

          {/* Dismiss (X) Button */}
          <button
            onClick={() => setDismissed(true)}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 w-7 h-7 sm:w-9 sm:h-9 bg-white/20 hover:bg-red-500 text-white rounded-full flex items-center justify-center backdrop-blur-md border border-white/30 transition-colors z-20 shadow-md"
            title="Dismiss Ad"
            aria-label="Dismiss Advertisement"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Foreground Content */}
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10">
            {/* Left Content Area */}
            <div className="w-full lg:w-[48%] flex flex-col items-start text-left">
              <div className="text-white font-black text-2xl sm:text-4xl md:text-5xl lg:text-5xl italic uppercase tracking-wider mb-2 md:mb-3 drop-shadow-md">
                URGENT APPEAL....
              </div>

              {/* Highlight Box */}
              <div className="bg-emerald-500 text-white font-black text-base sm:text-2xl md:text-3xl lg:text-3xl px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-md md:rounded-lg shadow-xl tracking-tight uppercase inline-block mb-3 sm:mb-4 border border-emerald-400/50">
                NO ONE GOES HUNGRY !!
              </div>

              <p className="text-emerald-100 font-serif italic text-base sm:text-xl md:text-2xl lg:text-2xl mt-1 tracking-wide leading-snug drop-shadow">
                Sponsor Nutritious Meals for Underprivileged Children Today!
              </p>
            </div>

            {/* Right Content Area: Checklist + CTA & Graphic */}
            <div className="w-full lg:w-[52%] flex flex-col justify-between items-start lg:items-end gap-5">
              {/* Checklist with Translucent High-Contrast Backdrop */}
              <div className="w-full bg-black/45 backdrop-blur-md p-3.5 sm:p-5 rounded-2xl border border-white/15 shadow-xl">
                <ul className="space-y-2.5 sm:space-y-3 text-left w-full">
                  {[
                    "100% direct nutrition kit delivery to malnourished children.",
                    "Dietitian-approved fresh, hygienic meal preparations.",
                    "Complete photographic proof & live distribution updates.",
                    "Digital certificate of appreciation for all sponsors.",
                    "Direct impact report detailing health improvement milestones."
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm md:text-base font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] leading-snug">
                      <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-emerald-400 bg-emerald-500 text-white flex items-center justify-center mt-0.5 shadow-md">
                        <svg className="w-3.5 h-3.5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom CTA Row */}
              <div className="flex flex-wrap sm:flex-nowrap items-center justify-between lg:justify-end gap-4 w-full pt-3 sm:pt-4 border-t border-white/20">
                <Link
                  href={targetUrl}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-black text-sm sm:text-base tracking-wide flex items-center gap-2 hover:opacity-95 hover:scale-105 transition-all shadow-xl shadow-emerald-500/40 group"
                >
                  <span>SPONSOR A MEAL</span>
                  <span className="text-lg group-hover:scale-125 transition-transform">🍲</span>
                </Link>

                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 shadow-lg">
                  <div className="text-3xl sm:text-4xl animate-pulse">🍏</div>
                  <div className="text-left">
                    <span className="block text-[10px] uppercase tracking-widest font-black text-emerald-300">Zero Hunger</span>
                    <span className="block text-xs font-bold text-white">Direct Impact</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // variant === "volunteer"
  return (
    <div className={`container mx-auto px-4 my-8 md:my-14 ${className}`}>
      <div className="relative border-2 md:border-[3.5px] border-amber-500 rounded-2xl md:rounded-[2rem] p-4 sm:p-6 md:p-8 lg:p-10 shadow-[0_16px_50px_rgba(245,158,11,0.2)] overflow-hidden group transition-all duration-500 hover:shadow-[0_24px_60px_rgba(245,158,11,0.3)]">
        {/* Background Image with Dark Overlay Gradients */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/volunteer_ad_group.jpg"
            alt="BSP Volunteer Group"
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 brightness-95"
            priority
          />
          {/* Dual Overlay Gradients for maximum text readability and photo atmosphere */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-950/95 via-amber-950/85 to-black/75 md:from-amber-950/90 md:via-amber-950/75 md:to-black/60"></div>
        </div>

        {/* Dismiss (X) Button */}
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 w-7 h-7 sm:w-9 sm:h-9 bg-black/50 hover:bg-red-500 text-white rounded-full flex items-center justify-center backdrop-blur-md border border-white/30 transition-colors z-20 shadow-md"
          title="Dismiss Ad"
          aria-label="Dismiss Advertisement"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10">
          {/* Left Content Area */}
          <div className="w-full lg:w-[48%] flex flex-col items-start text-left">
            <div className="text-white font-black text-2xl sm:text-4xl md:text-5xl lg:text-5xl italic uppercase tracking-wider mb-2 md:mb-3 drop-shadow-md">
              BE A HERO....
            </div>

            {/* Highlight Box */}
            <div className="bg-amber-500 text-white font-black text-base sm:text-2xl md:text-3xl lg:text-3xl px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-md md:rounded-lg shadow-xl tracking-tight uppercase inline-block mb-3 sm:mb-4 border border-amber-400/50">
              JOIN OUR VOLUNTEER FAMILY !!
            </div>

            <p className="text-amber-100 font-serif italic text-base sm:text-xl md:text-2xl lg:text-2xl mt-1 tracking-wide leading-snug drop-shadow">
              Transform Lives & Drive Health Awareness in Burdwan District!
            </p>
          </div>

          {/* Right Content Area: Checklist + CTA & Graphic */}
          <div className="w-full lg:w-[52%] flex flex-col justify-between items-start lg:items-end gap-5">
            {/* Checklist with Translucent High-Contrast Backdrop */}
            <div className="w-full bg-black/45 backdrop-blur-md p-3.5 sm:p-5 rounded-2xl border border-white/15 shadow-xl">
              <ul className="space-y-2.5 sm:space-y-3 text-left w-full">
                {[
                  "Flexible weekend community outreach & meal distribution drives.",
                  "Official volunteer ID card & leadership recognition certificate.",
                  "Hands-on experience in public health & nutrition awareness.",
                  "Direct opportunity to manage district-level social events.",
                  "Join a network of passionate changemakers making real impact."
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm md:text-base font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] leading-snug">
                    <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-amber-400 bg-amber-500 text-white flex items-center justify-center mt-0.5 shadow-md">
                      <svg className="w-3.5 h-3.5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom CTA Row */}
            <div className="flex flex-wrap sm:flex-nowrap items-center justify-between lg:justify-end gap-4 w-full pt-3 sm:pt-4 border-t border-white/20">
              <Link
                href="/volunteers/become"
                className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-black text-sm sm:text-base tracking-wide flex items-center gap-2 hover:opacity-95 hover:scale-105 transition-all shadow-xl shadow-amber-500/40 group"
              >
                <span>JOIN AS VOLUNTEER</span>
                <span className="text-lg group-hover:scale-125 transition-transform">🤝</span>
              </Link>

              <div className="flex items-center gap-2 bg-amber-950/70 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 shadow-lg">
                <div className="text-3xl sm:text-4xl animate-bounce">🌟</div>
                <div className="text-left">
                  <span className="block text-[10px] uppercase tracking-widest font-black text-amber-300">Be The Change</span>
                  <span className="block text-xs font-bold text-white">Apply Today</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
