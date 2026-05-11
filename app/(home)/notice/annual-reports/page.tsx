import React from 'react';
import Navbar from '@/components/shared/Navbar';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-grow flex flex-col items-center justify-center text-gray-900 p-4 sm:p-8">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-primary mb-4 uppercase">Coming Soon</h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8">This page is currently under construction.</p>
          <Link href="/" className="inline-block bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-green-600 transition-all shadow-xl shadow-primary/20">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
