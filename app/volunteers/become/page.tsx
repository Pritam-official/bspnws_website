import React from 'react';
import Link from 'next/link';
import VolunteerForm from '@/components/VolunteerForm';
import { ChevronLeft } from 'lucide-react';

export default function BecomeVolunteerPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4 md:px-8 relative overflow-hidden">
      {/* Background blobs for premium feel */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -mr-64 -mt-64 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] -ml-40 -mb-40 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Back Button */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-bold uppercase tracking-widest text-[10px] mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Hero Section */}
        <div className="mb-16 text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-block px-4 py-1.5 bg-primary/10 rounded-full border border-primary/20">
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">Join the movement</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-[0.9] uppercase italic">
            Become a <br />
            <span className="text-primary drop-shadow-sm">Volunteer</span>
          </h1>
          <p className="text-gray-500 text-lg md:text-xl font-medium leading-relaxed">
            Your time and skills can change lives. Join our dedicated community of volunteers and help us bring positive impact to those who need it most.
          </p>
        </div>

        {/* Form Component */}
        <div className="animate-slide-up-fade">
          <VolunteerForm />
        </div>

        {/* Trust Footer */}
        <div className="mt-20 text-center space-y-6 opacity-60">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Trusted by communities worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 grayscale">
             {/* Use small logos or placeholders */}
             <div className="h-6 w-24 bg-gray-300 rounded-full"></div>
             <div className="h-6 w-32 bg-gray-300 rounded-full"></div>
             <div className="h-6 w-20 bg-gray-300 rounded-full"></div>
             <div className="h-6 w-28 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
