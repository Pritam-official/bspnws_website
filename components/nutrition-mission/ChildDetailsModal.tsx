"use client";

import React from "react";
import Image from "next/image";
import { ISamMamChild } from "@/models/SamMamChild";
import { ChildNutritionAnalysis, formatReportMonth } from "@/lib/nutritionLogic";

interface ModalProps {
    child: ISamMamChild | null;
    analysis: ChildNutritionAnalysis | null;
    onClose: () => void;
}

export default function ChildDetailsModal({ child, analysis, onClose }: ModalProps) {
    if (!child || !analysis) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 p-6 md:p-8 relative">
                
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 flex items-center justify-center transition-colors cursor-pointer"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Header */}
                <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                        {child.image ? (
                            <Image src={child.image} alt={child.name} fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold text-xl">
                                {child.name.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-gray-900">{child.name}</h3>
                            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${analysis.stageColor.bg} ${analysis.stageColor.text} ${analysis.stageColor.border}`}>
                                {analysis.stage}
                            </span>
                            <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                                📅 {formatReportMonth(child.dateOfEntry, child.reportMonth)}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Guardian: {child.guardianName} • {child.sex} • Age: {child.age} • Enrolled: {child.dateOfEntry}
                        </p>
                    </div>
                </div>

                {/* Real-time Dashboard Summary */}
                <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-xs font-black uppercase tracking-wider text-blue-700 block">
                                Real-time Nutrition Score
                            </span>
                            <span className="text-2xl font-black text-gray-900">
                                {analysis.percentage}% Overall Recovery Index
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-bold text-gray-500 block">Current Status</span>
                            <span className={`text-sm font-black ${analysis.stageColor.text}`}>
                                {child.anthropometricMeasurement}
                            </span>
                        </div>
                    </div>

                    {/* Score breakdown pillars */}
                    {analysis.parameters ? (
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-4">
                            <div className="bg-white p-2.5 rounded-xl border border-blue-100 text-center">
                                <span className="text-[10px] uppercase font-bold text-gray-500 block">MUAC</span>
                                <span className="text-sm font-black text-blue-700">{analysis.breakdown.muacScore} pts</span>
                                <span className="text-[10px] text-gray-400 block mt-0.5">Max {analysis.parameters.muac.maxScore}</span>
                            </div>
                            <div className="bg-white p-2.5 rounded-xl border border-blue-100 text-center">
                                <span className="text-[10px] uppercase font-bold text-gray-500 block">Weight</span>
                                <span className="text-sm font-black text-blue-700">{analysis.breakdown.weightScore} pts</span>
                                <span className="text-[10px] text-gray-400 block mt-0.5">Max {analysis.parameters.weight.maxScore}</span>
                            </div>
                            <div className="bg-white p-2.5 rounded-xl border border-blue-100 text-center">
                                <span className="text-[10px] uppercase font-bold text-gray-500 block">Height</span>
                                <span className="text-sm font-black text-blue-700">{analysis.breakdown.heightScore} pts</span>
                                <span className="text-[10px] text-gray-400 block mt-0.5">Max {analysis.parameters.height.maxScore}</span>
                            </div>
                            <div className="bg-white p-2.5 rounded-xl border border-blue-100 text-center">
                                <span className="text-[10px] uppercase font-bold text-gray-500 block">Head Circ.</span>
                                <span className="text-sm font-black text-blue-700">{analysis.breakdown.headScore} pts</span>
                                <span className="text-[10px] text-gray-400 block mt-0.5">Max {analysis.parameters.head.maxScore}</span>
                            </div>
                            <div className="bg-white p-2.5 rounded-xl border border-blue-100 text-center">
                                <span className="text-[10px] uppercase font-bold text-gray-500 block">Chest Circ.</span>
                                <span className="text-sm font-black text-blue-700">{analysis.breakdown.chestScore} pts</span>
                                <span className="text-[10px] text-gray-400 block mt-0.5">Max {analysis.parameters.chest.maxScore}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                            <div className="bg-white p-2.5 rounded-xl border border-blue-100 text-center">
                                <span className="text-[10px] uppercase font-bold text-gray-500 block">MUAC Score</span>
                                <span className="text-sm font-black text-blue-700">{analysis.breakdown.muacScore}</span>
                            </div>
                            <div className="bg-white p-2.5 rounded-xl border border-blue-100 text-center">
                                <span className="text-[10px] uppercase font-bold text-gray-500 block">Weight Progress</span>
                                <span className="text-sm font-black text-blue-700">{analysis.breakdown.weightScore}</span>
                            </div>
                            <div className="bg-white p-2.5 rounded-xl border border-blue-100 text-center">
                                <span className="text-[10px] uppercase font-bold text-gray-500 block">Height Progress</span>
                                <span className="text-sm font-black text-blue-700">{analysis.breakdown.heightScore}</span>
                            </div>
                            <div className="bg-white p-2.5 rounded-xl border border-blue-100 text-center">
                                <span className="text-[10px] uppercase font-bold text-gray-500 block">Circumferences</span>
                                <span className="text-sm font-black text-blue-700">{analysis.breakdown.headScore + analysis.breakdown.chestScore}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* WHO Growth Standards Comparison Grid */}
                {analysis.parameters && (
                    <div className="mt-6">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-xs font-black uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                                <span>📊</span>
                                <span>WHO Growth Reference Comparison ({child.sex} • {analysis.ageMonths} Months)</span>
                            </h4>
                            <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                                WHO 50th Percentile Benchmark
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                            {/* Height comparison */}
                            <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-xs">
                                <div className="flex items-center justify-between text-gray-500 font-bold text-[10px]">
                                    <span>HEIGHT (cm)</span>
                                    <span className="text-blue-700 font-bold">{analysis.parameters.height.ratioPercentage}% of WHO</span>
                                </div>
                                <div className="flex items-baseline justify-between mt-1.5">
                                    <span className="text-base font-black text-gray-900">{analysis.parameters.height.actual} cm</span>
                                    <span className="text-[11px] text-gray-500">Ref: {analysis.parameters.height.expected} cm</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2 overflow-hidden">
                                    <div
                                        className="h-1.5 rounded-full bg-blue-500"
                                        style={{ width: `${Math.min(100, analysis.parameters.height.ratioPercentage)}%` }}
                                    />
                                </div>
                            </div>

                            {/* Weight comparison */}
                            <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-xs">
                                <div className="flex items-center justify-between text-gray-500 font-bold text-[10px]">
                                    <span>WEIGHT (kg)</span>
                                    <span className="text-emerald-700 font-bold">{analysis.parameters.weight.ratioPercentage}% of WHO</span>
                                </div>
                                <div className="flex items-baseline justify-between mt-1.5">
                                    <span className="text-base font-black text-gray-900">{analysis.parameters.weight.actual} kg</span>
                                    <span className="text-[11px] text-gray-500">Ref: {analysis.parameters.weight.expected} kg</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2 overflow-hidden">
                                    <div
                                        className="h-1.5 rounded-full bg-emerald-500"
                                        style={{ width: `${Math.min(100, analysis.parameters.weight.ratioPercentage)}%` }}
                                    />
                                </div>
                            </div>

                            {/* MUAC comparison */}
                            <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-xs">
                                <div className="flex items-center justify-between text-gray-500 font-bold text-[10px]">
                                    <span>MUAC (cm)</span>
                                    <span className={`font-bold ${analysis.muacStatus.color}`}>{analysis.parameters.muac.status}</span>
                                </div>
                                <div className="flex items-baseline justify-between mt-1.5">
                                    <span className="text-base font-black text-gray-900">{analysis.parameters.muac.actual} cm</span>
                                    <span className="text-[11px] text-gray-500">Normal: &ge; {analysis.parameters.muac.expected} cm</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2 overflow-hidden">
                                    <div
                                        className="h-1.5 rounded-full bg-indigo-500"
                                        style={{ width: `${Math.min(100, analysis.parameters.muac.ratioPercentage)}%` }}
                                    />
                                </div>
                            </div>

                            {/* Head circumference */}
                            <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-xs">
                                <div className="flex items-center justify-between text-gray-500 font-bold text-[10px]">
                                    <span>HEAD CIRCUMFERENCE</span>
                                    <span className="text-gray-600 font-bold">{analysis.parameters.head.ratioPercentage}%</span>
                                </div>
                                <div className="flex items-baseline justify-between mt-1.5">
                                    <span className="text-base font-black text-gray-900">{analysis.parameters.head.actual} cm</span>
                                    <span className="text-[11px] text-gray-500">Ref: {analysis.parameters.head.expected} cm</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2 overflow-hidden">
                                    <div
                                        className="h-1.5 rounded-full bg-purple-500"
                                        style={{ width: `${Math.min(100, analysis.parameters.head.ratioPercentage)}%` }}
                                    />
                                </div>
                            </div>

                            {/* Chest circumference */}
                            <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-xs sm:col-span-2 md:col-span-2">
                                <div className="flex items-center justify-between text-gray-500 font-bold text-[10px]">
                                    <span>CHEST CIRCUMFERENCE</span>
                                    <span className="text-gray-600 font-bold">{analysis.parameters.chest.ratioPercentage}%</span>
                                </div>
                                <div className="flex items-baseline justify-between mt-1.5">
                                    <span className="text-base font-black text-gray-900">{analysis.parameters.chest.actual} cm</span>
                                    <span className="text-[11px] text-gray-500">Ref: {analysis.parameters.chest.expected} cm</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2 overflow-hidden">
                                    <div
                                        className="h-1.5 rounded-full bg-teal-500"
                                        style={{ width: `${Math.min(100, analysis.parameters.chest.ratioPercentage)}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Complete Clinical Parameters Grid */}
                <div className="mt-6">
                    <h4 className="text-xs font-black uppercase tracking-wider text-gray-700 mb-3">
                        Anthropometric & Health Parameters
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <span className="text-gray-500 font-bold block text-[10px]">WEIGHT</span>
                            <span className="font-black text-gray-900 text-sm">{child.weight} kg</span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <span className="text-gray-500 font-bold block text-[10px]">HEIGHT</span>
                            <span className="font-black text-gray-900 text-sm">{child.height} cm</span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <span className="text-gray-500 font-bold block text-[10px]">MUAC</span>
                            <span className="font-black text-gray-900 text-sm">{child.muac} cm</span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <span className="text-gray-500 font-bold block text-[10px]">HEAD CIRCUMFERENCE</span>
                            <span className="font-bold text-gray-900">{child.head} cm</span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <span className="text-gray-500 font-bold block text-[10px]">CHEST CIRCUMFERENCE</span>
                            <span className="font-bold text-gray-900">{child.chest} cm</span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <span className="text-gray-500 font-bold block text-[10px]">LAST 14 DAYS ILLNESS</span>
                            <span className="font-bold text-gray-900">{child.last14DaysIllness}</span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <span className="text-gray-500 font-bold block text-[10px]">EXCLUSIVE BREASTFEEDING</span>
                            <span className="font-bold text-gray-900">{child.ebf}</span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <span className="text-gray-500 font-bold block text-[10px]">IMMUNIZATION</span>
                            <span className="font-bold text-gray-900">{child.immunization}</span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <span className="text-gray-500 font-bold block text-[10px]">DATE OF BIRTH</span>
                            <span className="font-bold text-gray-900">{child.dateOfBirth || "Not recorded"}</span>
                        </div>
                    </div>
                </div>

                {/* Clinical Notes & Action */}
                <div className="mt-5 space-y-3">
                    <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-xs">
                        <span className="font-bold text-emerald-900 uppercase text-[10px] block mb-0.5">
                            Clinical Recommendation & Protocol:
                        </span>
                        <p className="text-emerald-800 leading-relaxed">
                            {analysis.recommendation}
                        </p>
                    </div>

                    {child.remarks && (
                        <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-xs">
                            <span className="font-bold text-amber-900 uppercase text-[10px] block mb-0.5">
                                Remarks / Dietary Observations:
                            </span>
                            <p className="text-amber-800 leading-relaxed">{child.remarks}</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                        📍 Registered Address: {child.address}
                    </span>
                    <button
                        onClick={onClose}
                        className="bg-gray-900 hover:bg-black text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
                    >
                        Close Report
                    </button>
                </div>
            </div>
        </div>
    );
}
