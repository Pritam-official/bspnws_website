import React from 'react';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-900 p-8">
      <h1 className="text-4xl font-black text-primary mb-4 uppercase">Coming Soon</h1>
      <p className="text-xl text-gray-600 mb-8">This page is currently under construction.</p>
      <Link href="/" className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-green-600 transition-all shadow-xl shadow-primary/20">
        Back to Home
      </Link>
    </div>
  );
}
