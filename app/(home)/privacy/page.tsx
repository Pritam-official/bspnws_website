"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import { Shield, Eye, Lock, FileText, ArrowLeft, Mail } from "lucide-react";

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <Navbar />

            {/* Header Hero Section */}
            <div className="relative pt-24 sm:pt-32 pb-16 bg-gradient-to-br from-slate-900 via-[#0b0f1a] to-slate-900 text-white overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
                
                <div className="container mx-auto px-6 relative z-10 max-w-4xl text-center">
                    <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full mb-6 border border-emerald-500/20">
                        <Shield className="w-4 h-4" />
                        <span className="text-xs font-black uppercase tracking-widest">Privacy Protection</span>
                    </div>
                    <h1 
                        className="text-4xl md:text-5xl font-black tracking-tight mb-4"
                        style={{ fontFamily: '"Georgia", "Times New Roman", serif' }}
                    >
                        Privacy Policy
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base font-medium">
                        Last Updated: May 25, 2026. Burdwan Sadar Pyara Nutrition Welfare Society (BSPNWS) is deeply committed to protecting your privacy and ensuring your personal information is treated securely.
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-100 space-y-10">
                    
                    {/* Section 1: Introduction */}
                    <div className="space-y-4">
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-emerald-500 rounded-sm"></span>
                            1. Introduction & Overview
                        </h2>
                        <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                            Burdwan Sadar Pyara Nutrition Welfare Society (BSPNWS) ("we," "us," or "our") operates this website to provide community nutrition awareness, run welfare programmes, and coordinate volunteer efforts. This Privacy Policy governs the collection, processing, and management of personal data provided by visitors, donors, volunteers, and members of BSPNWS.
                        </p>
                        <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                            By interacting with our platform, submitting application forms, or donating to our flagship projects (such as Baristha Vandana, Swasthya Vikas, or Kutumba), you consent to the collection and use of your data as outlined in this policy.
                        </p>
                    </div>

                    {/* Section 2: Data Collection */}
                    <div className="space-y-4">
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-emerald-500 rounded-sm"></span>
                            2. Information We Collect
                        </h2>
                        <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                            We may collect several types of information from our users to provide holistic support services and secure verification:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 mb-3">
                                    <Eye className="w-4 h-4" />
                                </div>
                                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-2">Personal Data</h3>
                                <p className="text-slate-500 text-xs leading-relaxed">
                                    Includes your name, email address, phone number, residential address, date of birth, and identity documentation submitted during volunteer signup.
                                </p>
                            </div>
                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 mb-3">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-2">Donor & Financial Data</h3>
                                <p className="text-slate-500 text-xs leading-relaxed">
                                    Includes donation amounts, transaction IDs, tax exemption details (PAN cards for Indian 80G tax exemptions), and bank transfer receipt uploads.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: How We Use Data */}
                    <div className="space-y-4">
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-emerald-50 rounded-sm"></span>
                            3. How We Use Your Information
                        </h2>
                        <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                            We strictly use collected information for non-commercial, developmental activities:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600 text-sm sm:text-base">
                            <li>To process donations, send transactional receipts, and issue 80G tax-exemption tax certificates.</li>
                            <li>To manage and coordinate volunteer applications, review attendance, and distribute membership directories.</li>
                            <li>To address queries submitted through our Contact Form or support channels.</li>
                            <li>To send general notifications, annual reports, community notice updates, and invitations to upcoming programmes.</li>
                            <li>To prevent fraudulent volunteer memberships and preserve administrative portal security.</li>
                        </ul>
                    </div>

                    {/* Section 4: Data Security */}
                    <div className="space-y-4">
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-emerald-50 rounded-sm"></span>
                            4. Data Protection & Security Measures
                        </h2>
                        <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                            The security of your personal data is paramount. We implement robust, industry-standard administrative, physical, and electronic security checks:
                        </p>
                        <div className="p-5 border-l-4 border-emerald-500 bg-emerald-50/50 rounded-r-2xl text-slate-700 text-sm leading-relaxed">
                            <strong>No Third-Party Sharing:</strong> BSPNWS does not sell, rent, or distribute any user, volunteer, or donor databases to corporate entities, advertisers, or third-party mailing lists. Your personal profiles remain strictly within our secure server infrastructure.
                        </div>
                    </div>

                    {/* Section 5: Rights */}
                    <div className="space-y-4">
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-emerald-50 rounded-sm"></span>
                            5. Your Rights and Controls
                        </h2>
                        <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                            Under the Digital Personal Data Protection Act (DPDPA) of India, you hold fundamental rights regarding your information:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600 text-sm sm:text-base">
                            <li><strong>Right of Access:</strong> You can request a summary of your personal profiles stored in our databases.</li>
                            <li><strong>Right to Correction:</strong> You can edit or update incorrect details through the volunteer dashboard or by contacting us directly.</li>
                            <li><strong>Right to Erasure:</strong> You can request complete deletion of your volunteer record or user profile at any time.</li>
                        </ul>
                    </div>

                    {/* Section 6: Contact Us */}
                    <div className="space-y-4 pt-6 border-t border-slate-100">
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-emerald-50 rounded-sm"></span>
                            6. Reach Out to Our DPO
                        </h2>
                        <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                            If you have questions about this Privacy Policy, wish to revoke consent, or seek deletion of data, feel free to contact our Data Protection Coordinator:
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-2">
                            <div className="flex-1 p-5 rounded-2xl border border-slate-100 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider leading-none mb-1">Email Inquiry</span>
                                    <a href="mailto:bspnws@gmail.com" className="text-sm font-bold text-slate-700 hover:text-emerald-500 transition-colors">bspnws@gmail.com</a>
                                </div>
                            </div>
                            <div className="flex-1 p-5 rounded-2xl border border-slate-100 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider leading-none mb-1">Registered Address</span>
                                    <span className="text-xs font-bold text-slate-700">East Burdwan, WB, India</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Back button */}
                    <div className="pt-8 border-t border-slate-100 flex justify-between items-center flex-wrap gap-4">
                        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Back to Home
                        </Link>
                        <Link href="/terms" className="text-sm font-bold text-emerald-600 hover:text-emerald-500 transition-colors">
                            Read Terms of Service
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}
