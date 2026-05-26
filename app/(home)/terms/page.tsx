"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import { FileText, Award, Gavel, Scale, ArrowLeft, Mail } from "lucide-react";

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <Navbar />

            {/* Header Hero Section */}
            <div className="relative pt-24 sm:pt-32 pb-16 bg-gradient-to-br from-slate-900 via-[#0b0f1a] to-slate-900 text-white overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
                
                <div className="container mx-auto px-6 relative z-10 max-w-4xl text-center">
                    <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full mb-6 border border-emerald-500/20">
                        <FileText className="w-4 h-4" />
                        <span className="text-xs font-black uppercase tracking-widest">Legal Agreement</span>
                    </div>
                    <h1 
                        className="text-4xl md:text-5xl font-black tracking-tight mb-4"
                        style={{ fontFamily: '"Georgia", "Times New Roman", serif' }}
                    >
                        Terms of Service
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base font-medium">
                        Last Updated: May 25, 2026. Please read these terms carefully before accessing or using our platform.
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-4 py-16 max-w-4xl">
                <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-100 space-y-10">
                    
                    {/* Section 1: Acceptance */}
                    <div className="space-y-4">
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-emerald-50 rounded-sm"></span>
                            1. Acceptance of Terms
                        </h2>
                        <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                            Welcome to the official web portal of Burdwan Sadar Pyara Nutrition Welfare Society (BSPNWS). By visiting, accessing, browsing, or utilizing the services on this website, you agree to comply with and be bound by these Terms of Service, along with our Privacy Policy. If you do not agree to these terms, you must refrain from using the site.
                        </p>
                    </div>

                    {/* Section 2: User Conduct */}
                    <div className="space-y-4">
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-emerald-50 rounded-sm"></span>
                            2. Use of the Site & Conduct
                        </h2>
                        <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                            Users are permitted to browse information about our flagship initiatives, download public annual reports, notices, and submit requests for volunteering or queries. By using our website, you warrant that:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600 text-sm sm:text-base">
                            <li>You will not provide false or misleading identity profiles during contact requests or membership registration.</li>
                            <li>You will not upload or transmit files containing malicious viruses, scripts, or spyware targeting the server infrastructure.</li>
                            <li>You will not attempt to gain unauthorized security access to the administrator portal or verification mechanisms.</li>
                        </ul>
                    </div>

                    {/* Section 3: Donation Terms */}
                    <div className="space-y-4">
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-emerald-50 rounded-sm"></span>
                            3. Donation and Financial Contributions
                        </h2>
                        <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                            BSPNWS is a registered non-governmental society in India under the West Bengal Societies Registration Act, 1961, and carries tax-exemption credentials under Section 80G and Section 12A of the Income Tax Act.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                                    <Scale className="w-5 h-5" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-bold text-slate-900 text-sm">Tax Exemption Receipts</h3>
                                    <p className="text-slate-500 text-xs leading-relaxed">
                                        Donations are voluntary and eligible for tax benefits under Section 80G. PAN card info is required to file tax credit certificates with the Income Tax Department of India.
                                    </p>
                                </div>
                            </div>
                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                                    <Award className="w-5 h-5" />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-bold text-slate-900 text-sm">No Refund Policy</h3>
                                    <p className="text-slate-500 text-xs leading-relaxed">
                                        Once a donation is processed and a secure receipt is generated, the transaction cannot be refunded or canceled due to immediate fund allocation to flagship welfare programs.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Volunteer Code of Conduct */}
                    <div className="space-y-4">
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-emerald-50 rounded-sm"></span>
                            4. Volunteer Membership Regulations
                        </h2>
                        <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                            Registered volunteers who obtain portal accounts are expected to adhere strictly to the BSPNWS Code of Ethical Conduct:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600 text-sm sm:text-base">
                            <li>Attendance logs submitted inside the volunteer portal must reflect honest and true community service records.</li>
                            <li>Identity credentials and profile photographs uploaded by volunteers must represent their true legal identification.</li>
                            <li>The society administrators reserve the right to suspend, terminate, or revoke any volunteer memberships or access keys for ethical violations.</li>
                        </ul>
                    </div>

                    {/* Section 5: Intellectual Property */}
                    <div className="space-y-4">
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-emerald-50 rounded-sm"></span>
                            5. Intellectual Property
                        </h2>
                        <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                            All materials, images, designs, logos, text, code, and project portfolios displayed on this website are the sole property of Burdwan Sadar Pyara Nutrition Welfare Society. Users may download notices and annual reports for personal, non-commercial educational purposes, but any commercial distribution is strictly prohibited.
                        </p>
                    </div>

                    {/* Section 6: Jurisdiction */}
                    <div className="space-y-4">
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-emerald-50 rounded-sm"></span>
                            6. Governing Law & Jurisdiction
                        </h2>
                        <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                            These Terms of Service are governed by and construed in accordance with the laws of the Republic of India and the State of West Bengal. Any disputes arising out of these terms shall be subject to the exclusive jurisdiction of the competent courts in Purba Bardhaman district, West Bengal, India.
                        </p>
                    </div>

                    {/* Section 7: Contact Us */}
                    <div className="space-y-4 pt-6 border-t border-slate-100">
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-emerald-50 rounded-sm"></span>
                            7. Questions & Legal Inquiries
                        </h2>
                        <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                            If you have questions regarding these terms, donor duties, or seek legal clarifications, feel free to contact us:
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
                                    <Gavel className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider leading-none mb-1">Legal Secretariat</span>
                                    <span className="text-xs font-bold text-slate-700">BSPNWS Legal Team, West Bengal</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Back button */}
                    <div className="pt-8 border-t border-slate-100 flex justify-between items-center flex-wrap gap-4">
                        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Back to Home
                        </Link>
                        <Link href="/privacy" className="text-sm font-bold text-emerald-600 hover:text-emerald-500 transition-colors">
                            Read Privacy Policy
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}
