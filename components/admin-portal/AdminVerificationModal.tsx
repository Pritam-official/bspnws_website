"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface AdminVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminCode: string;
}

export default function AdminVerificationModal({ isOpen, onClose, adminCode }: AdminVerificationModalProps) {
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode === adminCode) {
      setIsVerified(true);
      setError(false);
    } else {
      setError(true);
      // Shake effect or similar
      setTimeout(() => setError(false), 500);
    }
  };

  const handleNavigate = (path: string) => {
    onClose();
    router.push(path);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className={`relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden transition-all duration-500 transform ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        {/* Header/Banner */}
        <div className="h-32 bg-purple-600 relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 opacity-10">
             <Image src="/logo.jpg" alt="Pattern" fill className="object-cover" />
          </div>
          <div className="relative z-10 w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
            <svg className="w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
          </div>
        </div>

        <div className="p-8 pb-10">
          {!isVerified ? (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-black text-gray-900 mb-3">Administrator Access</h2>
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl">
                  <p className="text-sm font-bold text-red-700 leading-relaxed italic">
                    "The unique code must be entered by the verified administrator only. Unauthorized attempts are not permitted."
                  </p>
                </div>
              </div>

              <form onSubmit={handleVerify} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Enter Security Code</label>
                  <input
                    type="password"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className={`w-full bg-gray-50 border-2 rounded-2xl px-6 py-4 text-center text-lg font-black tracking-[0.5em] focus:outline-none transition-all duration-300 ${error ? 'border-red-500 animate-shake' : 'border-transparent focus:border-purple-600/20 focus:bg-white'}`}
                    placeholder="••••••"
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-purple-600/20 hover:shadow-purple-600/30 transition-all duration-300 transform active:scale-[0.98] uppercase tracking-widest text-sm"
                >
                  Verify Access
                </button>
                
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full text-gray-400 font-bold py-2 text-xs hover:text-gray-600 transition-colors uppercase tracking-widest"
                >
                  Cancel
                </button>
              </form>
            </>
          ) : (
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Access Granted</h2>
              <p className="text-gray-500 font-medium mb-8">Choose your destination</p>
              
              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => handleNavigate('/login/admin')}
                  className="flex items-center justify-between bg-purple-600 hover:bg-purple-700 text-white p-5 rounded-2xl transition-all group shadow-lg shadow-purple-600/20"
                >
                  <div className="text-left">
                    <span className="block text-xs font-black uppercase tracking-widest opacity-80">Already a Member</span>
                    <span className="text-lg font-black">Login to Portal</span>
                  </div>
                  <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>

                <button
                  onClick={() => handleNavigate('/signup/admin')}
                  className="flex items-center justify-between border-2 border-gray-100 hover:border-purple-600 text-gray-900 p-5 rounded-2xl transition-all group"
                >
                  <div className="text-left">
                    <span className="block text-xs font-black uppercase tracking-widest text-gray-400">Join Leadership</span>
                    <span className="text-lg font-black">Create Account</span>
                  </div>
                  <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          50% { transform: translateX(8px); }
          75% { transform: translateX(-8px); }
        }
        .animate-shake {
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
