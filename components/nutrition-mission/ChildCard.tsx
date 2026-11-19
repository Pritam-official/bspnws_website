"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import {
    calculateChildNutritionStatus,
    formatReportMonth,
    ChildNutritionAnalysis,
    LogicConfigInput,
} from "@/lib/nutritionLogic";
import { ISamMamChild } from "@/models/SamMamChild";

interface ChildCardProps {
    child: ISamMamChild;
    selectedMonth?: string;
    config?: LogicConfigInput;
    onViewDetails?: (child: ISamMamChild, analysis: ChildNutritionAnalysis) => void;
}

export default function ChildCard({ child, selectedMonth, config, onViewDetails }: ChildCardProps) {
    const [imgError, setImgError] = useState(false);

    // Get all month reports for this child
    const reports = useMemo(() => {
        if (Array.isArray(child.monthlyReports) && child.monthlyReports.length > 0) {
            return child.monthlyReports;
        }
        return [
            {
                reportMonth: child.reportMonth || formatReportMonth(child.dateOfEntry),
                dateOfEntry: child.dateOfEntry,
                age: child.age,
                weight: child.weight,
                height: child.height,
                muac: child.muac,
                head: child.head,
                chest: child.chest,
                anthropometricMeasurement: child.anthropometricMeasurement,
                last14DaysIllness: child.last14DaysIllness,
                ebf: child.ebf,
                immunization: child.immunization,
                remarks: child.remarks,
                customRecoveryPercentage: child.customRecoveryPercentage,
            }
        ];
    }, [child]);

    // Active month selected for this card
    const [activeMonth, setActiveMonth] = useState<string>(() => {
        if (selectedMonth && selectedMonth !== "ALL") {
            const found = reports.find(r => r.reportMonth.toLowerCase() === selectedMonth.toLowerCase());
            if (found) return found.reportMonth;
        }
        return child.reportMonth || reports[reports.length - 1]?.reportMonth || formatReportMonth(child.dateOfEntry);
    });

    // Sync with global month filter if changed
    useEffect(() => {
        if (selectedMonth && selectedMonth !== "ALL") {
            const found = reports.find(r => r.reportMonth.toLowerCase() === selectedMonth.toLowerCase());
            if (found) {
                setActiveMonth(found.reportMonth);
            }
        }
    }, [selectedMonth, reports]);

    // Current active monthly report
    const activeData = useMemo(() => {
        const found = reports.find(r => r.reportMonth.toLowerCase() === activeMonth.toLowerCase());
        return found || reports[reports.length - 1] || child;
    }, [reports, activeMonth, child]);

    // Compute dynamic real-time nutrition & recovery analysis using active month's data
    const analysis = calculateChildNutritionStatus({
        weight: activeData.weight,
        height: activeData.height,
        muac: activeData.muac,
        head: activeData.head || child.head,
        chest: activeData.chest || child.chest,
        sex: child.sex,
        age: activeData.age || child.age,
        dateOfBirth: child.dateOfBirth,
        dateOfEntry: activeData.dateOfEntry,
        anthropometricMeasurement: activeData.anthropometricMeasurement,
        last14DaysIllness: activeData.last14DaysIllness,
        ebf: activeData.ebf,
        immunization: activeData.immunization,
        baselineWeight: child.baselineWeight,
        targetWeight: child.targetWeight,
        baselineMuac: child.baselineMuac,
        targetMuac: child.targetMuac,
        customRecoveryPercentage: activeData.customRecoveryPercentage,
    }, config);

    const reportMonthDisplay = activeData.reportMonth || formatReportMonth(activeData.dateOfEntry);

    // Formatting circular progress stroke
    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (analysis.percentage / 100) * circumference;

    const stages = [
        { label: "SAM", key: "SAM", color: "bg-red-500", text: "text-red-700", ring: "ring-red-400" },
        { label: "MAM", key: "MAM", color: "bg-amber-500", text: "text-amber-800", ring: "ring-amber-400" },
        { label: "Recovery", key: "Nutritional Transition", color: "bg-blue-500", text: "text-blue-800", ring: "ring-blue-400" },
        { label: "Healthy", key: "Healthy / Nourished", color: "bg-emerald-500", text: "text-emerald-800", ring: "ring-emerald-400" },
    ];

    const currentStageIndex = stages.findIndex((s) => s.key === analysis.stage);

    // Expand/collapse state for sub-month history panel
    const [isExpanded, setIsExpanded] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    // Latest month = what the main card always shows (child.reportMonth)
    const latestMonthLabel = child.reportMonth || reports[reports.length - 1]?.reportMonth || formatReportMonth(child.dateOfEntry);
    // Sub-reports = all months EXCEPT the latest one shown in the main card
    const subReports = useMemo(() => {
        return (reports as any[]).filter((r) => r.reportMonth?.toLowerCase() !== latestMonthLabel.toLowerCase());
    }, [reports, latestMonthLabel]);
    const hasSubReports = subReports.length > 0;

    // Switch parent view to display the selected sub-month and scroll up smoothly
    const handleSelectSubMonth = (month: string) => {
        setActiveMonth(month);
        if (cardRef.current) {
            cardRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    };

    return (
        <div ref={cardRef} className="bg-white rounded-3xl border border-gray-200/80 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">

            {/* Top Bar with Child ID, Month Selector Tabs & Anthropometric Classification */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 text-white">
                <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <h3 className="font-bold text-lg tracking-wide text-white flex items-center gap-2">
                        {child.name}
                        <span className="text-xs font-normal text-blue-200 bg-blue-900/60 px-2 py-0.5 rounded-full border border-blue-700/50">
                            {child.sex} • {activeData.age || child.age}
                        </span>
                    </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    {/* MONTH SELECTOR / GROUP TABS (For same child with multiple months) */}
                    {reports.length > 1 ? (
                        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/15">
                            <span className="text-[10px] text-blue-200 uppercase font-bold px-1.5 hidden sm:inline">
                                Months ({reports.length}):
                            </span>
                            {reports.map((r: any) => {
                                const isCurrentActive = activeMonth.toLowerCase() === r.reportMonth.toLowerCase();
                                return (
                                    <button
                                        key={r.reportMonth}
                                        onClick={() => setActiveMonth(r.reportMonth)}
                                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${isCurrentActive
                                            ? "bg-blue-600 text-white shadow-md shadow-blue-500/40 ring-1 ring-blue-300"
                                            : "text-gray-300 hover:text-white hover:bg-white/10"
                                            }`}
                                    >
                                        📅 {r.reportMonth}
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/25 border border-blue-400/40 text-blue-200 text-xs font-bold tracking-wide">
                            <svg className="w-3.5 h-3.5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Month: <strong className="text-white">{reportMonthDisplay}</strong></span>
                        </div>
                    )}

                    <div className="flex items-center gap-1.5">
                        <span className="text-xs text-gray-300 hidden sm:inline">Status:</span>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${analysis.stageColor.bg} ${analysis.stageColor.text} ${analysis.stageColor.border}`}>
                            {activeData.anthropometricMeasurement || analysis.stage}
                        </span>
                    </div>
                </div>
            </div>

            {/* TEMPORARY SUB-MONTH PREVIEW BANNER */}
            {activeMonth.toLowerCase() !== latestMonthLabel.toLowerCase() && (
                <div className="bg-amber-50 border-b-2 border-amber-300 px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 text-amber-900 font-bold">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
                        <span>
                            Viewing Sub-Month Record in Dashboard: <strong className="text-blue-950 bg-white px-2 py-0.5 rounded-md border border-amber-300 font-black">📅 {activeMonth}</strong>
                        </span>
                        <span className="text-gray-500 font-normal text-[11px] hidden md:inline">
                            (Page refresh will restore latest {latestMonthLabel})
                        </span>
                    </div>
                    <button
                        onClick={() => handleSelectSubMonth(latestMonthLabel)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-lg text-[11px] font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                        <span>↩</span>
                        <span>Back to Latest ({latestMonthLabel})</span>
                    </button>
                </div>
            )}

            {/* Main Content Layout: Image + Data Section + Real-Time Dashboard */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

                {/* 1. IMAGE SECTION (Col 1-3) */}
                <div className="lg:col-span-3 flex flex-col items-center">
                    <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 border-2 border-gray-200/80 shadow-inner group/img">
                        {child.image && !imgError ? (
                            <Image
                                src={child.image}
                                alt={child.name}
                                fill
                                sizes="(max-width: 768px) 100vw, 300px"
                                className="object-cover group-hover/img:scale-105 transition-transform duration-500"
                                onError={() => setImgError(true)}
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-600 p-4">
                                <svg className="w-16 h-16 text-blue-400/80 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span className="text-xs font-semibold text-blue-800 text-center uppercase tracking-wider">
                                    Child Nutrition Profile
                                </span>
                            </div>
                        )}

                        {/* Floating Status Badge */}
                        <div className="absolute top-2.5 left-2.5">
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-black shadow-md uppercase tracking-wider backdrop-blur-md ${analysis.stageColor.bg} ${analysis.stageColor.text} border ${analysis.stageColor.border}`}>
                                {analysis.stage}
                            </span>
                        </div>

                        {/* Entry Date & Month Pill */}
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-black/75 backdrop-blur-md text-white text-[11px] font-medium py-1.5 px-2.5 rounded-lg text-center flex flex-col items-center justify-center gap-0.5 border border-white/20">
                            <div className="flex items-center gap-1.5">
                                <svg className="w-3.5 h-3.5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>Date: {activeData.dateOfEntry}</span>
                            </div>
                            <span className="text-[10px] text-blue-200 font-bold">
                                📅 Report: {reportMonthDisplay}
                            </span>
                        </div>
                    </div>

                    {/* Quick Guardian & Address Subtitle */}
                    <div className="mt-3 text-center w-full">
                        <p className="text-xs font-semibold text-gray-700 truncate">
                            Guardian: <span className="text-gray-900 font-bold">{child.guardianName}</span>
                        </p>
                        <p className="text-[11px] text-gray-500 truncate mt-0.5">
                            📍 {child.address}
                        </p>
                    </div>
                </div>

                {/* 2. DATA SECTION (Col 4-8) - All 17 exact fields for the active selected month */}
                <div className="lg:col-span-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-gray-100 lg:pl-6 pt-4 lg:pt-0">
                    <div>
                        <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-100">
                            <h4 className="text-xs font-black uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Anthropometric & Clinical Data
                            </h4>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                                    {reportMonthDisplay}
                                </span>
                                <span className="text-[11px] font-semibold text-gray-400">17 Parameters</span>
                            </div>
                        </div>

                        {/* Responsive Data Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                            {/* NAME */}
                            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                                <span className="text-[10px] uppercase font-bold text-gray-500 block">NAME</span>
                                <span className="font-bold text-gray-900 truncate block">{child.name}</span>
                            </div>

                            {/* Anthropometric Measurement */}
                            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                                <span className="text-[10px] uppercase font-bold text-gray-500 block">Anthropometric</span>
                                <span className="font-semibold text-blue-700 truncate block">{activeData.anthropometricMeasurement}</span>
                            </div>

                            {/* Sex */}
                            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                                <span className="text-[10px] uppercase font-bold text-gray-500 block">Sex</span>
                                <span className="font-bold text-gray-900 block">{child.sex}</span>
                            </div>

                            {/* Date of Entry */}
                            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                                <span className="text-[10px] uppercase font-bold text-gray-500 block">Date of Entry (M/D/Y)</span>
                                <span className="font-semibold text-gray-800 block">{activeData.dateOfEntry}</span>
                            </div>

                            {/* GUARDIAN NAME */}
                            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                                <span className="text-[10px] uppercase font-bold text-gray-500 block">GUARDIAN NAME</span>
                                <span className="font-bold text-gray-900 truncate block">{child.guardianName}</span>
                            </div>

                            {/* Date of Birth */}
                            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                                <span className="text-[10px] uppercase font-bold text-gray-500 block">Date of Birth</span>
                                <span className="font-semibold text-gray-800 block">{child.dateOfBirth || "N/A"}</span>
                            </div>

                            {/* AGE */}
                            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                                <span className="text-[10px] uppercase font-bold text-gray-500 block">AGE</span>
                                <span className="font-bold text-gray-900 block">{activeData.age || child.age}</span>
                            </div>

                            {/* WEIGHT (Kg) */}
                            <div className="bg-blue-50/60 p-2 rounded-xl border border-blue-100/70">
                                <span className="text-[10px] uppercase font-bold text-blue-700 block">WEIGHT (Kg)</span>
                                <span className="font-black text-blue-900 text-sm block">{activeData.weight} kg</span>
                            </div>

                            {/* HEIGHT (cm) */}
                            <div className="bg-blue-50/60 p-2 rounded-xl border border-blue-100/70">
                                <span className="text-[10px] uppercase font-bold text-blue-700 block">HEIGHT (cm)</span>
                                <span className="font-black text-blue-900 text-sm block">{activeData.height} cm</span>
                            </div>

                            {/* MUAC (cm) */}
                            <div className={`p-2 rounded-xl border ${analysis.muacStatus.badgeColor}`}>
                                <span className="text-[10px] uppercase font-black block">MUAC (cm)</span>
                                <span className="font-black text-sm block">{activeData.muac} cm</span>
                            </div>

                            {/* Head (cm) */}
                            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                                <span className="text-[10px] uppercase font-bold text-gray-500 block">Head (cm)</span>
                                <span className="font-bold text-gray-800 block">{activeData.head} cm</span>
                            </div>

                            {/* Chest (cm) */}
                            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                                <span className="text-[10px] uppercase font-bold text-gray-500 block">Chest (cm)</span>
                                <span className="font-bold text-gray-800 block">{activeData.chest} cm</span>
                            </div>

                            {/* Last 14 days Illness */}
                            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
                                <span className="text-[10px] uppercase font-bold text-gray-500 block">Last 14d Illness</span>
                                <span className={`font-semibold truncate block ${activeData.last14DaysIllness.toLowerCase().includes("none") ? "text-emerald-700" : "text-amber-700"}`}>
                                    {activeData.last14DaysIllness}
                                </span>
                            </div>

                            {/* EBF */}
                            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                                <span className="text-[10px] uppercase font-bold text-gray-500 block">EBF</span>
                                <span className="font-bold text-gray-800 truncate block">{activeData.ebf}</span>
                            </div>

                            {/* Immunization */}
                            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                                <span className="text-[10px] uppercase font-bold text-gray-500 block">Immunization</span>
                                <span className="font-semibold text-emerald-700 truncate block">{activeData.immunization}</span>
                            </div>
                        </div>

                        {/* REMARKS & ADDRESS */}
                        <div className="mt-3 space-y-1.5 text-xs">
                            <div className="bg-amber-50/60 p-2 rounded-xl border border-amber-200/50 flex items-start gap-1.5">
                                <span className="text-[10px] uppercase font-black text-amber-800 whitespace-nowrap">REMARKS:</span>
                                <span className="text-gray-700 text-[11px] leading-tight">{activeData.remarks || "No clinical remarks recorded."}</span>
                            </div>
                            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-start gap-1.5">
                                <span className="text-[10px] uppercase font-black text-gray-500 whitespace-nowrap">ADDRESS:</span>
                                <span className="text-gray-700 text-[11px] leading-tight truncate">{child.address}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. BESIDE DASHBOARD: REAL-TIME NUTRITIONAL & GROWTH DASHBOARD (Col 9-12) */}
                <div className="lg:col-span-4 bg-gradient-to-br from-slate-50 to-blue-50/40 rounded-2xl p-5 border border-blue-100 flex flex-col justify-between shadow-inner">
                    <div>
                        {/* Dashboard Header with Month Tag */}
                        <div className="flex items-center justify-between pb-3 border-b border-blue-200/60">
                            <div>
                                <span className="text-[10px] font-black tracking-widest uppercase text-blue-600 block">
                                    Real-Time Dashboard
                                </span>
                                <h4 className="text-sm font-black text-gray-900">
                                    Growth & Recovery Status
                                </h4>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                                    Live Logic
                                </span>
                                <span className="text-[10px] font-bold text-blue-800">
                                    📅 {reportMonthDisplay}
                                </span>
                            </div>
                        </div>

                        {/* Circular Meter + Stage Info */}
                        <div className="my-4 flex items-center justify-around gap-4">
                            {/* Circular Percentage Meter */}
                            <div className="relative w-24 h-24 flex items-center justify-center">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r={radius}
                                        stroke="#E2E8F0"
                                        strokeWidth="8"
                                        fill="transparent"
                                    />
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r={radius}
                                        stroke={analysis.stageColor.accent}
                                        strokeWidth="8"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={strokeDashoffset}
                                        strokeLinecap="round"
                                        fill="transparent"
                                        className="transition-all duration-1000 ease-out"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                    <span className="text-xl font-black text-gray-900 leading-none">
                                        {analysis.percentage}%
                                    </span>
                                    <span className="text-[9px] uppercase font-bold text-gray-500 mt-0.5">
                                        Recovery
                                    </span>
                                </div>
                            </div>

                            {/* Stage Summary Details */}
                            <div className="flex-1 space-y-1.5">
                                <div className="text-[11px] text-gray-500 font-medium">Growth Journey Stage:</div>
                                <div className={`text-xs font-black px-2.5 py-1 rounded-lg inline-block border ${analysis.stageColor.bg} ${analysis.stageColor.text} ${analysis.stageColor.border}`}>
                                    {analysis.stage}
                                </div>
                                <p className="text-[11px] text-gray-600 leading-tight">
                                    {analysis.statusSummary}
                                </p>
                            </div>
                        </div>

                        {/* Stepped Journey Bar: SAM -> MAM -> Recovery -> Healthy */}
                        <div className="bg-white p-3 rounded-xl border border-blue-100/80 mb-3 shadow-xs">
                            <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 mb-1.5">
                                <span>SAM (Severe)</span>
                                <span>MAM (Moderate)</span>
                                <span>Recovery</span>
                                <span>Healthy Child</span>
                            </div>

                            {/* Visual Track */}
                            <div className="relative h-2.5 bg-gray-200 rounded-full overflow-hidden flex">
                                <div className="w-1/4 bg-red-400"></div>
                                <div className="w-1/4 bg-amber-400"></div>
                                <div className="w-1/4 bg-blue-400"></div>
                                <div className="w-1/4 bg-emerald-400"></div>

                                {/* Active Marker Bar */}
                                <div
                                    className="absolute top-0 bottom-0 left-0 bg-blue-900/40 rounded-full transition-all duration-700"
                                    style={{ width: `${Math.max(10, analysis.percentage)}%` }}
                                ></div>
                            </div>

                            <div className="flex items-center justify-between mt-2">
                                {stages.map((stg, i) => {
                                    const isCurrent = i === currentStageIndex;
                                    const isPassed = i <= currentStageIndex;
                                    return (
                                        <div key={stg.label} className="flex flex-col items-center">
                                            <div
                                                className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold ${isCurrent
                                                    ? `${stg.color} text-white ring-4 ${stg.ring} animate-bounce`
                                                    : isPassed
                                                        ? `${stg.color} text-white`
                                                        : "bg-gray-200 text-gray-400"
                                                    }`}
                                            >
                                                {isPassed ? "✓" : i + 1}
                                            </div>
                                            <span className={`text-[9px] mt-1 font-bold ${isCurrent ? stg.text : "text-gray-400"}`}>
                                                {stg.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 5-Parameter WHO Anthropometric Comparison Signals */}
                        <div className="space-y-1.5 text-xs">
                            <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-gray-100">
                                <span className="text-[11px] text-gray-600 font-medium">MUAC ({activeData.muac} cm):</span>
                                <span className={`text-[11px] font-bold ${analysis.muacStatus.color}`}>
                                    {analysis.muacStatus.label}
                                </span>
                            </div>
                            <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-gray-100">
                                <span className="text-[11px] text-gray-600 font-medium">Weight ({activeData.weight} kg):</span>
                                <span className="text-[11px] font-bold text-gray-800">
                                    WHO Ref: {analysis.parameters.weight.expected} kg ({analysis.parameters.weight.ratioPercentage}%)
                                </span>
                            </div>
                            <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-gray-100">
                                <span className="text-[11px] text-gray-600 font-medium">Height ({activeData.height} cm):</span>
                                <span className="text-[11px] font-bold text-gray-800">
                                    WHO Ref: {analysis.parameters.height.expected} cm ({analysis.parameters.height.ratioPercentage}%)
                                </span>
                            </div>
                            <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-gray-100 text-[10px]">
                                <span className="text-gray-600 font-medium">Head: <strong>{activeData.head || child.head || "—"} cm</strong> (Ref: {analysis.parameters.head.expected})</span>
                                <span className="text-gray-600 font-medium">Chest: <strong>{activeData.chest || child.chest || "—"} cm</strong> (Ref: {analysis.parameters.chest.expected})</span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Action / Details */}
                    <div className="mt-4 pt-3 border-t border-blue-200/50 flex items-center justify-between gap-2">
                        <span className="text-[10px] text-gray-500 italic">
                            WHO protocol evaluated
                        </span>
                        {onViewDetails && (
                            <button
                                onClick={() => onViewDetails({ ...child, ...activeData }, analysis)}
                                className="text-xs font-bold text-blue-700 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                            >
                                <span>Clinical Report</span>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

            </div>

            {/* ══════ EXPAND BUTTON — shows only when older months exist ══════ */}
            {hasSubReports && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold transition-all cursor-pointer border-t ${
                        isExpanded
                            ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                            : "bg-blue-50 text-blue-700 border-blue-200/80 hover:bg-blue-100"
                    }`}
                >
                    <svg
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                    <span>
                        {isExpanded
                            ? "Hide previous months"
                            : `View ${subReports.length} previous month${subReports.length > 1 ? "s" : ""} — Growth History`}
                    </span>
                    {!isExpanded && (
                        <span className="ml-1 px-1.5 py-0.5 rounded-full bg-blue-200/70 text-blue-800 text-[10px] font-black">
                            {subReports.length}
                        </span>
                    )}
                </button>
            )}

            {/* ══════ SUB-MONTH ROWS — collapsed by default ══════ */}
            {hasSubReports && isExpanded && (
                <div className="border-t border-blue-200 bg-blue-50/40 divide-y divide-blue-100">
                    <div className="px-5 py-2.5 bg-blue-100/70 border-b border-blue-200/80 text-xs font-bold text-blue-950 flex flex-wrap items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5">
                            <span>💡</span>
                            <span>Click any month below to display its details &amp; live dashboard in the parent section above</span>
                        </span>
                        <span className="text-[11px] text-blue-700 font-semibold bg-white/60 px-2 py-0.5 rounded">
                            Temporary View (resets on refresh)
                        </span>
                    </div>

                    {subReports.map((r: any, idx: number) => {
                        const subAnalysis = calculateChildNutritionStatus({
                            weight: r.weight,
                            height: r.height,
                            muac: r.muac,
                            head: r.head || child.head,
                            chest: r.chest || child.chest,
                            sex: child.sex,
                            age: r.age || child.age,
                            dateOfBirth: child.dateOfBirth,
                            dateOfEntry: r.dateOfEntry,
                            anthropometricMeasurement: r.anthropometricMeasurement,
                            last14DaysIllness: r.last14DaysIllness,
                            ebf: r.ebf,
                            immunization: r.immunization,
                            baselineWeight: child.baselineWeight,
                            targetWeight: child.targetWeight,
                            baselineMuac: child.baselineMuac,
                            targetMuac: child.targetMuac,
                            customRecoveryPercentage: r.customRecoveryPercentage,
                        }, config);
                        const isCurrentlyActive = activeMonth.toLowerCase() === r.reportMonth.toLowerCase();

                        return (
                            <div
                                key={idx}
                                onClick={() => handleSelectSubMonth(r.reportMonth)}
                                className={`p-4 flex flex-col sm:flex-row sm:items-center gap-4 transition-all cursor-pointer ${
                                    isCurrentlyActive
                                        ? "bg-blue-100/80 border-l-4 border-l-blue-600 shadow-sm ring-1 ring-blue-300/60"
                                        : "hover:bg-blue-100/40 border-l-4 border-l-transparent"
                                }`}
                                title={`Click to view ${r.reportMonth} details and dashboard in the parent card`}
                            >
                                {/* Month label + date */}
                                <div className="flex items-center gap-3 min-w-[160px]">
                                    <div className={`w-1 self-stretch rounded-full flex-shrink-0 ${isCurrentlyActive ? "bg-blue-600" : "bg-blue-300"}`} />
                                    <div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Previous Entry</span>
                                            {isCurrentlyActive && (
                                                <span className="text-[9px] font-black text-blue-700 bg-blue-200/80 px-1.5 py-0.2 rounded">
                                                    ACTIVE ABOVE
                                                </span>
                                            )}
                                        </div>
                                        <div className="font-black text-blue-900 text-sm mt-0.5 flex items-center gap-1">
                                            <span>📅</span>
                                            <span>{r.reportMonth}</span>
                                        </div>
                                        <div className="text-[10px] text-gray-500 mt-0.5">{r.dateOfEntry}</div>
                                    </div>
                                </div>

                                {/* Key clinical metrics */}
                                <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                                    <div className="bg-white rounded-xl p-2 border border-gray-100 shadow-xs">
                                        <span className="text-[9px] text-gray-400 font-bold uppercase block">Age</span>
                                        <span className="font-bold text-gray-800">{r.age}</span>
                                    </div>
                                    <div className="bg-white rounded-xl p-2 border border-gray-100 shadow-xs">
                                        <span className="text-[9px] text-gray-400 font-bold uppercase block">Weight</span>
                                        <span className="font-bold text-blue-700">{r.weight} kg</span>
                                    </div>
                                    <div className="bg-white rounded-xl p-2 border border-gray-100 shadow-xs">
                                        <span className="text-[9px] text-gray-400 font-bold uppercase block">MUAC</span>
                                        <span className={`font-bold ${subAnalysis.muacStatus.color}`}>{r.muac} cm</span>
                                    </div>
                                    <div className="bg-white rounded-xl p-2 border border-gray-100 shadow-xs">
                                        <span className="text-[9px] text-gray-400 font-bold uppercase block">Height</span>
                                        <span className="font-bold text-gray-800">{r.height} cm</span>
                                    </div>
                                </div>

                                {/* Recovery mini-bar + status + Action CTA */}
                                <div className="flex items-center gap-3 flex-shrink-0 min-w-[210px] justify-between sm:justify-end">
                                    <div className="text-right">
                                        <div className="flex items-center justify-end gap-1 mb-0.5">
                                            <span className="text-[9px] text-gray-500 font-bold uppercase">Recovery:</span>
                                            <span className="font-black text-sm text-gray-900">{subAnalysis.percentage}%</span>
                                        </div>
                                        <div className="w-20 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                            <div
                                                className="h-1.5 rounded-full transition-all"
                                                style={{ width: `${subAnalysis.percentage}%`, backgroundColor: subAnalysis.stageColor.accent }}
                                            />
                                        </div>
                                        <span className={`mt-1 text-[9px] font-bold px-1.5 py-0.2 rounded-full border inline-block ${subAnalysis.stageColor.bg} ${subAnalysis.stageColor.text} ${subAnalysis.stageColor.border}`}>
                                            {subAnalysis.stage}
                                        </span>
                                    </div>

                                    {/* View In Dashboard Button / Indicator */}
                                    {isCurrentlyActive ? (
                                        <div className="px-2.5 py-1.5 bg-blue-600 text-white rounded-xl text-[11px] font-bold flex items-center gap-1 shadow-xs">
                                            <span>✓</span>
                                            <span>Showing</span>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSelectSubMonth(r.reportMonth);
                                            }}
                                            className="px-2.5 py-1.5 bg-white hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 rounded-xl text-[11px] font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer group/btn"
                                        >
                                            <span>View</span>
                                            <span className="group-hover/btn:translate-x-0.5 transition-transform">↗</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
