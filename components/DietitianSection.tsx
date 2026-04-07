"use client";

import React from "react";
import Image from "next/image";

// Inline SVG components for professional look without extra dependencies
const PhoneIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
  </svg>
);

const MailIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2"></line>
    <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2"></line>
    <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"></line>
  </svg>
);

// Fixed StarIcon component that accepts className
const StarIcon = ({ className = "" }) => (
  <svg className={`w-3 h-3 fill-current ${className}`} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const dietitians = [
  {
    name: "Laboni Bhattacharya",
    role: "Expert Dietitian",
    experience: "Intern of Kolkata Apollo Hospital",
    image: "/laboni_dietitian.jpeg",
    phone: "9641767736",
    email: "laboni2002@gmail.com",
    specialization: "Weight Management",
    education: "M.Sc. Nutrition",
    bgColor: "bg-gradient-to-br from-emerald-50/90 to-white",
    borderColor: "border-emerald-100",
    accentColor: "text-emerald-600",
    badgeColor: "bg-emerald-50 text-emerald-700",
    buttonColor: "hover:bg-emerald-50 border-emerald-200",
  },
  {
    name: "Ankita Sam",
    role: "Expert Dietitian",
    experience: "Intern of Kolkata Apollo Hospital",
    image: "/ankita_dietitan.jpeg",
    phone: "9641767736",
    email: "ankita2002@gmail.com",
    specialization: "Clinical Nutrition",
    education: "M.Sc. Nutrition",
    bgColor: "bg-gradient-to-br from-amber-50/90 to-white",
    borderColor: "border-amber-100",
    accentColor: "text-amber-600",
    badgeColor: "bg-amber-50 text-amber-700",
    buttonColor: "hover:bg-amber-50 border-amber-200",
  },
  {
    name: "Ayan Maji",
    role: "Expert Dietitian",
    experience: "Intern of Kolkata Apollo Hospital",
    image: "/ayan_dietitian.jpeg",
    phone: "9641767736",
    email: "ayan2002@gmail.com",
    specialization: "Sports Nutrition",
    education: "M.Sc. Nutrition",
    bgColor: "bg-gradient-to-br from-blue-50/90 to-white",
    borderColor: "border-blue-100",
    accentColor: "text-blue-600",
    badgeColor: "bg-blue-50 text-blue-700",
    buttonColor: "hover:bg-blue-50 border-blue-200",
  },
];

export default function DietitianSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white" id="dietitians">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-primary text-xs font-bold uppercase tracking-wider mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            Wellness Partner
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Meet Our Expert Dietitians
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Transform your lifestyle with personalized diet plans from certified professionals
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dietitians.map((dietitian, index) => (
            <div
              key={index}
              className={`group relative ${dietitian.bgColor} rounded-2xl border ${dietitian.borderColor} transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden`}
            >
              {/* Image Section */}
              <div className="relative h-56 overflow-hidden bg-gradient-to-b from-gray-100 to-gray-50">
                <Image
                  src={dietitian.image}
                  alt={dietitian.name}
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Badge */}
                <div className={`absolute top-3 right-3 ${dietitian.badgeColor} px-2 py-0.5 rounded-full text-[10px] font-semibold backdrop-blur-sm`}>
                  ⚡ Available Now
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="text-amber-400" />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">(128 reviews)</span>
                </div>

                {/* Name & Role */}
                <div className="mb-3">
                  <h3 className="text-xl font-bold text-gray-900 mb-0.5">
                    {dietitian.name}
                  </h3>
                  <p className="text-xs font-medium text-gray-500">
                    {dietitian.role}
                  </p>
                </div>

                {/* Specialization & Education */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${dietitian.badgeColor}`}>
                    🎓 {dietitian.education}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${dietitian.badgeColor}`}>
                    💡 {dietitian.specialization}
                  </span>
                </div>

                {/* Experience */}
                <div className="mb-4 p-2 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 text-center">
                    <span className="font-semibold">Experience:</span> {dietitian.experience}
                  </p>
                </div>

                {/* Contact Buttons */}
                <div className="space-y-2">
                  <a
                    href={`tel:${dietitian.phone}`}
                    className={`flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-white border ${dietitian.buttonColor} rounded-xl text-gray-700 text-sm font-semibold transition-all duration-200`}
                  >
                    <PhoneIcon />
                    <span>Call Now</span>
                  </a>
                  <a
                    href={`mailto:${dietitian.email}`}
                    className={`flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-white border ${dietitian.buttonColor} rounded-xl text-gray-700 text-sm font-semibold transition-all duration-200`}
                  >
                    <MailIcon />
                    <span>Email</span>
                  </a>
                </div>

                {/* Book Appointment */}
                <button className="w-full mt-3 py-2 bg-gray-900 hover:bg-gray-800 rounded-xl text-white text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2">
                  <CalendarIcon />
                  <span>Book Consultation</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="text-center mt-10">
          <p className="text-xs text-gray-400">
            All dietitians are certified professionals with minimum 3+ years of experience
          </p>
        </div>
      </div>
    </section>
  );
}