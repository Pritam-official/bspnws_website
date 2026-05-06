"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        subject: "",
        message: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Footer contact form submitted:", formData);
        alert("Thank you for your message! We will get back to you soon.");
        setFormData({ name: "", email: "", company: "", subject: "", message: "" });
    };

    const projects = [
        "BARISTHA VANDANA",
        "ANNAPRASHANA",
        "SWASTHYA VIKAS",
        "SAMPARKER BANDHAN",
        "AANANDAM",
        "SHYAMALIMA",
        "UTSAHO",
        "KUTUMBA",
    ];

    const importantLinks = [
        { name: "About us", href: "/about" },
        { name: "Notice", href: "/notice" },
        { name: "Our Volunteers", href: "/volunteers/our" },
        { name: "Our Materials", href: "/our-materials" },
        { name: "Contact us", href: "/contact" },
        { name: "Help us", href: "/help" },
    ];

    return (
        <footer className="bg-[#0b0f1a] text-gray-300 py-8 px-6 md:px-12 lg:px-24 border-t border-white/5 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

            <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-4 relative z-10">
                {/* Column 1: Organization Info */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="relative w-14 h-14 bg-white rounded-full p-1 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                            <Image src="/logo.jpg" alt="Logo" fill className="object-contain rounded-full" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black text-white tracking-tighter leading-none">BSPNWS</span>
                            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest leading-none mt-1">Welfare Society</span>
                        </div>
                    </div>

                    {/* Social Media Links */}
                    <div className="flex gap-4">
                        {[
                            { name: 'facebook', icon: '/social/facebook.svg', color: 'hover:bg-[#1877F2]', href: 'https://www.facebook.com/share/1856ZhMqPV/' },
                            { name: 'instagram', icon: '/social/instagram.svg', color: 'hover:bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]', href: 'https://www.instagram.com/pyara_nutrition?igsh=MWg0N2NsZjRjM2xhcw==' },
                            { name: 'youtube', icon: '/social/youtube.svg', color: 'hover:bg-[#FF0000]', href: 'https://youtube.com/@pyaranutrition?si=kX5A_r3lTi7eqLGU' },
                            { name: 'x', icon: '/social/x.svg', color: 'hover:bg-black', href: 'https://x.com/pyaranutrition' }
                        ].map((social) => (
                            <Link
                                key={social.name}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`w-11 h-11 bg-white/5 rounded-full flex items-center justify-center group transition-all duration-500 border border-white/10 ${social.color} hover:border-transparent hover:-translate-y-1 shadow-lg hover:shadow-emerald-500/10`}
                                title={social.name}
                            >
                                <div className="relative w-5 h-5 transition-all duration-300 group-hover:scale-125">
                                    <Image
                                        src={social.icon}
                                        alt={social.name}
                                        fill
                                        className={`object-contain transition-all duration-300 ${social.name === 'instagram' ? 'group-hover:brightness-0 group-hover:invert' : social.name === 'x' ? 'brightness-0 invert group-hover:brightness-200' : ''}`}
                                    />
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="space-y-4 pt-4">
                        <div className="flex items-start gap-3 group">
                            <div className="mt-1 text-emerald-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                            </div>
                            <span className="text-sm font-medium group-hover:text-white transition-colors">(+91) 7866022053</span>
                        </div>
                        <div className="flex items-start gap-3 group">
                            <div className="mt-1 text-emerald-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                            </div>
                            <span className="text-sm font-medium group-hover:text-white transition-colors">bspnws@gmail.com</span>
                        </div>
                        <div className="flex items-start gap-3 group">
                            <div className="mt-1 text-emerald-500">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            </div>
                            <span className="text-sm font-medium leading-relaxed group-hover:text-white transition-colors">
                                3 No Shankari Pukur PO. Sripally, East Burdwan, Pin-713103 W.B India
                            </span>
                        </div>
                    </div>
                </div>

                {/* Column 2: Our 8 Projects */}
                <div className="space-y-4">
                    <h3 className="text-xl font-black text-white flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-emerald-500 rounded-sm"></span>
                        Our 8 Projects
                    </h3>
                    <ul className="space-y-4">
                        {projects.map((project) => (
                            <li key={project} className="group">
                                <Link href="/projects" className="text-sm font-medium text-gray-400 group-hover:text-emerald-500 transition-all flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-gray-700 rounded-full group-hover:bg-emerald-500 transition-colors"></span>
                                    {project}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Column 3: Important Links */}
                <div className="space-y-4">
                    <h3 className="text-xl font-black text-white flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-emerald-500 rounded-sm"></span>
                        Important Links
                    </h3>
                    <ul className="space-y-4">
                        {importantLinks.map((link) => (
                            <li key={link.name} className="group">
                                <Link href={link.href} className="text-sm font-medium text-gray-400 group-hover:text-emerald-500 transition-all flex items-center gap-2">
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Column 4: Support Form */}
                <div className="space-y-4">
                    <h3 className="text-xl font-black text-white flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-emerald-500 rounded-sm"></span>
                        Support
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name*</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Enter your full name"
                                className="w-full bg-[#151b2d] border border-white/5 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-600"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Your Email*</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Enter your email address"
                                className="w-full bg-[#151b2d] border border-white/5 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-600"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Subject*</label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                placeholder="How can we help?"
                                className="w-full bg-[#151b2d] border border-white/5 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-600"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Message*</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows={3}
                                placeholder="Hello there, I would like to talk about..."
                                className="w-full bg-[#151b2d] border border-white/5 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-gray-600 resize-none"
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-lg transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98]"
                        >
                            Send message
                        </button>
                    </form>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="max-w-[1400px] mx-auto mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
                <p className="text-xs text-gray-500 font-medium">
                    © {new Date().getFullYear()} BSPNWS. All rights reserved.
                </p>
                <div className="flex gap-8">
                    <Link href="/terms" className="text-xs text-gray-500 hover:text-white transition-colors">Terms of Service</Link>
                    <Link href="/privacy" className="text-xs text-gray-500 hover:text-white transition-colors">Privacy Policy</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
