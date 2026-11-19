"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function TabTbPatient() {
    const [imgError, setImgError] = useState(false);

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Banner Section */}
            <div className="relative bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 rounded-3xl p-8 md:p-12 text-white overflow-hidden shadow-xl">
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                    <div className="md:col-span-8 space-y-4">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                            TB Nutrition Mission • Direct Benefit Support
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                            Nutritional Support for Tuberculosis Patients
                        </h2>
                        <p className="text-slate-200 text-sm md:text-base leading-relaxed">
                            Malnutrition and Tuberculosis form a vicious cycle. Burdwan Sadar Pyara Nutrition Welfare Society bridges this critical gap by providing monthly high-protein supplementary nutrition baskets and dietary counselling to ensure complete treatment adherence and fast recovery.
                        </p>
                        <div className="pt-2 flex flex-wrap items-center gap-3">
                            <Link 
                                href="/donate"
                                className="bg-teal-500 hover:bg-teal-400 text-teal-950 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
                            >
                                Sponsor A TB Patient Ration Kit
                            </Link>
                            <span className="text-xs text-teal-200 font-medium">
                                ✓ Nikshay Nutrition Alignment & Community Care
                            </span>
                        </div>
                    </div>

                    <div className="md:col-span-4 flex justify-center">
                        <div className="relative w-64 h-48 md:w-full md:h-56 rounded-2xl overflow-hidden border-2 border-teal-500/30 shadow-2xl bg-slate-800">
                            {!imgError ? (
                                <Image
                                    src="/tb_patients.png"
                                    alt="TB Patients Nutrition Mission"
                                    fill
                                    className="object-cover"
                                    onError={() => setImgError(true)}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-teal-400 font-bold p-4 text-center">
                                    TB Nutrition Support Initiative
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-teal-600/20 blur-3xl pointer-events-none"></div>
            </div>

            {/* Strategic Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 mb-4 text-xl">
                        📦
                    </div>
                    <h3 className="font-bold text-gray-900 text-base mb-2">
                        Monthly High-Protein Food Basket
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                        Supplying eggs, soya chunks, roasted chana, lentils, milk powder, and cooking oil to meet the high caloric and protein demands of active TB recovery.
                    </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 mb-4 text-xl">
                        📈
                    </div>
                    <h3 className="font-bold text-gray-900 text-base mb-2">
                        BMI & Weight Gain Tracking
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                        Continuous monthly weight gain logs and Body Mass Index (BMI) monitoring to evaluate immune restoration and bacteriological clearance.
                    </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4 text-xl">
                        🤝
                    </div>
                    <h3 className="font-bold text-gray-900 text-base mb-2">
                        DOTS Adherence & Family Counselling
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                        Community volunteer home visits to ensure uninterrupted medicine intake, address stigma, and educate family contacts on respiratory hygiene.
                    </p>
                </div>
            </div>

            {/* TB Cohort Notice */}
            <div className="bg-teal-50/70 border border-teal-200/60 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold shrink-0">
                        🩺
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-gray-900">
                            TB Patient Database & Health Dashboards
                        </h4>
                        <p className="text-xs text-gray-600">
                            Live patient profile cards with weight gain trajectory and sputum conversion records are being linked to the central portal.
                        </p>
                    </div>
                </div>
                <Link
                    href="/contact"
                    className="whitespace-nowrap px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                    Inquire About Patient Support
                </Link>
            </div>
        </div>
    );
}
