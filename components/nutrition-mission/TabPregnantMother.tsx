"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function TabPregnantMother() {
    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Banner Section */}
            <div className="relative bg-gradient-to-r from-rose-900 via-pink-900 to-rose-950 rounded-3xl p-8 md:p-12 text-white overflow-hidden shadow-xl">
                <div className="relative z-10 max-w-2xl space-y-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/30 text-rose-200 border border-rose-400/30 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                        <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span>
                        Phase 2 Initiative • Enrolling Mothers
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                        Maternal Nutrition & Antenatal Care Mission
                    </h2>
                    <p className="text-rose-100 text-sm md:text-base leading-relaxed">
                        Supporting pregnant mothers in vulnerable rural communities with iron-folic acid supplementation, high-protein dietary rations, routine gestational weight monitoring, and clinical nutrition counselling.
                    </p>
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                        <Link 
                            href="/contact"
                            className="bg-white text-rose-900 hover:bg-rose-50 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
                        >
                            Sponsor A Mother&apos;s Nutrition
                        </Link>
                        <span className="text-xs text-rose-200 font-medium">
                            ✓ Direct Field Interventions Across Purba Bardhaman
                        </span>
                    </div>
                </div>

                {/* Decorative background circle */}
                <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-rose-600/20 blur-3xl pointer-events-none"></div>
            </div>

            {/* Upcoming Features / Plan Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-4 text-xl">
                        🩸
                    </div>
                    <h3 className="font-bold text-gray-900 text-base mb-2">
                        Anaemia Prevention & IFA Support
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                        Routine hemoglobin testing, distribution of iron & folic acid tablets, and dietary guidance with local green leafy vegetables and seasonal fruits.
                    </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600 mb-4 text-xl">
                        ⚖️
                    </div>
                    <h3 className="font-bold text-gray-900 text-base mb-2">
                        Gestational Weight & Vitals Tracker
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                        Continuous trimester-wise weight assessment and blood pressure screening to ensure optimal foetal growth and early identification of high-risk pregnancies.
                    </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mb-4 text-xl">
                        🥣
                    </div>
                    <h3 className="font-bold text-gray-900 text-base mb-2">
                        Direct Dietary Ration Kits
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                        Monthly specialized ration kits containing roasted chickpea flour (sattu), dal, fortified oil, nuts, and essential micronutrients for expectant mothers.
                    </p>
                </div>
            </div>

            {/* Registration Notice */}
            <div className="bg-rose-50/60 border border-rose-200/60 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 font-bold shrink-0">
                        ℹ
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-gray-900">
                            Maternal Cohort Data Integration in Progress
                        </h4>
                        <p className="text-xs text-gray-600">
                            Field baseline health assessments for registered pregnant mothers are currently being digitized by our ground health team.
                        </p>
                    </div>
                </div>
                <Link
                    href="/contact"
                    className="whitespace-nowrap px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                    Contact Nutrition Desk
                </Link>
            </div>
        </div>
    );
}
