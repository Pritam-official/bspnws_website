"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import VolunteerSidebar from "@/components/volunteer-portal/VolunteerSidebar";
import VolunteerHeader from "@/components/volunteer-portal/VolunteerHeader";

export default function ContactAdminPage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [userData, setUserData] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    useEffect(() => {
        const storedData = localStorage.getItem('volunteer_data');
        if (storedData) {
            setUserData(JSON.parse(storedData));
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log("Form submitted:", formData);
        alert("Thank you for your message! We will get back to you soon.");
    };

    return (
        <div className="min-h-screen relative bg-gray-50 flex overflow-hidden">
            <VolunteerSidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

            <div className="flex-1 lg:ml-64 relative pb-20 overflow-y-auto">
                {/* Background Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-pink-600/5 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                {/* Navigation Header */}
                <VolunteerHeader userData={userData} setIsMobileMenuOpen={setIsMobileMenuOpen} />

                <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 space-y-12 animate-fade-in pb-24 lg:pb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Contact Information */}
                        <div className="space-y-10">
                            <div>
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4 sm:mb-6 leading-tight tracking-tight">
                                    Contact <span className="text-pink-600">Admin</span>
                                </h1>
                                <p className="text-base sm:text-xl text-gray-500 font-medium leading-relaxed">
                                    Have questions or need support? Reach out to the administration.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-6 p-8 bg-white rounded-[2.5rem] border border-gray-100 transition-all hover:border-pink-200 hover:shadow-2xl hover:shadow-pink-600/5 shadow-xl shadow-gray-200/50 group">
                                    <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600 shrink-0 group-hover:scale-110 transition-transform">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-black text-gray-900 text-lg mb-2">Visit Us</h3>
                                        <p className="text-gray-500 font-medium leading-relaxed text-sm">3 No Shankari Pukur PO. Sripally, East Burdwan, Pin-713103 W.B India</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 p-8 bg-white rounded-[2.5rem] border border-gray-100 transition-all hover:border-pink-200 hover:shadow-2xl hover:shadow-pink-600/5 shadow-xl shadow-gray-200/50 group">
                                    <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600 shrink-0 group-hover:scale-110 transition-transform">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-black text-gray-900 text-lg mb-2">Email Us</h3>
                                        <p className="text-gray-500 font-medium text-sm">bspnws@gmail.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 p-8 bg-white rounded-[2.5rem] border border-gray-100 transition-all hover:border-pink-200 hover:shadow-2xl hover:shadow-pink-600/5 shadow-xl shadow-gray-200/50 group">
                                    <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600 shrink-0 group-hover:scale-110 transition-transform">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-black text-gray-900 text-lg mb-2">Call Us</h3>
                                        <p className="text-gray-500 font-medium text-sm">(+91) 7866022053</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden group">
                            <div className="relative z-10">
                                <h2 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">Send a Message</h2>
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label htmlFor="name" className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Full Name</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-pink-600 focus:bg-white outline-none transition-all font-bold text-gray-900"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label htmlFor="email" className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Email Address</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-pink-600 focus:bg-white outline-none transition-all font-bold text-gray-900"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label htmlFor="subject" className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Topic</label>
                                        <select
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-pink-600 focus:bg-white outline-none transition-all font-bold text-gray-900 appearance-none cursor-pointer"
                                        >
                                            <option value="" disabled>Select a topic</option>
                                            <option value="general">General Inquiry</option>
                                            <option value="profile">Profile Update</option>
                                            <option value="attendance">Attendance Issue</option>
                                            <option value="membership">Membership Code</option>
                                            <option value="donations">Donations</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    <div className="space-y-3">
                                        <label htmlFor="message" className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Your Message</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={5}
                                            className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-pink-600 focus:bg-white outline-none transition-all font-bold text-gray-900 resize-none"
                                            placeholder="Tell us what you need..."
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-pink-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-pink-600/20 hover:bg-pink-700 hover:shadow-pink-600/30 transition-all hover:-translate-y-1 uppercase tracking-widest text-sm"
                                    >
                                        Send Message
                                    </button>
                                </form>
                            </div>
                            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-pink-600/5 rounded-full blur-[80px] -mr-32 -mt-32 group-hover:bg-pink-600/10 transition-all duration-700"></div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
