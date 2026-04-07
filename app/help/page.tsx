import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HelpUsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px] w-full bg-primary/95 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src="/donate-hands-v2.png"
            alt="Helping Hands"
            fill
            className="object-cover opacity-60 mix-blend-multiply"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-6 h-full flex flex-col justify-center relative z-10">
          <h1 className="text-4xl md:text-7xl font-black text-white mb-4 tracking-tight">
            HELP US
          </h1>
          <div className="flex items-center text-white/80 text-sm md:text-base font-medium space-x-2">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>»</span>
            <span className="text-white">Help Us</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

            {/* Left Column: Introduction & Bank Details */}
            <div className="lg:col-span-7 space-y-16">
              <div className="relative">
                <div className="absolute -left-6 top-0 w-1 h-20 bg-primary/20 rounded-full hidden md:block"></div>
                <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs mb-4 block">Make a Difference</span>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 leading-[1.1]">
                  Support Our <span className="text-primary">Humanitarian</span> Cause
                </h2>
                <p className="text-slate-600 text-lg leading-relaxed max-w-2xl">
                  Your contribution fuels our mission to provide nutrition, education, and healthcare to those who need it most. Together, we can build a more resilient and compassionate community.
                </p>
              </div>

              {/* Square Metallic Gradient Border Wrapper */}
              <div className="relative p-[10px] bg-gradient-to-br from-[#083344] via-[#22d3ee] to-[#083344] shadow-[0_30px_70px_rgba(8,51,68,0.2)]">
                {/* Bank Transfer Details Card (Sharp Square) */}
                <div className="bg-white rounded-none overflow-hidden group">
                  {/* Card Header */}
                  <div className="px-10 py-10 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-[#e07b46] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-orange-200/50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-[28px] font-black text-[#1e293b] leading-none mb-2">Direct Bank Transfer</h3>
                        <p className="text-sm text-slate-400 font-medium">Official society account details</p>
                      </div>
                    </div>
                    <div className="hidden sm:block">
                      <span className="bg-[#e8fbf2] text-[#22c55e] text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest border border-[#d1f5e6]">Secure Payment</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-10 space-y-8">
                    <div className="space-y-6">
                      <div className="relative">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 px-1">Beneficiary Account Name</p>
                        <div className="bg-[#fffbfb] rounded-2xl p-8 border border-[#feedeb] transition-all hover:bg-white hover:border-orange-200">
                          <p className="font-black text-[#1e293b] text-2xl leading-[1.2]">
                            Burdwan Sadar Pyara Nutrition Welfare Society
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 px-1">Bank Institution</p>
                          <div className="bg-[#fffbfb] rounded-2xl p-7 border border-[#feedeb] transition-all hover:bg-white hover:border-orange-200">
                            <p className="font-extrabold text-[#1e293b] text-lg uppercase tracking-tight">Punjab National Bank</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 px-1">IFSC Banking Code</p>
                          <div className="bg-[#fffbfb] rounded-2xl p-7 border border-[#feedeb] transition-all hover:bg-white hover:border-orange-200">
                            <p className="font-mono font-black text-[#e07b46] text-2xl uppercase tracking-widest">PUNB0873400</p>
                          </div>
                        </div>
                      </div>

                      <div className="relative pt-6">
                        <div className="absolute top-3 left-8 bg-[#0f172a] px-5 py-1.5 rounded-[10px] z-10">
                          <p className="text-[9px] font-black text-white uppercase tracking-[0.25em]">Account Number</p>
                        </div>
                        <div className="bg-[#fffbfb] rounded-2xl p-7 border border-[#feedeb] transition-all hover:bg-white hover:border-orange-200">
                          <p className="relative font-mono text-3xl md:text-5xl font-black text-[#0f172a] text-center tracking-[0.15em] md:tracking-[0.10em]">
                            8734002100002391
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Visuals & QR Code */}
            <div className="lg:col-span-5 space-y-12">
              {/* Refined Banner Frame */}
              <div className="relative group">
                <div className="absolute -inset-4 bg-primary/5 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative bg-white p-4 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-slate-100 overflow-hidden transform transition-all duration-700 hover:-translate-y-2">
                  <div className="aspect-[3/4] rounded-[2rem] overflow-hidden relative shadow-inner">
                    <Image
                      src="/pnws-banner.png"
                      alt="PNWS Impact Banner"
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  </div>
                  <div className="pt-6 pb-2 px-4 text-center">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Our Mission</p>
                    <p className="text-slate-900 font-extrabold text-lg italic">"Nourishing Lives, Building Futures"</p>
                  </div>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="bg-slate-900 rounded-[2.5rem] p-10 text-center relative overflow-hidden group shadow-2xl shadow-slate-200">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 blur-[100px]"></div>

                <span className="inline-block bg-primary/20 text-primary text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-6">Internal Secure Payment</span>
                <h3 className="text-xl font-bold text-white mb-8">Scan QR for Quick UPI</h3>

                <div className="max-w-[240px] mx-auto bg-white p-3 rounded-2xl shadow-xl transition-transform duration-500 group-hover:scale-[1.02]">
                  <Image
                    src="/donate-poster.jpg"
                    alt="Scan to Donate Poster"
                    width={400}
                    height={600}
                    className="w-full h-auto rounded-xl"
                  />
                </div>

                <div className="mt-8 flex items-center justify-center gap-3 text-slate-400 text-sm font-medium">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  Works with all BHIM UPI Apps
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
