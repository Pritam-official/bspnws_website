"use client";

import React from "react";
import Link from "next/link";

export default function AnnualReportsPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-12 border border-gray-100">
          <div className="bg-primary/5 p-12 text-center relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -ml-32 -mb-32"></div>
            
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 relative z-10">
              Annual <span className="text-primary italic">Reports</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed relative z-10">
              Transparency and accountability are our core values. Explore our detailed annual activity and financial reports here.
            </p>
          </div>
          
          <div className="p-12 text-center text-gray-500">
             <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
               <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
               </svg>
             </div>
             <p className="text-lg font-bold mb-2">Reports Coming Soon</p>
             <p className="text-sm">We are currently compiling our latest reports. Please check back later.</p>
             <Link href="/" className="mt-8 inline-block text-primary font-bold hover:underline">Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
