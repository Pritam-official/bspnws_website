"use client";

import React from "react";

const WelcomeTicker = () => {
    const message = "Welcome to Burdwan Sadar Pyara Nutrition Welfare Society";
    
    return (
        <div className="w-full bg-[#facc15] py-3 overflow-hidden border-y border-yellow-500/30 shadow-sm relative z-20">
            <div className="animate-marquee whitespace-nowrap flex items-center">
                {/* We repeat the message multiple times to ensure it covers the screen width and loops smoothly */}
                {[...Array(10)].map((_, i) => (
                    <span key={i} className="text-gray-900 font-black italic uppercase tracking-wider text-sm md:text-base mx-8 flex items-center gap-4">
                        <span className="w-2 h-2 bg-gray-900 rounded-full"></span>
                        {message}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default WelcomeTicker;
