"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function AdminSignupPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        membershipCode: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validate Membership Code: BSPNWS_ADM_(last 4 digits of phone)
        const lastFourDigits = formData.phone.slice(-4);
        const expectedCode = `BSPNWS_ADM_${lastFourDigits}`;

        if (formData.membershipCode !== expectedCode) {
            setError('Please enter a valid administrator membership code.');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, role: 'admin' })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            // Save basic data for UI
            const combinedData = {
                ...formData,
                name: `${formData.firstName} ${formData.lastName}`,
                profileImage: '/logo.jpg',
                role: 'admin',
                signupDate: new Date().toLocaleDateString('en-GB')
            };
            localStorage.setItem('admin_data', JSON.stringify(combinedData));

            // Redirect to dashboard
            router.push('/admin/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
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
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            </Link>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 xl:gap-24">

                {/* Left Side: Illustration / Image Card */}
                <div className="hidden lg:flex flex-1 relative group w-full max-w-[550px] aspect-square">
                    <div className="absolute inset-0 bg-purple-600/5 rounded-[48px] blur-3xl group-hover:bg-purple-600/10 transition-all duration-700"></div>
                    <div className="relative w-full h-full rounded-[48px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-[12px] border-white group-hover:scale-[1.01] transition-transform duration-500">
                        <Image
                            src="/showcase-plants.jpg"
                            alt="Admin Onboarding"
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
                            <h2 className="text-4xl font-black leading-tight mb-4 drop-shadow-lg">Administrator Onboarding</h2>
                            <p className="text-lg font-medium opacity-90 drop-shadow-md">Step into leadership and help manage our growing community society.</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Signup Form */}
                <div className="flex-1 w-full max-w-[500px]">
                    <div className="bg-white/80 backdrop-blur-3xl border border-white/60 rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-8 md:p-14 relative overflow-hidden group">
                        {/* Header */}
                        <div className="relative z-10 text-center mb-8">
                            <h1 className="text-3xl font-black text-gray-900 mb-2">Create Admin Account</h1>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Verify your credentials</p>
                            {error && (
                                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-xl animate-shake">
                                    {error}
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50/50 border border-transparent rounded-[20px] px-5 py-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white focus:border-purple-600/10 transition-all duration-300"
                                        placeholder="First name"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50/50 border border-transparent rounded-[20px] px-5 py-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white focus:border-purple-600/10 transition-all duration-300"
                                        placeholder="Last name"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50/50 border border-transparent rounded-[20px] px-6 py-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white focus:border-purple-600/10 transition-all duration-300"
                                    placeholder="example@gmail.com"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50/50 border border-transparent rounded-[20px] px-6 py-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white focus:border-purple-600/10 transition-all duration-300"
                                        placeholder="+91-0000000000"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Admin Code</label>
                                    <input
                                        type="text"
                                        name="membershipCode"
                                        value={formData.membershipCode}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50/50 border border-transparent rounded-[20px] px-6 py-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white focus:border-purple-600/10 transition-all duration-300"
                                        placeholder="Admin code"
                                        required
                                        autoComplete="off"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Password</label>
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-[10px] font-black text-purple-600 uppercase tracking-widest hover:text-purple-700"
                                    >
                                        {showPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50/50 border border-transparent rounded-[20px] px-6 py-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white focus:border-purple-600/10 transition-all duration-300"
                                        placeholder="••••••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full bg-purple-600 hover:bg-purple-700 text-white font-black py-5 rounded-[20px] shadow-[0_12px_24px_-8px_rgba(147,51,234,0.3)] hover:shadow-[0_20px_40px_-12px_rgba(147,51,234,0.4)] transition-all duration-300 transform active:scale-[0.98] text-lg uppercase tracking-widest mt-4 flex items-center justify-center gap-3 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading && (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                {loading ? 'Creating Account...' : 'Sign Up'}
                            </button>
                        </form>

                        <div className="mt-10 text-center">
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                                Authorized Personnel Only
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
