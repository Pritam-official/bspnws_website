"use client";

import React, { useState, useEffect, useMemo } from "react";
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

const MONTH_NAMES = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december"
];

function formatDateDDMMYY(dateStr?: string): string {
    if (!dateStr) return "N/A";
    const trimmed = dateStr.trim();
    const parts = trimmed.split(/[\/\-]/);
    if (parts.length === 3) {
        let day = 0;
        let month = 0;
        let year = 0;
        if (parts[0].length === 4) {
            year = parseInt(parts[0], 10);
            month = parseInt(parts[1], 10);
            day = parseInt(parts[2], 10);
        } else {
            month = parseInt(parts[0], 10);
            day = parseInt(parts[1], 10);
            year = parseInt(parts[2], 10);
        }
        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
            const dd = String(day).padStart(2, "0");
            const mm = String(month).padStart(2, "0");
            const yy = String(year).slice(-2);
            return `${dd}/${mm}/${yy}`;
        }
    }
    const d = new Date(trimmed);
    if (!isNaN(d.getTime())) {
        const dd = String(d.getDate()).padStart(2, "0");
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const yy = String(d.getFullYear()).slice(-2);
        return `${dd}/${mm}/${yy}`;
    }
    return dateStr;
}

function parseMonthYear(str?: string): { year: number; month: number } | null {
    if (!str) return null;
    const trimmed = str.trim();

    const words = trimmed.split(/\s+/);
    if (words.length >= 2) {
        const monthWord = words[0].toLowerCase();
        const yearNum = parseInt(words[1], 10);
        const mIdx = MONTH_NAMES.findIndex(m => m.startsWith(monthWord.slice(0, 3)));
        if (mIdx !== -1 && !isNaN(yearNum)) {
            return { year: yearNum, month: mIdx + 1 };
        }
    }

    const parts = trimmed.split(/[\/\-]/);
    if (parts.length === 3) {
        if (parts[0].length === 4) {
            const yearNum = parseInt(parts[0], 10);
            const monthNum = parseInt(parts[1], 10);
            if (!isNaN(yearNum) && !isNaN(monthNum)) return { year: yearNum, month: monthNum };
        } else {
            const monthNum = parseInt(parts[0], 10);
            const yearNum = parseInt(parts[2], 10);
            if (!isNaN(yearNum) && !isNaN(monthNum)) return { year: yearNum, month: monthNum };
        }
    }

    const d = new Date(trimmed);
    if (!isNaN(d.getTime())) {
        return { year: d.getFullYear(), month: d.getMonth() + 1 };
    }

    return null;
}

function calculateMilestonesBetween(startDateStr?: string, endDateStr?: string): number {
    const start = parseMonthYear(startDateStr);
    const end = parseMonthYear(endDateStr);

    if (start && end) {
        const diff = (end.year - start.year) * 12 + (end.month - start.month) + 1;
        return Math.max(1, diff);
    }
    return 1;
}

