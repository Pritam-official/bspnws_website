"use client";

import React from "react";
import Image from "next/image";

interface HonoraryMember {
  name: string;
  designation: string;
  image: string;
}

const honoraryMembers: HonoraryMember[] = [
  {
    name: "Dr. Subhas Chandra Dutta",
    designation: "President of India awardee Headmaster, Kanchan Nagar D N Das High School",
    image: "/images/honorary/subhas_chandra_dutta.jpg",
  },
  {
    name: "Dr. Tushar Kanti Mukhopadhyay",
    designation: "Assistant teacher, Hatgobindapur M.C High School",
    image: "/images/honorary/tushar_kanti_mukhopadhyay.png",
  },
  {
    name: "Ramshankar Mondal",
    designation: "DI&CO Purba Bardhaman",
    image: "/images/honorary/ramshankar_mondal.jpg",
  },
  {
    name: "Prasenjit Dutta",
    designation: "Reporter",
    image: "/images/honorary/prasenjit_dutta.jpg",
  },
];

export default function HonoraryMembers() {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50/50 to-white border-b border-gray-100 relative overflow-hidden" id="honorary-members">
      {/* Ambient Background Glows */}
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-secondary/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="text-xs font-bold tracking-[0.25em] uppercase text-primary/80 mb-3 block">
            Our Pillars of Inspiration
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight tracking-tight">
            Honorary Members
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-secondary mt-5 rounded-full mx-auto"></div>
        </div>

        {/* Members Grid Layout: 4 columns on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {honoraryMembers.map((member, index) => {
            const isActive = activeIndex === index;
            return (
              <div
                key={index}
                onClick={() => setActiveIndex(prev => prev === index ? null : index)}
                className={`group bg-white rounded-2xl border transition-all duration-300 flex flex-col h-full overflow-hidden cursor-pointer ${isActive
                    ? "shadow-xl -translate-y-1.5 border-primary/30"
                    : "border-gray-100/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5"
                  }`}
              >
                {/* Premium Image Container */}
                <div className="relative h-80 overflow-hidden bg-gray-50 flex-shrink-0">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className={`object-cover object-top transition-transform duration-500 group-hover:scale-105 ${isActive ? "scale-105" : ""
                      }`}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    priority={index < 2}
                  />
                  {/* Visual Accent Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`} />

                  {/* Card Number Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-gray-800 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full shadow-sm border border-gray-100/50">
                    Member 0{index + 1}
                  </div>
                </div>

                {/* Information Block */}
                <div className="p-6 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className={`text-xl font-bold mb-2 leading-tight transition-colors duration-200 ${isActive ? "text-primary" : "text-gray-900 group-hover:text-primary"
                      }`}>
                      {member.name}
                    </h3>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-50">
                    <div className={`h-1 rounded-full mb-3 transition-all duration-300 ${isActive ? "w-16 bg-primary" : "w-8 bg-primary/20 group-hover:w-16 group-hover:bg-primary"
                      }`}></div>
                    <p className="text-sm text-gray-600 leading-relaxed font-medium">
                      {member.designation}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
