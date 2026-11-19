"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Navbar from "@/components/shared/Navbar";
import ChildCard from "@/components/nutrition-mission/ChildCard";
import ChildDetailsModal from "@/components/nutrition-mission/ChildDetailsModal";
import TabPregnantMother from "@/components/nutrition-mission/TabPregnantMother";
import TabTbPatient from "@/components/nutrition-mission/TabTbPatient";
import { ISamMamChild } from "@/models/SamMamChild";
import { ChildNutritionAnalysis, formatReportMonth } from "@/lib/nutritionLogic";

export default function OurNutritionMissionPage() {
    const [activeTab, setActiveTab] = useState<"child" | "pregnant" | "tb">("child");
    const [children, setChildren] = useState<ISamMamChild[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [monthFilter, setMonthFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [genderFilter, setGenderFilter] = useState("ALL");
    const [nutritionLogicConfig, setNutritionLogicConfig] = useState<any>(null);

    // Modal state for viewing clinical report
    const [selectedChild, setSelectedChild] = useState<ISamMamChild | null>(null);
    const [selectedAnalysis, setSelectedAnalysis] = useState<ChildNutritionAnalysis | null>(null);

    useEffect(() => {
        fetchChildren();
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const res = await fetch("/api/nutrition-logic-config");
            const json = await res.json();
            if (json.success && json.data) {
                setNutritionLogicConfig(json.data);
            }
        } catch (error) {
            console.error("Failed to fetch nutrition logic config:", error);
        }
    };

    const fetchChildren = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/sam-mam-children");
            const json = await res.json();
            if (json.success && Array.isArray(json.data)) {
                setChildren(json.data);
            }
        } catch (error) {
            console.error("Failed to fetch SAM/MAM children:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (child: ISamMamChild, analysis: ChildNutritionAnalysis) => {
        setSelectedChild(child);
        setSelectedAnalysis(analysis);
    };


    // Calculate unique available months — from BOTH parent (latest) AND all sub-months (monthlyReports)
    const availableMonths = useMemo(() => {
        const set = new Set<string>();
        children.forEach((c) => {
            const m = formatReportMonth(c.dateOfEntry, c.reportMonth);
            if (m) set.add(m);
            if (Array.isArray(c.monthlyReports)) {
                (c.monthlyReports as any[]).forEach((r) => {
                    if (r.reportMonth) set.add(r.reportMonth);
                });
            }
        });
        return Array.from(set);
    }, [children]);

    // Count how many children have data in each month
    const monthCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        children.forEach((c) => {
            const monthsForChild = new Set<string>();
            const m = formatReportMonth(c.dateOfEntry, c.reportMonth);
            if (m) monthsForChild.add(m);
            if (Array.isArray(c.monthlyReports)) {
                (c.monthlyReports as any[]).forEach((r) => {
                    if (r.reportMonth) monthsForChild.add(r.reportMonth);
                });
            }
            monthsForChild.forEach((month) => {
                counts[month] = (counts[month] || 0) + 1;
            });
        });
        return counts;
    }, [children]);

    // Filter children — match if selected month appears in parent OR any sub-month
    const filteredChildren = useMemo(() => {
        return children.filter((child) => {
            const childMonth = formatReportMonth(child.dateOfEntry, child.reportMonth);

            const matchesSearch =
                child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                child.guardianName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                child.address.toLowerCase().includes(searchTerm.toLowerCase());

            let matchesMonth = monthFilter === "ALL";
            if (!matchesMonth) {
                if (childMonth.toLowerCase() === monthFilter.toLowerCase()) {
                    matchesMonth = true;
                } else if (Array.isArray(child.monthlyReports)) {
                    matchesMonth = (child.monthlyReports as any[]).some(
                        (r) => (r.reportMonth || "").toLowerCase() === monthFilter.toLowerCase()
                    );
                }
            }

            const matchesGender = genderFilter === "ALL" || child.sex === genderFilter;

            let matchesStatus = true;
            if (statusFilter === "SAM") {
                matchesStatus = child.anthropometricMeasurement.toUpperCase().includes("SAM") || child.muac < 11.5;
            } else if (statusFilter === "MAM") {
                matchesStatus = child.anthropometricMeasurement.toUpperCase().includes("MAM") || (child.muac >= 11.5 && child.muac < 12.5);
            } else if (statusFilter === "RECOVERED") {
                matchesStatus = child.anthropometricMeasurement.toLowerCase().includes("normal") ||
                    child.anthropometricMeasurement.toLowerCase().includes("recover") ||
                    child.muac >= 12.5;
            }

            return matchesSearch && matchesMonth && matchesGender && matchesStatus;
        });
    }, [children, searchTerm, monthFilter, statusFilter, genderFilter]);

    // Contextual stats based on current month filter (or overall)
    const baseStatsPool = useMemo(() => {
        if (monthFilter === "ALL") return children;
        return children.filter(
            (c) => formatReportMonth(c.dateOfEntry, c.reportMonth).toLowerCase() === monthFilter.toLowerCase()
        );
    }, [children, monthFilter]);

    const totalFiltered = baseStatsPool.length;
    const samCount = baseStatsPool.filter((c) => c.anthropometricMeasurement.toUpperCase().includes("SAM") || c.muac < 11.5).length;
    const mamCount = baseStatsPool.filter((c) => c.anthropometricMeasurement.toUpperCase().includes("MAM") && c.muac >= 11.5).length;
    const recoveredCount = baseStatsPool.filter((c) => c.muac >= 12.5 || c.anthropometricMeasurement.toLowerCase().includes("normal")).length;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            <Navbar />

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-16 bg-gradient-to-b from-blue-950 via-slate-900 to-slate-900 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold tracking-widest uppercase backdrop-blur-md">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            Burdwan Sadar Pyara Nutrition Welfare Society
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                            Our Nutrition <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400">Mission</span>
                        </h1>

                        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                            Grassroots clinical intervention transforming severely and moderately malnourished children into thriving, healthy individuals through month-wise anthropometric monitoring, therapeutic feeding, and targeted healthcare.
                        </p>
                    </div>

                    {/* OVERALL / MONTH-WISE IMPACT STATS CARDS */}
                    <div className="mt-10 max-w-5xl mx-auto">
                        <div className="flex items-center justify-between text-xs text-blue-200 mb-2 px-1">
                            <span className="font-bold flex items-center gap-1.5">
                                <span>📊</span>
                                <span>{monthFilter === "ALL" ? "Cumulative Overview (All Months)" : `Monthly Cohort Statistics: ${monthFilter}`}</span>
                            </span>
                            {monthFilter !== "ALL" && (
                                <button
                                    onClick={() => setMonthFilter("ALL")}
                                    className="text-[11px] underline hover:text-white cursor-pointer"
                                >
                                    View All Months
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/15 text-center">
                                <span className="text-3xl sm:text-4xl font-black text-white block">
                                    {totalFiltered}
                                </span>
                                <span className="text-xs uppercase font-bold text-blue-200 mt-1 block">
                                    {monthFilter === "ALL" ? "Total Enrolled" : `${monthFilter} Cohort`}
                                </span>
                            </div>

                            <div className="bg-red-500/15 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-red-500/30 text-center">
                                <span className="text-3xl sm:text-4xl font-black text-red-300 block">
                                    {samCount}
                                </span>
                                <span className="text-xs uppercase font-bold text-red-200 mt-1 block">
                                    SAM Active Care
                                </span>
                            </div>

                            <div className="bg-amber-500/15 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-amber-500/30 text-center">
                                <span className="text-3xl sm:text-4xl font-black text-amber-300 block">
                                    {mamCount}
                                </span>
                                <span className="text-xs uppercase font-bold text-amber-200 mt-1 block">
                                    MAM Nutrition Support
                                </span>
                            </div>

                            <div className="bg-emerald-500/15 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-emerald-500/30 text-center">
                                <span className="text-3xl sm:text-4xl font-black text-emerald-300 block">
                                    {recoveredCount}
                                </span>
                                <span className="text-xs uppercase font-bold text-emerald-200 mt-1 block">
                                    Healthy & Nourished
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* TAB SWITCHER */}
                    <div className="mt-12 flex justify-center">
                        <div className="bg-slate-800/90 p-1.5 rounded-2xl border border-slate-700/80 shadow-2xl flex flex-wrap items-center justify-center gap-1.5 backdrop-blur-xl">

                            {/* TAB 1: SAM / MAM Child */}
                            <button
                                onClick={() => setActiveTab("child")}
                                className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer ${activeTab === "child"
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400/40"
                                    : "text-slate-300 hover:text-white hover:bg-slate-700/60"
                                    }`}
                            >
                                <span className="text-base">👶</span>
                                <span>SAM / MAM Child Tab</span>
                                <span className="bg-white/20 text-white text-[11px] px-2 py-0.5 rounded-full font-bold ml-1">
                                    {children.length}
                                </span>
                            </button>

                            {/* TAB 2: Pregnant Mother */}
                            <button
                                onClick={() => setActiveTab("pregnant")}
                                className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer ${activeTab === "pregnant"
                                    ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30 ring-2 ring-rose-400/40"
                                    : "text-slate-300 hover:text-white hover:bg-slate-700/60"
                                    }`}
                            >
                                <span className="text-base">🤰</span>
                                <span>Pregnant Mother Tab</span>
                                <span className="bg-rose-500/30 text-rose-200 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                                    Phase 2
                                </span>
                            </button>

                            {/* TAB 3: TB Patient */}
                            <button
                                onClick={() => setActiveTab("tb")}
                                className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer ${activeTab === "tb"
                                    ? "bg-teal-600 text-white shadow-lg shadow-teal-600/30 ring-2 ring-teal-400/40"
                                    : "text-slate-300 hover:text-white hover:bg-slate-700/60"
                                    }`}
                            >
                                <span className="text-base">🩺</span>
                                <span>TB Patient Tab</span>
                                <span className="bg-teal-500/30 text-teal-200 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                                    Phase 3
                                </span>
                            </button>

                        </div>
                    </div>
                </div>
            </section>

            {/* TAB CONTENTS CONTAINER */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* 1. SAM / MAM CHILD TAB CONTENT */}
                {activeTab === "child" && (
                    <div className="space-y-8 animate-fadeIn">

                        {/* Section Header & Search / Filters Toolbar */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200/80">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">
                                            Month-Wise Monitoring System
                                        </span>
                                    </div>
                                    <h2 className="text-2xl font-black text-gray-900 tracking-tight mt-1 flex items-center gap-2.5">
                                        <span>SAM / MAM Child Nutritional Registry & Live Dashboards</span>
                                    </h2>
                                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                        Track child recovery progress month-by-month. Filter by specific reporting month to evaluate weight gain, MUAC recovery, and nutritional transition.
                                    </p>
                                </div>
                            </div>

                            {/* MONTH QUICK-SELECTOR PILLS */}
                            {availableMonths.length > 0 && (
                                <div className="py-4 border-b border-gray-100">
                                    <div className="flex items-center gap-2 mb-2">
                                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-xs font-black uppercase tracking-wider text-gray-700">
                                            Filter by Month:
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                        <button
                                            onClick={() => setMonthFilter("ALL")}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${monthFilter === "ALL"
                                                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                }`}
                                        >
                                            All Months ({children.length})
                                        </button>

                                        {availableMonths.map((m) => {
                                            const isSelected = monthFilter.toLowerCase() === m.toLowerCase();
                                            const count = monthCounts[m] || 0;
                                            return (
                                                <button
                                                    key={m}
                                                    onClick={() => setMonthFilter(m)}
                                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${isSelected
                                                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 ring-2 ring-blue-400/40"
                                                        : "bg-blue-50/70 text-blue-800 hover:bg-blue-100 border border-blue-200/60"
                                                        }`}
                                                >
                                                    <span>📅 {m}</span>
                                                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isSelected ? "bg-white/30 text-white" : "bg-blue-200/70 text-blue-900"
                                                        }`}>
                                                        {count}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Main Search and Dropdown Filters Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-4">
                                {/* Search */}
                                <div className="sm:col-span-4 relative">
                                    <input
                                        type="text"
                                        placeholder="Search by Name, Guardian, Address..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                                    />
                                    <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>

                                {/* Month Dropdown */}
                                <div className="sm:col-span-3">
                                    <select
                                        value={monthFilter}
                                        onChange={(e) => setMonthFilter(e.target.value)}
                                        className="w-full px-3 py-2.5 text-xs bg-blue-50/60 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-900 font-bold cursor-pointer"
                                    >
                                        <option value="ALL">📅 All Months</option>
                                        {availableMonths.map((m) => (
                                            <option key={m} value={m}>
                                                📅 {m} ({monthCounts[m] || 0} Children)
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Status Filter */}
                                <div className="sm:col-span-3">
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full px-3 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 font-medium cursor-pointer"
                                    >
                                        <option value="ALL">All Nutrition Statuses</option>
                                        <option value="SAM">🔴 SAM (Severe Acute Malnutrition)</option>
                                        <option value="MAM">🟡 MAM (Moderate Acute Malnutrition)</option>
                                        <option value="RECOVERED">🟢 Recovered / Normal Nourished</option>
                                    </select>
                                </div>

                                {/* Gender Filter */}
                                <div className="sm:col-span-2">
                                    <select
                                        value={genderFilter}
                                        onChange={(e) => setGenderFilter(e.target.value)}
                                        className="w-full px-3 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 font-medium cursor-pointer"
                                    >
                                        <option value="ALL">All Genders</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Banner Legend Explaining Active Month & Logic Metrics */}
                        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 rounded-2xl p-4 sm:p-5 text-white flex flex-col md:flex-row items-center justify-between gap-4 text-xs shadow-md">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-black text-blue-300 uppercase tracking-widest text-[10px]">
                                        Active Report Filter:
                                    </span>
                                    <span className="font-bold text-white bg-blue-500/30 px-2 py-0.5 rounded-md border border-blue-400/40">
                                        {monthFilter === "ALL" ? "All Reporting Months" : `Month of ${monthFilter}`}
                                    </span>
                                </div>
                                <p className="text-gray-200">
                                    WHO Standards:
                                    <span className="font-bold text-red-300 ml-1">🔴 SAM &lt; 11.5 cm</span> |
                                    <span className="font-bold text-amber-300 ml-1">🟡 MAM 11.5 - 12.4 cm</span> |
                                    <span className="font-bold text-emerald-300 ml-1">🟢 Normal ≥ 12.5 cm</span>
                                </p>
                            </div>
                            <div className="flex items-center gap-2 whitespace-nowrap">
                                <span className="px-3 py-1 bg-white/10 rounded-lg text-blue-200 font-bold border border-white/10">
                                    Displaying {filteredChildren.length} of {children.length} Records
                                </span>
                            </div>
                        </div>

                        {/* LIST OF CHILD CARDS (EACH WITH IMAGE + DATA + BESIDE REAL-TIME DASHBOARD) */}
                        {loading ? (
                            <div className="py-20 flex flex-col items-center justify-center gap-4 bg-white rounded-3xl border border-gray-100">
                                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                    Loading Children Nutrition Profiles...
                                </p>
                            </div>
                        ) : filteredChildren.length === 0 ? (
                            <div className="py-16 text-center bg-white rounded-3xl border border-gray-100 p-8">
                                <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 text-2xl">
                                    📅
                                </div>
                                <h3 className="text-base font-bold text-gray-800">
                                    No Reports Found for {monthFilter !== "ALL" ? monthFilter : "Selection"}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                                    No children records match this month or filter criteria. Try choosing another month or resetting filters.
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setMonthFilter("ALL");
                                        setStatusFilter("ALL");
                                        setGenderFilter("ALL");
                                    }}
                                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                                >
                                    Reset to All Months
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {filteredChildren.map((child) => (
                                    <ChildCard
                                        key={child._id}
                                        child={child}
                                        selectedMonth={monthFilter}
                                        config={nutritionLogicConfig}
                                        onViewDetails={handleViewDetails}
                                    />
                                ))}
                            </div>
                        )}

                    </div>
                )}

                {/* 2. PREGNANT MOTHER TAB CONTENT */}
                {activeTab === "pregnant" && <TabPregnantMother />}

                {/* 3. TB PATIENT TAB CONTENT */}
                {activeTab === "tb" && <TabTbPatient />}

            </main>

            {/* CLINICAL REPORT MODAL */}
            <ChildDetailsModal
                child={selectedChild}
                analysis={selectedAnalysis}
                onClose={() => {
                    setSelectedChild(null);
                    setSelectedAnalysis(null);
                }}
            />
        </div>
    );
}