export default function ChildCard({ child, selectedMonth, config }: ChildCardProps) {
    const [imgError, setImgError] = useState(false);

    // Get all month reports for this child in chronological order
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

    // Enrollment data: The 1st report when child was registered
    const enrollmentData = useMemo(() => {
        return reports[0] || child;
    }, [reports, child]);

    // Release / Latest data: Default to latest month, or active selection
    const latestReport = reports[reports.length - 1] || child;
    const latestMonthLabel = latestReport.reportMonth || formatReportMonth(latestReport.dateOfEntry);

    // Active month selected for release dashboard preview
    const [activeMonth, setActiveMonth] = useState<string>(() => {
        if (selectedMonth && selectedMonth !== "ALL") {
            const found = reports.find(r => r.reportMonth.toLowerCase() === selectedMonth.toLowerCase());
            if (found) return found.reportMonth;
        }
        return latestMonthLabel;
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

    // Active data for Dashboard 2 (Release Time Data)
    const releaseData = useMemo(() => {
        const found = reports.find(r => r.reportMonth.toLowerCase() === activeMonth.toLowerCase());
        return found || latestReport;
    }, [reports, activeMonth, latestReport]);

    // 1. Compute dynamic analysis for ENROLLMENT TIME DATA (Dashboard 1)
    const enrollmentAnalysis: ChildNutritionAnalysis = useMemo(() => {
        return calculateChildNutritionStatus({
            weight: enrollmentData.weight,
            height: enrollmentData.height,
            muac: enrollmentData.muac,
            head: enrollmentData.head || child.head,
            chest: enrollmentData.chest || child.chest,
            sex: child.sex,
            age: enrollmentData.age || child.age,
            dateOfBirth: child.dateOfBirth,
            dateOfEntry: enrollmentData.dateOfEntry,
            anthropometricMeasurement: enrollmentData.anthropometricMeasurement,
            last14DaysIllness: enrollmentData.last14DaysIllness,
            ebf: enrollmentData.ebf,
            immunization: enrollmentData.immunization,
            baselineWeight: child.baselineWeight || enrollmentData.weight,
            targetWeight: child.targetWeight,
            baselineMuac: child.baselineMuac || enrollmentData.muac,
            targetMuac: child.targetMuac,
            customRecoveryPercentage: enrollmentData.customRecoveryPercentage,
        }, config);
    }, [enrollmentData, child, config]);

    // 2. Compute dynamic analysis for RELEASE TIME DATA (Dashboard 2)
    const releaseAnalysis: ChildNutritionAnalysis = useMemo(() => {
        return calculateChildNutritionStatus({
            weight: releaseData.weight,
            height: releaseData.height,
            muac: releaseData.muac,
            head: releaseData.head || child.head,
            chest: releaseData.chest || child.chest,
            sex: child.sex,
            age: releaseData.age || child.age,
            dateOfBirth: child.dateOfBirth,
            dateOfEntry: releaseData.dateOfEntry,
            anthropometricMeasurement: releaseData.anthropometricMeasurement,
            last14DaysIllness: releaseData.last14DaysIllness,
            ebf: releaseData.ebf,
            immunization: releaseData.immunization,
            baselineWeight: child.baselineWeight || enrollmentData.weight,
            targetWeight: child.targetWeight,
            baselineMuac: child.baselineMuac || enrollmentData.muac,
            targetMuac: child.targetMuac,
            customRecoveryPercentage: releaseData.customRecoveryPercentage,
        }, config);
    }, [releaseData, child, enrollmentData, config]);

    const enrollmentMonthDisplay = enrollmentData.reportMonth || formatReportMonth(enrollmentData.dateOfEntry);
    const releaseMonthDisplay = releaseData.reportMonth || formatReportMonth(releaseData.dateOfEntry);

    const calculatedMilestones = useMemo(() => {
        return calculateMilestonesBetween(enrollmentMonthDisplay, releaseMonthDisplay);
    }, [enrollmentMonthDisplay, releaseMonthDisplay]);

    const hasMultipleMonths = reports.length > 1;
    const recoveryProgress = releaseAnalysis.percentage - enrollmentAnalysis.percentage;

    // Radius & circumference for circular progress meters
    const radius = 38;
    const circumference = 2 * Math.PI * radius;
    const enrollmentStrokeOffset = circumference - (enrollmentAnalysis.percentage / 100) * circumference;
    const releaseStrokeOffset = circumference - (releaseAnalysis.percentage / 100) * circumference;

    const stages = [
        { label: "SAM", key: "SAM", color: "bg-red-500", text: "text-red-700", ring: "ring-red-400" },
        { label: "MAM", key: "MAM", color: "bg-amber-500", text: "text-amber-800", ring: "ring-amber-400" },
        { label: "Recovery", key: "Nutritional Transition", color: "bg-blue-500", text: "text-blue-800", ring: "ring-blue-400" },
        { label: "Healthy", key: "Healthy / Nourished", color: "bg-emerald-500", text: "text-emerald-800", ring: "ring-emerald-400" },
    ];

    const enrollmentStageIndex = stages.findIndex((s) => s.key === enrollmentAnalysis.stage);
    const releaseStageIndex = stages.findIndex((s) => s.key === releaseAnalysis.stage);

    return (
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">

            {/* Top Header Bar */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 text-white">
                <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <h3 className="font-bold text-lg tracking-wide text-white flex items-center gap-2">
                        {child.name}
                        <span className="text-xs font-normal text-blue-200 bg-blue-900/60 px-2 py-0.5 rounded-full border border-blue-700/50">
                            {child.sex} • {releaseData.age || child.age}
                        </span>
                    </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    {/* Months selector pills if multiple reports exist */}
                    {reports.length > 1 && (
                        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/15">
                            <span className="text-[10px] text-blue-200 uppercase font-bold px-1.5 hidden sm:inline">
                                Milestones ({reports.length}):
                            </span>
                            {reports.map((r: any) => {
                                const isCurrentActive = activeMonth.toLowerCase() === r.reportMonth.toLowerCase();
                                return (
                                    <button
                                        key={r.reportMonth}
                                        onClick={() => setActiveMonth(r.reportMonth)}
                                        className={`px-2.5 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${isCurrentActive
                                            ? "bg-blue-600 text-white shadow-md shadow-blue-500/40 ring-1 ring-blue-300"
                                            : "text-gray-300 hover:text-white hover:bg-white/10"
                                            }`}
                                    >
                                        📅 {r.reportMonth}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    <div className="flex items-center gap-1.5">
                        <span className="text-xs text-gray-300 hidden sm:inline">Overall Status:</span>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${releaseAnalysis.stageColor.bg} ${releaseAnalysis.stageColor.text} ${releaseAnalysis.stageColor.border}`}>
                            {releaseData.anthropometricMeasurement || releaseAnalysis.stage}
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
                            Comparing in Release Dashboard: <strong className="text-blue-950 bg-white px-2 py-0.5 rounded-md border border-amber-300 font-black">📅 {activeMonth}</strong>
                        </span>
                    </div>
                    <button
                        onClick={() => setActiveMonth(latestMonthLabel)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-lg text-[11px] font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                        <span>↩</span>
                        <span>Restore Latest ({latestMonthLabel})</span>
                    </button>
                </div>
            )}

            {/* MAIN CARD BODY: BALANCED 3-COLUMN LAYOUT (Image & Identity + Dashboard 1 Enrollment + Dashboard 2 Release) */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

                {/* ══════════════════════════════════════════════════════════════
                    1. IMAGE & CHILD IDENTITY (Col 1-4 on LG: 33.3% Width)
                    (NO GUARDIAN NAME)
                ══════════════════════════════════════════════════════════════ */}
                <div className="lg:col-span-4 flex flex-col justify-between bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
                    <div>
                        <div className="relative w-full aspect-[4/4] rounded-2xl overflow-hidden bg-gray-100 border-2 border-gray-200/80 shadow-inner group/img">
                            {child.image && !imgError ? (
                                <Image
                                    src={child.image}
                                    alt={child.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 400px"
                                    className="object-cover group-hover/img:scale-105 transition-transform duration-500"
                                    onError={() => setImgError(true)}
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-600 p-4">
                                    <svg className="w-16 h-16 text-blue-400/80 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span className="text-xs font-semibold text-blue-800 text-center uppercase tracking-wider">
                                        Nutrition Beneficiary
                                    </span>
                                </div>
                            )}

                            {/* Floating Current Stage Badge */}
                            <div className="absolute top-2.5 left-2.5">
                                <span className={`px-2.5 py-1 rounded-lg text-[11px] font-black shadow-md uppercase tracking-wider backdrop-blur-md ${releaseAnalysis.stageColor.bg} ${releaseAnalysis.stageColor.text} border ${releaseAnalysis.stageColor.border}`}>
                                    {releaseAnalysis.stage}
                                </span>
                            </div>

                            {/* Date Badge Overlay */}
                            <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-black/75 backdrop-blur-md text-white text-[11px] font-medium py-1.5 px-2.5 rounded-lg text-center flex items-center justify-center gap-1.5 border border-white/20">
                                <span>📅</span>
                                <span>Latest: {releaseMonthDisplay}</span>
                            </div>
                        </div>

                        {/* Child Basic Details & Address (NO GUARDIAN NAME) */}
                        <div className="mt-3.5 space-y-2 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500 font-semibold">Location:</span>
                                <span className="font-bold text-gray-800 truncate max-w-[180px]">📍 {child.address}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500 font-semibold">Enrolled Date:</span>
                                <span className="font-bold text-blue-900">{formatDateDDMMYY(enrollmentData.dateOfEntry)}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500 font-semibold">Milestone Assessments:</span>
                                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-[11px]">
                                    {calculatedMilestones} Milestone{calculatedMilestones > 1 ? "s" : ""}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Growth Journey Summary Banner */}
                    <div className="mt-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-3 rounded-xl text-center">
                        <span className="text-[10px] uppercase font-bold text-blue-800 block">Overall Growth Journey</span>
                        <span className="text-sm font-black text-blue-950">
                            {hasMultipleMonths
                                ? recoveryProgress >= 0
                                    ? `+${recoveryProgress}% Recovery Gain`
                                    : `${recoveryProgress}% Progress`
                                : "Active in Supervised Care"}
                        </span>
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════════════════
                    2. DASHBOARD 1: ENROLLMENT TIME DATA (Col 5-8 on LG: 33.3% Width)
                    (RAW ANTHROPOMETRIC DATA HIDDEN)
                ══════════════════════════════════════════════════════════════ */}
                <div className="lg:col-span-4 bg-gradient-to-br from-slate-50 to-blue-50/40 rounded-2xl p-5 border border-slate-200/90 flex flex-col justify-between shadow-xs">
                    <div>
                        {/* Dashboard 1 Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                            <div className="flex items-center gap-1.5">
                                <span className="text-lg">🌱</span>
                                <div>
                                    <span className="text-[9px] font-black tracking-widest uppercase text-slate-500 block">
                                        DASHBOARD 1
                                    </span>
                                    <h4 className="text-sm font-black text-slate-900">
                                        Enrollment Time Data
                                    </h4>
                                </div>
                            </div>
                            <span className="text-[10px] font-bold text-blue-900 bg-blue-100/80 px-2.5 py-1 rounded-lg border border-blue-200">
                                📅 {enrollmentMonthDisplay}
                            </span>
                        </div>

                        {/* Circular Meter + Stage Info */}
                        <div className="my-5 flex items-center justify-around gap-4">
                            <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
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
                                        stroke={enrollmentAnalysis.stageColor.accent}
                                        strokeWidth="8"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={enrollmentStrokeOffset}
                                        strokeLinecap="round"
                                        fill="transparent"
                                        className="transition-all duration-1000 ease-out"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                    <span className="text-lg font-black text-gray-900 leading-none">
                                        {enrollmentAnalysis.percentage}%
                                    </span>
                                    <span className="text-[9px] uppercase font-bold text-gray-500 mt-0.5">
                                        Initial
                                    </span>
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <span className="text-[10px] text-gray-500 font-bold block mb-1">Enrollment Stage:</span>
                                <span className={`text-xs font-black px-2.5 py-1 rounded-md inline-block border truncate max-w-full ${enrollmentAnalysis.stageColor.bg} ${enrollmentAnalysis.stageColor.text} ${enrollmentAnalysis.stageColor.border}`}>
                                    {enrollmentAnalysis.stage}
                                </span>
                                <p className="text-[11px] text-gray-600 mt-1.5 line-clamp-3 leading-snug">
                                    {enrollmentAnalysis.statusSummary}
                                </p>
                            </div>
                        </div>

                        {/* Visual Stage Progress at Enrollment */}
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 mb-4 shadow-2xs">
                            <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 mb-1.5">
                                <span>SAM (Severe)</span>
                                <span>MAM</span>
                                <span>Recovery</span>
                                <span>Healthy</span>
                            </div>
                            <div className="relative h-2.5 bg-gray-200 rounded-full overflow-hidden flex">
                                <div className="w-1/4 bg-red-400"></div>
                                <div className="w-1/4 bg-amber-400"></div>
                                <div className="w-1/4 bg-blue-400"></div>
                                <div className="w-1/4 bg-emerald-400"></div>
                                <div
                                    className="absolute top-0 bottom-0 left-0 bg-slate-900/40 rounded-full transition-all duration-700"
                                    style={{ width: `${Math.max(10, enrollmentAnalysis.percentage)}%` }}
                                ></div>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                {stages.map((stg, i) => (
                                    <div key={stg.label} className="flex flex-col items-center">
                                        <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold ${
                                            i === enrollmentStageIndex ? `${stg.color} text-white ring-2 ${stg.ring}` : i <= enrollmentStageIndex ? `${stg.color} text-white` : "bg-gray-200 text-gray-400"
                                        }`}>
                                            {i <= enrollmentStageIndex ? "✓" : i + 1}
                                        </div>
                                        <span className={`text-[9px] mt-0.5 font-bold ${i === enrollmentStageIndex ? stg.text : "text-gray-400"}`}>
                                            {stg.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Intake Clinical Summary Card (REPLACES RAW DATA) */}
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs shadow-2xs">
                            <div className="flex items-center justify-between text-[11px]">
                                <span className="text-gray-500 font-semibold">Intake Classification:</span>
                                <span className="font-bold text-slate-800">
                                    {enrollmentData.anthropometricMeasurement || enrollmentAnalysis.stage}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px]">
                                <span className="text-gray-500 font-semibold">Assessment Protocol:</span>
                                <span className="font-bold text-blue-900">
                                    WHO Growth Reference Standard
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px]">
                                <span className="text-gray-500 font-semibold">Intake Evaluation:</span>
                                <span className={`font-bold ${enrollmentAnalysis.muacStatus.color}`}>
                                    {enrollmentAnalysis.muacStatus.label}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200 text-center">
                        <span className="text-[10px] font-semibold text-slate-500">
                            Baseline Registration Record at Intake ({formatDateDDMMYY(enrollmentData.dateOfEntry)})
                        </span>
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════════════════
                    3. DASHBOARD 2: RELEASE TIME DATA (Col 9-12 on LG: 33.3% Width)
                    (RAW ANTHROPOMETRIC DATA HIDDEN)
                ══════════════════════════════════════════════════════════════ */}
                <div className="lg:col-span-4 bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-blue-50/40 rounded-2xl p-5 border border-emerald-200 flex flex-col justify-between shadow-xs">
                    <div>
                        {/* Dashboard 2 Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
                            <div className="flex items-center gap-1.5">
                                <span className="text-lg">🏆</span>
                                <div>
                                    <span className="text-[9px] font-black tracking-widest uppercase text-emerald-700 block">
                                        DASHBOARD 2
                                    </span>
                                    <h4 className="text-sm font-black text-gray-900">
                                        {hasMultipleMonths ? "Released / Latest Time Data" : "Current Progress Data"}
                                    </h4>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300">
                                    📅 {releaseMonthDisplay}
                                </span>
                                {hasMultipleMonths && (
                                    <span className="text-[9px] font-bold text-emerald-700 mt-0.5">
                                        Latest Milestone
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Circular Meter + Stage Info */}
                        <div className="my-5 flex items-center justify-around gap-4">
                            <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
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
                                        stroke={releaseAnalysis.stageColor.accent}
                                        strokeWidth="8"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={releaseStrokeOffset}
                                        strokeLinecap="round"
                                        fill="transparent"
                                        className="transition-all duration-1000 ease-out"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                    <span className="text-lg font-black text-gray-900 leading-none">
                                        {releaseAnalysis.percentage}%
                                    </span>
                                    <span className="text-[9px] uppercase font-bold text-gray-500 mt-0.5">
                                        {hasMultipleMonths ? "Release" : "Current"}
                                    </span>
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <span className="text-[10px] text-gray-500 font-bold block mb-1">
                                    {hasMultipleMonths ? "Released Stage:" : "Current Stage:"}
                                </span>
                                <span className={`text-xs font-black px-2.5 py-1 rounded-md inline-block border truncate max-w-full ${releaseAnalysis.stageColor.bg} ${releaseAnalysis.stageColor.text} ${releaseAnalysis.stageColor.border}`}>
                                    {releaseAnalysis.stage}
                                </span>
                                <p className="text-[11px] text-gray-600 mt-1.5 line-clamp-3 leading-snug">
                                    {releaseAnalysis.statusSummary}
                                </p>
                            </div>
                        </div>

                        {/* Visual Stage Progress at Release */}
                        <div className="bg-white p-3.5 rounded-xl border border-emerald-100 mb-4 shadow-2xs">
                            <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 mb-1.5">
                                <span>SAM (Severe)</span>
                                <span>MAM</span>
                                <span>Recovery</span>
                                <span>Healthy</span>
                            </div>
                            <div className="relative h-2.5 bg-gray-200 rounded-full overflow-hidden flex">
                                <div className="w-1/4 bg-red-400"></div>
                                <div className="w-1/4 bg-amber-400"></div>
                                <div className="w-1/4 bg-blue-400"></div>
                                <div className="w-1/4 bg-emerald-400"></div>
                                <div
                                    className="absolute top-0 bottom-0 left-0 bg-emerald-700/60 rounded-full transition-all duration-700"
                                    style={{ width: `${Math.max(10, releaseAnalysis.percentage)}%` }}
                                ></div>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                {stages.map((stg, i) => (
                                    <div key={stg.label} className="flex flex-col items-center">
                                        <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold ${
                                            i === releaseStageIndex ? `${stg.color} text-white ring-2 ${stg.ring} animate-bounce` : i <= releaseStageIndex ? `${stg.color} text-white` : "bg-gray-200 text-gray-400"
                                        }`}>
                                            {i <= releaseStageIndex ? "✓" : i + 1}
                                        </div>
                                        <span className={`text-[9px] mt-0.5 font-bold ${i === releaseStageIndex ? stg.text : "text-gray-400"}`}>
                                            {stg.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Release Milestone & Recovery Outcome Card (REPLACES RAW DATA) */}
                        <div className="bg-white p-3.5 rounded-xl border border-emerald-100 space-y-2 text-xs shadow-2xs">
                            <div className="flex items-center justify-between text-[11px]">
                                <span className="text-gray-500 font-semibold">Recovery Outcome:</span>
                                <span className="font-bold text-emerald-800">
                                    {releaseAnalysis.percentage >= 85 ? "Stabilized & Fully Nourished" : "Active Nutritional Recovery"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px]">
                                <span className="text-gray-500 font-semibold">Net Improvement:</span>
                                <span className={`font-bold ${recoveryProgress >= 0 ? "text-emerald-700" : "text-gray-700"}`}>
                                    {hasMultipleMonths ? `+${recoveryProgress}% Recovery Gain` : "Initial Milestone Recorded"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px]">
                                <span className="text-gray-500 font-semibold">Clinical Evaluation:</span>
                                <span className={`font-bold ${releaseAnalysis.muacStatus.color}`}>
                                    {releaseAnalysis.muacStatus.label}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Status / Summary Banner */}
                    <div className="mt-4 pt-3 border-t border-emerald-200 flex items-center justify-between text-[10px]">
                        <span className="font-semibold text-emerald-800 flex items-center gap-1">
                            <span>✅</span>
                            <span>{releaseAnalysis.percentage >= 85 ? "Nutritionally Nourished & Stabilized" : "Under Continuous Nutritional Support"}</span>
                        </span>
                        <span className="text-gray-500 italic">
                            WHO protocol evaluated
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
}
