"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function VolunteerForgotPasswordPage() {
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        console.log('Reset password attempt:', formData);
        // Add success redirect or alert here
        router.push('/login/volunteer');
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center bg-gray-50 overflow-hidden py-12">
            {/* Full Screen Logo Background */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/logo.jpg"
                    alt="Background"
                    fill
                    className="object-contain opacity-[0.8]"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/70 to-white/95"></div>
            </div>

            {/* Home Icon */}
            <Link
                href="/"
                className="absolute top-8 right-8 z-20 flex items-center justify-center w-12 h-12 bg-white/80 backdrop-blur-md border border-white/60 rounded-2xl shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 group"
                title="Go to Home"
            >
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            </Link>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 xl:gap-24">

                {/* Left Side: Illustration / Image Card */}
                <div className="hidden lg:flex flex-1 relative group w-full max-w-[550px] aspect-square">
                    <div className="absolute inset-0 bg-emerald-600/5 rounded-[48px] blur-3xl group-hover:bg-emerald-600/10 transition-all duration-700"></div>
                    <div className="relative w-full h-full rounded-[48px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-[12px] border-white group-hover:scale-[1.01] transition-transform duration-500">
                        <Image
                            src="/showcase-plants.jpg"
                            alt="Community Impact"
                            fill
                            className="object-cover"
                        />
                        {/* Branding Overlay */}
                        <div className="absolute top-10 left-10">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg">
                                    <Image src="/logo.jpg" alt="Logo" width={32} height={32} className="rounded-lg" />
                                </div>
                                <span className="text-2xl font-black text-white drop-shadow-md">BSPNWS</span>
                            </div>
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div className="absolute bottom-12 left-12 right-12 text-white">
                            <h2 className="text-4xl font-black leading-tight mb-4 drop-shadow-lg">Secure Your Legacy</h2>
                            <p className="text-lg font-medium opacity-90 drop-shadow-md">Keep your account safe and continue making an impact.</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Forgot Password Form */}
                <div className="flex-1 w-full max-w-[480px]">
                    <div className="bg-white/80 backdrop-blur-3xl border border-white/60 rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-8 md:p-14 relative overflow-hidden group">
                        {/* Header */}
                        <div className="relative z-10 text-center mb-10">
                            <h1 className="text-3xl font-black text-gray-900 mb-2">Reset Password</h1>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Security Control</p>
                        </div>

                        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50/50 border border-transparent rounded-[20px] px-6 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-emerald-600/5 focus:bg-white focus:border-emerald-600/10 transition-all duration-300"
                                        placeholder="••••••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-emerald-600 transition-colors"
                                    >
                                        {showNewPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268-2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Confirm Password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50/50 border border-transparent rounded-[20px] px-6 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-emerald-600/5 focus:bg-white focus:border-emerald-600/10 transition-all duration-300"
                                        placeholder="••••••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-emerald-600 transition-colors"
                                    >
                                        {showConfirmPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268-2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 rounded-[20px] shadow-[0_12px_24px_-8px_rgba(5,150,105,0.3)] hover:shadow-[0_20px_40px_-12px_rgba(5,150,105,0.4)] transition-all duration-300 transform active:scale-[0.98] text-lg uppercase tracking-widest mt-4"
                            >
                                Reset Password
                            </button>
                        </form>

                        <div className="mt-10 text-center">
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                                Remember your password?{' '}
                                <Link href="/login/volunteer" className="text-emerald-600 hover:text-emerald-700 transition-colors border-b-2 border-transparent hover:border-emerald-600 pb-0.5">
                                    Login
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
