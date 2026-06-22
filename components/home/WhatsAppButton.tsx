"use client";

import React, { useState, useEffect } from "react";

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasNewMessageBadge, setHasNewMessageBadge] = useState(false);

  useEffect(() => {
    // Reveal button with a delay for entry effect
    const revealTimer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    // Show custom chat notification bubble after another delay
    const tooltipTimer = setTimeout(() => {
      const isDismissed = sessionStorage.getItem("wa_tooltip_dismissed");
      if (!isDismissed) {
        setShowTooltip(true);
        setHasNewMessageBadge(true);
      }
    }, 2500);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(tooltipTimer);
    };
  }, []);

  const handleDismissTooltip = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowTooltip(false);
    sessionStorage.setItem("wa_tooltip_dismissed", "true");
  };

  const handleClickButton = () => {
    setHasNewMessageBadge(false);
    setShowTooltip(false);
    sessionStorage.setItem("wa_tooltip_dismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-3 font-sans select-none pointer-events-none">
      {/* Interactive Chat Bubble Notification */}
      {showTooltip && (
        <div className="bg-white text-gray-800 p-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-gray-100 flex items-start gap-3 max-w-[280px] animate-fade-in-up pointer-events-auto relative">
          {/* Green active dot */}
          <span className="flex h-3.5 w-3.5 relative mt-0.5 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
          </span>

          <div className="flex-grow text-xs leading-relaxed">
            <div className="flex justify-between items-center mb-1">
              <span className="font-extrabold text-emerald-600 tracking-wide uppercase text-[9px]">BSPNWS Support</span>
              <span className="text-[9px] text-gray-400">Just now</span>
            </div>
            <p className="font-semibold text-gray-700">
              Welcome to BSPNWS! Need help or want to connect? Let&apos;s chat on WhatsApp.
            </p>
          </div>

          <button
            onClick={handleDismissTooltip}
            className="text-gray-400 hover:text-gray-600 p-0.5 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
            aria-label="Dismiss chat notification"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {/* Chat Bubble Tail */}
          <div className="absolute right-6 -bottom-1.5 w-3 h-3 bg-white border-r border-b border-gray-100 transform rotate-45"></div>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href="https://wa.me/7866022053?text=Hello!%20I%20would%20like%20to%20know%20more%20about%20BSPNWS%20and%20its%20welfare%20activities."
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClickButton}
        className="group relative flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] rounded-full shadow-[0_6px_20px_rgba(37,211,102,0.4)] hover:shadow-[0_8px_28px_rgba(37,211,102,0.6)] text-white transition-all duration-300 hover:scale-110 active:scale-95 pointer-events-auto"
        aria-label="Chat with us on WhatsApp"
      >
        {/* Pulsing Outer Glow Effect */}
        <span className="absolute -inset-1.5 rounded-full bg-[#25D366]/30 animate-ping opacity-75 group-hover:hidden"></span>

        {/* Unread message badge indicator */}
        {hasNewMessageBadge && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white shadow-md animate-bounce">
            1
          </span>
        )}

        {/* WhatsApp Official Logo SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          fill="currentColor"
          className="w-7 h-7 transition-transform duration-300 group-hover:rotate-12"
        >
          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 508l146.2-38.3c32.5 17.7 68.9 27 106.3 27 122.4 0 222-99.6 222-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-86.8 22.8 23.1-84.7-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
        </svg>

        {/* Hover Label Tooltip */}
        <span className="absolute right-16 scale-0 group-hover:scale-100 bg-[#1f2937] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-md transition-all duration-200 origin-right whitespace-nowrap opacity-0 group-hover:opacity-100">
          Chat on WhatsApp
        </span>
      </a>
    </div>
  );
}
